// ==========================================
// Forma AI - Upload Middleware
// ==========================================

import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ==========================================
// __dirname for ES Modules
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// Upload Directory
// ==========================================

const uploadDirectory = path.join(
  __dirname,
  "../uploads/documents"
);

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ==========================================
// Storage Configuration
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const uniqueName =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, uniqueName);
  },
});

// ==========================================
// Allowed File Types
// ==========================================

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const allowedExtensions = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
];

// ==========================================
// File Filter
// ==========================================

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const isMimeTypeAllowed =
    allowedMimeTypes.includes(file.mimetype);

  const isExtensionAllowed =
    allowedExtensions.includes(extension);

  if (
    isMimeTypeAllowed &&
    isExtensionAllowed
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, JPG, JPEG and PNG files are allowed."
      ),
      false
    );
  }
};

// ==========================================
// Multer Configuration
// ==========================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum file size: 10 MB
    fileSize: 10 * 1024 * 1024,

    // Maximum number of files
    files: 10,
  },
});

// ==========================================
// Default Export
// ==========================================

export default upload;