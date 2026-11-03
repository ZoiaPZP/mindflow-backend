import { isHttpError } from 'http-errors';
import multer from 'multer';
import { MAX_UPLOAD_SIZE_MB } from './upload.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); 
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `File is too large (max ${MAX_UPLOAD_SIZE_MB} MB).`
        : err.message;
    return res.status(400).json({ status: 400, message, data: null });
  }

  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: null,
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Something went wrong!',
    error: err.message || 'Unknown error',
  });
};
