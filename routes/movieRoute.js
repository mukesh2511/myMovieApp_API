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

const router = express.Router();

router.get("/allmovies", getAllMovies);
router.post("/addmoviemultiple", addMultipleMovies);
router.post("/addmovie", addMovie);
router.put("/editmovie/:id", editMovie);
router.delete("/deletemovie/:id", deleteMovie);
router.get("/getmovie/:id", getMovieById);
router.post("/upload", poster, uploadPoster);
router.post("/deleteposter", deletePoster);

export default router;
