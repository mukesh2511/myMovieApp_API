import createError from "../utils/error.js";
import Movie from "../models/movieModel.js";
import {
  deleteSingleFileWithPath,
  deletSingleFile,
} from "../utils/fileUpload.js";

export const addMultipleMovies = async (req, res, next) => {
  if (req.isAdmin === false) {
    return next(createError(403, "You are not authorized to add movies."));
  }
  try {
    const { page } = req.body;

    // Fetch movies from TMDB API
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=e896946ecbab79bbb810c95651303d42&page=${page}`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return next(createError(404, "Movies not found"));
    }

    const moviesToSave = data.results.map((movie) => ({
      title: movie.title || "No title available",
      overview: movie.overview || "No overview available",
      poster_path: movie.poster_path || "No poster available",
      release_date: movie.release_date || "00:00-00",
      popularity: movie.popularity || 0,
      rating: movie.vote_count || 0,
      vote_average: movie.vote_average || 0,
    }));

    // Bulk insert using insertMany() for better performance
    await Movie.insertMany(moviesToSave);

    res.status(201).json({
      message: "Movies added successfully",
      count: moviesToSave.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMovies = async (req, res, next) => {
  try {
    const { search = "", page = 1, size = 20, sort = "" } = req.query;

    // Pagination setup
    const limit = parseInt(size);
    const currentPage = parseInt(page);
    const skip = (currentPage - 1) * limit;

    // Search condition (case-insensitive regex for partial matches)
    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } }, // Case-insensitive search on title
            { overview: { $regex: search, $options: "i" } }, // Case-insensitive search on overview
          ],
        }
      : {}; // If no search query, fetch all movies
    const sortOptions = {
      name: { title: 1 }, // Sort by name (ascending)
      rating: { vote_average: -1 }, // Sort by rating (descending)
      releaseDate: { release_date: -1 }, // Sort by release date (newest first)
    };
    const sortCriteria = sort ? sortOptions[sort] || {} : {};

    // Fetch movies with pagination
    const movies = await Movie.find(searchQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // Total results count for pagination
    const totalResults = await Movie.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalResults / limit);

    // Response format
    res.status(200).json({
      page: currentPage,
      results: movies,
      total_pages: totalPages,
      total_results: totalResults,
    });
  } catch (error) {
    next(error);
  }
};

export const addMovie = async (req, res, next) => {
  if (req?.isAdmin === false) {
    return next(createError(403, "You are not authorized to add movies."));
  }
  try {
    const {
      title,
      release_date,
      overview,
      popularity,
      poster_path,
      rating,
      vote_average,
    } = req.body;
    const movie = new Movie({
      title,
      overview,
      release_date,
      popularity,
      poster_path,
      rating,
      vote_average,
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};
export const editMovie = async (req, res, next) => {
  console.log({ iaadmin: req.isAdmin });
  if (req.isAdmin === false) {
    return next(createError(403, "You are not authorized to add movies."));
  }
  try {
    const { id } = req.params;
    const {
      title,
      overview,
      release_date,
      popularity,
      poster_path,
      vote_average,
    } = req.body;
    const movie = await Movie.findByIdAndUpdate(
      id,
      {
        title,
        overview,
        release_date,
        popularity,
        poster_path,
        vote_average,
      },
      { new: true }
    );
    if (!movie) {
      return next(createError(404, "Movie not found"));
    }
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};
export const deleteMovie = async (req, res, next) => {
  if (req.isAdmin === false) {
    return next(createError(403, "You are not authorized to add movies."));
  }
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return next(createError(404, "Movie not found"));
    }
    // If the movie has a poster path, delete the file
    if (movie.poster_path && movie.poster_path.startsWith("public")) {
      await deleteSingleFileWithPath(movie.poster_path);
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    next(error);
  }
};
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return next(createError(404, "Movie not found"));
    }
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};
export const deletePoster = async (req, res, next) => {
  try {
    const filepath = req.body.poster_path;
    if (filepath.startsWith("public")) {
      await deleteSingleFileWithPath(filepath);
    }

    console.log("filepath", filepath);
    return res.status(200).json({
      message: "File deleted",
    });
  } catch (error) {
    console.log(error);
  }
};
export const uploadPoster = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return next(createError(400, "No file uploaded"));
    }
    const filePath = file.path;
    console.log("uploaded file path:", filePath);
    return res.status(200).json({
      message: "File uploaded successfully",
      imageUrl: filePath, // Send the file path back to the client
    });
  } catch (error) {
    deletSingleFile(req);
    console.log(error);
    next(error);
  }
};
