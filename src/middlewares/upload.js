import multer from 'multer';
import path from 'node:path';
import createHttpError from 'http-errors';

export const MAX_UPLOAD_SIZE_MB = 5;

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'uploads');//uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createHttpError(400, 'Only image files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
});

export { upload };