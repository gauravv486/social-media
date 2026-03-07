import cloudinary from '../config/cloudinary.js';

const uploadImage = (fileBuffer, folder = 'social-media') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url); // ← returns https://res.cloudinary.com/...
            }
        );
        stream.end(fileBuffer); // send the image buffer
    });
};

export default uploadImage;
