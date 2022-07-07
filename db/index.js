// Connect to DB
const { Client } = require("pg");
const DB_NAME = "localhost:5432/linkerator";
const DB_URL = process.env.DATABASE_URL || `postgres://${DB_NAME}`;

// const client = new Client(DB_URL);
const client = new Client({
  connectionString: DB_URL,
  ssl: process.env.DATABASE_URL ? true : false
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

const bcrypt = require("bcrypt");

// USER

// POST api/user/register
//creates a new user
const createUser = async ({ username, password }) => {
  const hashedPassword = await hashPassword(password);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password) VALUES ($1, $2)
      RETURNING id, username;
    `,
      [username, hashedPassword]
    );
    return user;
  } catch (error) {
    console.error("createUser", error);
    throw error;
  }
};

//
const getUserByUsername = async (username) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users WHERE username=$1;
    `,
      [username]
    );
    if (!user) return null;
    return user;
  } catch (error) {
    throw error;
  }
};

// POST api/users/login
//returns id and username
//id can be used in getAllLinks function to get only links by user
const getUser = async ({ username, password }) => {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }
  const hashedPassword = user.password;

  try {
    if (await bcrypt.compare(password, hashedPassword)) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    console.log("get user by id");
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username FROM users WHERE id=$1;
    `,
      [id]
    );
    if (!user) return null;
    return user;
  } catch (error) {
    throw error;
  }
};

//util functions
async function hashPassword(password) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  return hashedPassword;
}

// LINKS

`SELECT links.*, comments.body`

// GET api/links/:userId
const getAllLinks = async (id, query) => {
  try {
    if(arguments.length == 1) // Means second parameter is not passed
      {
        query = [];
      }
    const { rows: links } = await client.query(
      `
      SELECT * FROM links WHERE "creatorId"=$1 ORDER BY id ASC ;
      `,
      [id]
    );

    const tags = await getAllTags(id);
    const comments = await getAllComments(id);
    console.log({ comments });

    //adds tags array to link
    links.forEach((link) => {
      link.tags = [];
      tags.forEach((tag) => {
        if (link.id === tag.linkId) {
          link.tags.push({
            id: tag.id,
            tagName: tag.tagName,
          });
        }
      });
    });

    //adds comment array to link
    links.forEach((link) => {
      link.comments = [];
      comments.forEach((comment) => {
        if (link.id === comment.linkId) {
          link.comments.push({
            id: comment.id,
            body: comment.body,
          });
        }
      });
    });
    return links;
  } catch (error) {
    console.error(error);
  }
};

const searchLinks = async (query) => {
  try {
    const {
      rows: results
    } = await client.query(`
      SELECT 
    `)
  } catch (error) {
    
  }
}

// POST api/links
//creates link in links table
const createLink = async ({ creatorId, title, url, clickCount, date }) => {
  try {
    const {
      rows: [link],
    } = await client.query(
      `
    INSERT INTO links("creatorId", title, url, "clickCount", date) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [creatorId, title, url, clickCount, date]
    );
    return link;
  } catch (error) {
    console.error(error);
  }
};

// DELETE api/links/:linkId
//deletes link from links table by link id
//deletes all comments and tags with matching linkId
const destroyLink = async (id) => {
  try {
    await destroyAllTags(id);
    await destroyAllComments(id);
    const {
      rows: [link],
    } = await client.query(
      `
  DELETE
  FROM links
  WHERE id=$1
  RETURNING *;`,
      [id]
    );
    return link;
  } catch (error) {
    console.error(error);
  }
};

// PATCH api/links/:linkId
//updates link title
const updateLink = async ({ linkId, title, url }) => {
  try {
    const {
      rows: [updatedLink],
    } = await client.query(
      `
      UPDATE links SET title=$1, url=$2 WHERE id=$3 RETURNING *;
    `,
      [title, url, linkId]
    );
    return updatedLink;
  } catch (error) {
    throw error;
  }
};

const updateClickCount = async ({ clickCount, linkId }) => {
  try {
    const {
      rows: [updatedLink],
    } = await client.query(
      `
      UPDATE links SET "clickCount"=$1 WHERE id=$2 RETURNING *;
    `,
      [clickCount, linkId]
    );
    return updatedLink;
  } catch (error) {
    throw error;
  }
};

// TAGS

// POST api/tags/:linkId
//creates tag in tags table
const createTag = async ({ creatorId, linkId, tagName }) => {
  try {
    const {
      rows: [tag],
    } = await client.query(
      `
    INSERT INTO tags("creatorId", "linkId", "tagName") VALUES ($1, $2, $3) RETURNING *;
    `,
      [creatorId, linkId, tagName]
    );
    return tag;
  } catch (error) {
    console.error(error);
  }
};

const destroyAllTags = async (linkId) => {
  try {
    const { rows: tags } = await client.query(
      `
  DELETE
  FROM tags
  WHERE "linkId"=$1
  RETURNING *;`,
      [linkId]
    );
    return tags;
  } catch (error) {
    console.error(error);
  }
};

//deletes tag from tags table by tag id
const destroyTag = async (id) => {
  try {
    const {
      rows: [tag],
    } = await client.query(
      `
  DELETE
  FROM tags
  WHERE id=$1
  RETURNING *;`,
      [id]
    );
    return tag;
  } catch (error) {
    console.error(error);
  }
};

//returns an object with id, linkId, and tagName
const getTagById = async (id) => {
  try {
    const {
      rows: [tag],
    } = await client.query(
      `
      SELECT * FROM tags WHERE id=$1 ORDER BY Len("tagName");
      `,
      [id]
    );
    return tag;
  } catch (error) {
    console.error(error);
  }
};

//gets all tags sorted A -> Z
const getAllTags = async (creatorId) => {
  try {
    const { rows: tags } = await client.query(
      `
      SELECT * FROM tags WHERE "creatorId"=$1 ORDER BY "tagName" ASC;
      `,
      [creatorId]
    );
    return tags;
  } catch (error) {
    console.error(error);
  }
};

// COMMENTS

// POST api/comments/:linkId
//creates comment in comment table
//linkId as argument or param??
const createComment = async ({ creatorId, linkId, body }) => {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
    INSERT INTO comments("creatorId", "linkId", body) VALUES ($1, $2, $3) RETURNING id, body;
    `,
      [creatorId, linkId, body]
    );
    return comment;
  } catch (error) {
    console.error(error);
  }
};

const destroyComment = async (id) => {
  try {
    const {
      rows: [comment],
    } = await client.query(
      `
  DELETE
  FROM comments
  WHERE id=$1
  RETURNING *;`,
      [id]
    );
    return comment;
  } catch (error) {
    console.error(error);
  }
};

const destroyAllComments = async (linkId) => {
  try {
    const { rows: comments } = await client.query(
      `
  DELETE
  FROM comments
  WHERE "linkId"=$1
  RETURNING *;`,
      [linkId]
    );
    return comments;
  } catch (error) {
    console.error(error);
  }
};

const getAllComments = async (creatorId) => {
  try {
    const { rows: comments } = await client.query(
      `
      SELECT * FROM comments WHERE "creatorId"=$1;
      `,
      [creatorId]
    );
    return comments;
  } catch (error) {
    console.error(error);
  }
};

//require and re-export
module.exports = {
  client,
  createUser,
  getUser,
  getUserByUsername,
  getUserById,
  getAllLinks,
  createLink,
  destroyLink,
  updateLink,
  updateClickCount,
  createTag,
  destroyTag,
  destroyAllTags,
  getTagById,
  getAllTags,
  createComment,
  destroyComment,
  destroyAllComments,
  getAllComments,
};
