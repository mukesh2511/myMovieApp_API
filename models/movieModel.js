import mongoose from "mongoose";
const { Schema } = mongoose;

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    release_date: {
      type: Date,
      required: true,
    },
    popularity: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    vote_average: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
