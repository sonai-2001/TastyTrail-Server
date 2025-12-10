import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

/**
 * Ensures a directory exists (creates it recursively if missing)
 */
function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Creates a dynamic Multer uploader middleware
 * @param folderName - e.g. "users" or "products"
 * @param fieldName - form field name
 * @param multiple - multiple file upload?
 * @param maxCount - max files if multiple
 */
export function createUploader(
  folderName: string,
  fieldName: string,
  multiple = false,
  maxCount = 5
) {
  const uploadDir = path.join(__dirname, `../../uploads/${folderName}`);
  ensureDirExists(uploadDir);

  // Storage config
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });

  // ✅ File filter with correct type
  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  });

  // Return proper middleware
  return multiple ? upload.array(fieldName, maxCount) : upload.single(fieldName);
}
