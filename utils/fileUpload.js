import utils from "util";
import fs from "fs/promises";
import path from "path";
import { upload } from "../utils/multer.js";

export const poster = utils.promisify(upload.single("poster"));

export const deletSingleFile = async (req) => {
  if (req.file) {
    const fileStats = await fs.stat(req.file.path);
    if (fileStats.isFile()) {
      await fs.unlink(req.file.path);
    }
  }
};

export const deleteSingleFileWithPath = async (filePath) => {
  try {
    const fileStats = await fs.stat(filePath);
    if (fileStats.isFile()) {
      await fs.unlink(filePath);
      console.log(`File ${filePath} deleted successfully.`);
    } else {
      console.log(`Path ${filePath} is not a file.`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};
