import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema({
  original_title: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const MovieModel = mongoose.model("Movie", MovieSchema);

export default MovieModel;
