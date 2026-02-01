import { NextFunction, Request, RequestHandler, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

// helpers

const getUploadPath = (subDir: string) => path.join(process.cwd(), "uploads", subDir);

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const generateFileName = (originalName: string) => {
  const ext = path.extname(originalName);
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"];
const PDF_TYPES = ["application/pdf"];

export function createUploader(uploadDir: string, fieldName: string, multiple = false, maxCount = 5): RequestHandler {
  const absolutePath = getUploadPath(uploadDir);
  ensureDirExists(absolutePath);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, absolutePath),
    filename: (_req, file, cb) => cb(null, generateFileName(file.originalname)),
  });

  const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const isImage = IMAGE_TYPES.includes(file.mimetype);
    const isVideo = VIDEO_TYPES.includes(file.mimetype);
    const isPdf = PDF_TYPES.includes(file.mimetype);

    if (!isImage && !isVideo && !isPdf) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

  const multerMiddleware = multiple ? upload.array(fieldName, maxCount) : upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    multerMiddleware(req, res, (err) => {
      if (err) return next(err);

      const files = multiple ? (req.files as Express.Multer.File[]) : req.file ? [req.file] : [];

      for (const file of files) {
        const isVideo = VIDEO_TYPES.includes(file.mimetype);
        const isPdf = PDF_TYPES.includes(file.mimetype);

        let maxSize = 5 * 1024 * 1024; // default 5 MB

        if (isVideo) maxSize = 20 * 1024 * 1024;
        if (isPdf) maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
          return next(new multer.MulterError("LIMIT_FILE_SIZE", file.fieldname));
        }
      }

      next();
    });
  };
}

type UploadFieldConfig = {
  name: string;
  folder: string;
  maxCount: number;
};

// for multiple field upload
export function createFieldBasedUploader(fields: UploadFieldConfig[]): RequestHandler {
  const folderMap = new Map(fields.map((f) => [f.name, f.folder]));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = folderMap.get(file.fieldname);
      if (!folder) {
        return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname), "");
      }

      const uploadPath = getUploadPath(folder);
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },

    filename: (_req, file, cb) => {
      cb(null, generateFileName(file.originalname));
    },
  });

  const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const isImage = IMAGE_TYPES.includes(file.mimetype);
    const isVideo = VIDEO_TYPES.includes(file.mimetype);
    const isPdf = PDF_TYPES.includes(file.mimetype);

    if (!isImage && !isVideo && !isPdf) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

  const multerMiddleware = upload.fields(fields.map(({ name, maxCount }) => ({ name, maxCount })));

  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) return next(err);

      const filesMap = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      for (const field in filesMap) {
        for (const file of filesMap[field]) {
          const isImage = IMAGE_TYPES.includes(file.mimetype);
          const maxSize = isImage ? 5 * 1024 * 1024 : 20 * 1024 * 1024;

          if (file.size > maxSize) {
            return next(new multer.MulterError("LIMIT_FILE_SIZE", field));
          }
        }
      }

      next();
    });
  };
}

