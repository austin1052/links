const express = require("express");
const linksRouter = express.Router();
const { requireUser } = require("./utils");

const {
  getAllLinks,
  createLink,
  destroyLink,
  updateLink,
  updateClickCount,
} = require("../db");

linksRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const links = await getAllLinks(userId);
    res.send(links);
  } catch (error) {
    next(error);
  }
});

linksRouter.post("/", requireUser, async (req, res, next) => {
  const { title, url } = req.body;
  const creatorId = req.user.id;
  const date = new Date();
  try {
    const link = await createLink({
      creatorId,
      title: title,
      url: url,
      clickCount: 0,
      date: date,
    });
    res.send(link);
  } catch (error) {
    next(error);
  }
});

//destroys link and all comments and tags for link
linksRouter.delete("/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;
  try {
    const link = await destroyLink(id);
    res.send(link);
  } catch (error) {
    next(error);
  }
});

linksRouter.patch("/:linkId", requireUser, async (req, res, next) => {
  const { linkId } = req.params;
  const { title, url } = req.body;
  try {
    const link = await updateLink({ linkId, title, url });
    res.send(link);
  } catch (error) {
    console.error({ error });
    next(error);
  }
});

linksRouter.patch("/click/:linkId", requireUser, async (req, res, next) => {
  const { linkId } = req.params;
  const { clickCount } = req.body;
  try {
    const link = await updateClickCount({ clickCount, linkId });
    res.send(link);
  } catch (error) {
    console.error({ error });
    next(error);
  }
});

module.exports = linksRouter;
