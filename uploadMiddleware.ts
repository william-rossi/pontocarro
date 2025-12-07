import multer, { Multer } from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';

// Configura o armazenamento para o Multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'vehicles'); // Assumindo que 'uploads' está na raiz do projeto
        // Ensure the directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        console.log('Multer destination function received:', { body: req.body, file: file });
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nome de arquivo único
    },
});

// Filtro de arquivos para aceitar apenas imagens
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false); // Passa `null` para o argumento de erro, indicando que não houve erro de filtro.
    }
};

// Inicializa o upload do Multer
export const uploadVehicleImages = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).array('images', 10); // Máximo de 10 imagens, 5MB cada
