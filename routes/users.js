const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

const { createUser, getUserByUsername, getUser } = require("../db/index");

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //returns id, username, password
    const _user = await getUserByUsername(username);
    if (_user) {
      const error = new Error("Username already exists!");
      return res.status(400).send({
        data: error.message,
      });
    }
    if (password.length < 8) {
      const error = new Error("Password must be at least 8 characters.");
      return res.status(400).send({
        data: error.message,
      });
    }
    //returns id and username. Password is not returned.
    const user = await createUser({ username, password });
    const token = jwt.sign(user, JWT_SECRET);
    res.send({ user, message: "User is registered.", token });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please enter both a username and password.",
    });
  }

  try {
    //password is checked against hashed password inside getUser();
    const user = await getUser(req.body);
    if (user) {
      const { id, username } = user;
      const token = jwt.sign(user, JWT_SECRET);
      res.send({
        message: "You have successfully logged in!",
        token: token,
        user: {
          id,
          username,
        },
      });
    } else {
      next({
        name: "InvalidCredentialsError",
        message: "The username or password you entered is incorrect.",
      });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      const error = new Error("no user found");
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
