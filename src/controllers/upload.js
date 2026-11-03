import { updateUserService } from "../services/userUpload.js";
import { uploadCloud } from "../utils/uploadToClaudinary.js";
import fs from "node:fs/promises";


export async function uploadPhotoController(req, res, next) {
  try {
    
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: 'No file uploaded.'
      });
    }

    
    let photoUrl;
    try {
      photoUrl = await uploadCloud(req.file.path);
    } finally {
      await fs.unlink(req.file.path).catch(() => {});
    }

   
    
    const userId = req.user._id;


    const updatedUser = await updateUserService(userId, {
      avatarUrl: photoUrl
    });


    res.status(200).json({
      status: 200,
      message: 'Фото успішно завантажено та збережено!',
      data: updatedUser,
    });
  } catch (error) {

    console.error('Помилка у uploadPhotoController:', error);
    next(error);
  }
}