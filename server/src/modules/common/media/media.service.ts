import { v2 as cloudinary } from 'cloudinary';
import config from '../../../config/config.js';
import streamifier from 'streamifier';

cloudinary.config({
  cloudinary_url: config.CLOUDINARY_URL
});


const uploadImage = async (
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const options: any = { folder };
    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete Cloudinary image:', error);
    throw error;
  }
};

export default {
    uploadImage,
    deleteImage
};