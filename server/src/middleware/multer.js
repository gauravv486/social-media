import multer from 'multer';

// Store file in memory (not on disk)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);   // ✅ accept
        } else {
            cb(new Error('Only images allowed'), false); // ❌ reject
        }
    }
});

export default upload;
