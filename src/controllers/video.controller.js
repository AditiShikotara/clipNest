import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

// ---------------------------------------------------
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    const pipeline = []

    // 1. search by title/description
    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } }
                ]
            }
        })
    }

    // 2. filter by userId
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId")
        }
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    // 3. only fetch published videos
    pipeline.push({ $match: { isPublished: true } })

    // 4. sorting
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        })
    } else {
        pipeline.push({ $sort: { createdAt: -1 } })
    }

    // 5. join owner details
    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                ownerDetails: { $first: "$ownerDetails" }
            }
        }
    )

    const videoAggregate = Video.aggregate(pipeline)

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const videos = await Video.aggregatePaginate(videoAggregate, options)

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})

// ---------------------------------------------------
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Video file upload failed")
    }
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail upload failed")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user?._id,
        isPublished: true
    })

    const uploadedVideo = await Video.findById(video._id)

    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong while publishing the video")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, uploadedVideo, "Video published successfully"))
})

// ---------------------------------------------------
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        }
    ])

    if (!video?.length) {
        throw new ApiError(404, "Video not found")
    }

    // increment views
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } })

    // add to user's watch history
    await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: { watchHistory: videoId }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video fetched successfully"))
})

// ---------------------------------------------------
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    const updateFields = {}
    if (title) updateFields.title = title
    if (description) updateFields.description = description

    const thumbnailLocalPath = req.file?.path

    let thumbnail
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if (!thumbnail?.url) {
            throw new ApiError(400, "Error while uploading thumbnail")
        }
        updateFields.thumbnail = thumbnail.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true }
    )

    // delete old thumbnail after successful update
    if (thumbnailLocalPath && video.thumbnail) {
        await deleteFromCloudinary(video.thumbnail)
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
})

// ---------------------------------------------------
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    // cleanup cloudinary assets
    await deleteFromCloudinary(video.videoFile, "video")
    await deleteFromCloudinary(video.thumbnail)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"))
})

// ---------------------------------------------------
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to change publish status")
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isPublished: video.isPublished },
                "Publish status toggled successfully"
            )
        )
})

export {
    deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo
}
