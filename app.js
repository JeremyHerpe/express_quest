require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

app.listen(port, err => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
//______________________________________________________________________________________________________

// const isItDwight = (req, res) => {
//   if (
//     req.body.email === "dwight@theoffice.com" &&
//     req.body.password === "123456"
//   ) {
//     res.send("Credentials are valid");
//   } else {
//     res.sendStatus(401);
//   }
// };

//________________________________________________________________________________________________________

const userHandlers = require("./userHandlers");
const movieHandlers = require("./movieHandlers");
const {
  validateMovie,
  validateUser,
  getUserByEmailWithPasswordAndPassToNext,
} = require("./validator.js");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

app.get("/", welcome);

// PUBLIC ___________________________________________________________________________________________________

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.post(
  "/api/users",
  verifyToken,
  hashPassword,
  validateUser,
  userHandlers.postUser
);

// PRIVATE ____________________________________________________________________________________________________
app.use(verifyToken);

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.put(
  "/api/users/:id",
  verifyToken,
  hashPassword,
  validateUser,
  userHandlers.updateUser
);
app.delete("/api/users/:id", userHandlers.deleteUser);
