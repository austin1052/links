const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const { getAllLinks, getUserById } = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

async function attachUser(req, res, next) {
  try {
    const auth = req.header("Authorization");
    const prefix = "Bearer ";
    if (!auth) {
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.replace(prefix, "");
      const parsedToken = jwt.verify(token, JWT_SECRET);
      const id = parsedToken.id;
      const user = await getUserById(id);
      if (!user) {
        next(new Error("could not find user"));
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

apiRouter.use(attachUser);

// ROUTES

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const linksRouter = require("./links");
apiRouter.use("/links", linksRouter);

const commentsRouter = require("./comments");
apiRouter.use("/comments", commentsRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

module.exports = apiRouter;
