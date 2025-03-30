import {
  addMovie,
  deleteMovie,
  editMovie,
  getAllMovies,
  getMovieById,
  addMultipleMovies,
  uploadPoster,
  deletePoster,
} from "../controllers/movieController.js";
import express from "express";
import { poster } from "../utils/fileUpload.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/allmovies", getAllMovies);
router.post("/addmoviemultiple", verifyToken, addMultipleMovies);
router.post("/addmovie", verifyToken, addMovie);
router.put("/editmovie/:id", verifyToken, editMovie);
router.delete("/deletemovie/:id", verifyToken, deleteMovie);
router.get("/getmovie/:id", getMovieById);
router.post("/upload", poster, uploadPoster);
router.post("/deleteposter", deletePoster);

export default router;
