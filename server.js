import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fileUpload from "express-fileupload";
import Movie from "./models/movie.js";
import { connectToDb } from "./utils/db.js";
import cors from "cors";
import mongoose from "mongoose";
connectToDb();

const server = express();

server.use(express.json());
server.use(fileUpload());
server.use(cors());

server.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find().select({ original_title: 1 });

    return res.status(200).send(movies);
  } catch (e) {
    return res.status(500).json({
      error: e,
    });
  }
});

server.post("/movies", async (req, res) => {
  try {
    if (
      !["image/png", "image/jpeg", "image/jpg"].includes(req.files.img.mimetype)
    )
      return res.status(400).json({
        error: "Formato invalido. Solo JPG, JPEG, PNG son aceptados.",
      });
    const movie = new Movie({
      original_title: req.body.original_title,
      img: {
        data: req.files.img.data,
        contentType: "image/png",
      },
    });

    const result = await movie.save();

    res.status(200).send(result);
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
});

server.get("/images/:id", async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({
      error: "El formato del id introducido es invalido",
    });

  const movie = await Movie.findById(id);

  if (!movie)
    return res.status(404).json({
      error:
        "El id de imagen introducido no fue encontrado en nuestra base de datos",
    });

  const buffer = movie.img.data;

  var image = Buffer.from(buffer, "base64");

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": image.length,
  });

  res.end(image);
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
