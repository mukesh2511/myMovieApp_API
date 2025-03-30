import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    likedMovies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
