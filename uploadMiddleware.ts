import multer, { Multer } from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'vehicles'); // Assuming 'uploads' is at the project root
        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        console.log('Multer destination function received:', { body: req.body, file: file }); // Added debug log
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false); // Change to null for error argument
    }
};

// Initialize Multer upload
export const uploadVehicleImages = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).array('images', 10); // Max 10 images, 5MB each
