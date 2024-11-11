import {Song} from '../models/song.model.js'
import { Album } from '../models/album.model.js';
import { cloudinary } from '../lib/cloudinary.js';


const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'auto' ,
        });

        return result.secure_url;

        } catch (error) {
            console.error("Error uploading file", error);
            throw new Error("Failed to upload file");
        }
    }

export const createSong = async (req, res, next) => {
   try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
        return res.status(400).json({ success: false, message: "Audio and image files are required" });
    }
    const {title, artist, duration, albumId} = req.body;

    const audioFile = req.files.audioFile[0];
    const imageFile = req.files.imageFile[0];

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
        title,
        artist,
        duration,
        audioUrl,
        imageUrl,
        albumId: albumId || null
    });

    await song.save();

    if (albumId) {
        await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
    }

    res.status(201).json({ success: true, message: "Song created successfully", song });
   } catch (error) {
    console.error("Error creating song:", error);
    next(error);
   }
};

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;
        const song = await Song.findById(id);
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Song deleted successfully" });
    } catch (error) {
        console.error("Error deleting song:", error);
        next(error);
    }
};
