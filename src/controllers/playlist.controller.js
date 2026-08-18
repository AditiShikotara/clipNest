import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// ---------------------------------------------------
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name || name?.trim() === "") {
        throw new ApiError(400, "Name is required")
    }
    if (!description || description?.trim() === "") {
        throw new ApiError(400, "Description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating the playlist")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

// ---------------------------------------------------
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $addFields: {
                videoCount: { $size: "$videos" }
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

// ---------------------------------------------------
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
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
                ]
            }
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

    if (!playlist?.length) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist[0], "Playlist fetched successfully"))
})

// ---------------------------------------------------
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
})

// ---------------------------------------------------
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully")
        )
})

// ---------------------------------------------------
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"))
})

// ---------------------------------------------------
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    if (!name || name?.trim() === "") {
        throw new ApiError(400, "Name is required")
    }
    if (!description || description?.trim() === "") {
        throw new ApiError(400, "Description is required")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"))
})

export {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist
}
