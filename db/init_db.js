// code to build and initialize DB goes here
const {
  client,
  // other db methods
  createUser,
  createLink,
  createComment,
  createTag,
  getUser,
  getUserByUsername,
} = require("./index");

const buildTables = async () => {
  try {
    client.connect();
    // drop tables in correct order
    console.log("Dropping all tables...");
    await client.query(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS links;
    DROP TABLE IF EXISTS users;
   `);
    console.log("Tables dropped succesfully");

    // build tables in correct order
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
    );
      CREATE TABLE links(
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(id),
        title varchar(255) NOT NULL,
        url varchar(255) NOT NULL,
        "clickCount" INT NOT NULL,
        date DATE NOT NULL,
        UNIQUE ("creatorId", url)
    );
      CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(id),
        "linkId" INTEGER REFERENCES links(id),
        body varchar(255) NOT NULL
    );
      CREATE TABLE tags(
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(id),
        "linkId" INTEGER REFERENCES links(id),
        "tagName" varchar(255) NOT NULL,
        UNIQUE ("linkId", "tagName")
    );
  `);
    console.log("Tables created succesfully");
  } catch (error) {
    console.error("error dropping/creating tables");
    throw error;
  }
};

const createInitialUsers = async () => {
  try {
    console.log("Starting to create users...");
    const usersToCreate = [
      { username: "albert", password: "bertie99" },
      { username: "sandra", password: "sandra123" },
      { username: "glamgal", password: "glamgal123" },
      { username: "austin", password: "12345678" },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));
    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error(error);
  }
};

const createInitialLinks = async () => {
  try {
    console.log("Starting to create links...");
    const linksToCreate = [
      {
        creatorId: 1,
        title: "Google",
        url: "https://www.google.com",
        clickCount: 5,
        date: "2021-06-10",
      },
      {
        creatorId: 1,
        title: "YouTube",
        url: "https://www.youtube.com",
        clickCount: 3,
        date: "2021-05-14",
      },
      {
        creatorId: 2,
        title: "W3Schools",
        url: "https://www.w3schools.com/",
        clickCount: 2,
        date: "2021-01-17",
      },
      {
        creatorId: 2,
        title: "Netflix",
        url: "https://www.netflix.com/",
        clickCount: 1,
        date: "2021-03-28",
      },
      {
        creatorId: 3,
        title: "Twitter",
        url: "https://www.twitter.com/",
        clickCount: 0,
        date: "2020-12-13",
      },
      {
        creatorId: 4,
        title: "Tumblr",
        url: "https://www.tumblr.com/",
        clickCount: 2,
        date: "2021-01-17",
      },
      {
        creatorId: 4,
        title: "yahoo",
        url: "https://www.yahoo.com/",
        clickCount: 1,
        date: "2021-03-28",
      },
      {
        creatorId: 4,
        title: "codepen",
        url: "https://www.codepen.com/",
        clickCount: 2,
        date: "2021-01-17",
      },
      {
        creatorId: 2,
        title: "StackOverflow",
        url: "https://www.stackOverflow.com/",
        clickCount: 1,
        date: "2021-03-28",
      },
    ];
    const links = await Promise.all(linksToCreate.map(createLink));
    console.log("Links created:");
    console.log(links);
    console.log("Finished creating links!");
  } catch (error) {
    console.log("Error creating links!");
    console.error(error);
  }
};

const createInitialComments = async () => {
  try {
    console.log("Starting to create comments...");
    const commentsToCreate = [
      {
        creatorId: 1,
        linkId: 1,
        body: "Probably the best website ever!",
      },
      {
        creatorId: 1,
        linkId: 1,
        body: "The best!!",
      },
      {
        creatorId: 2,
        linkId: 2,
        body: "Check this out!",
      },
      {
        creatorId: 2,
        linkId: 3,
        body: "Wow... just wow.",
      },
      {
        creatorId: 3,
        linkId: 4,
        body: "My favorite :)",
      },
      {
        creatorId: 3,
        linkId: 4,
        body: "This is the coolest site omg",
      },
    ];
    const comments = await Promise.all(commentsToCreate.map(createComment));
    console.log("Comments created:");
    console.log(comments);
    console.log("Finished creating comments!");
  } catch (error) {
    console.log("Error creating comments!");
    console.error(error);
  }
};

const createInitialTags = async () => {
  try {
    console.log("Starting to create tags...");

    const tagsToCreate = [
      {
        creatorId: 2,
        linkId: 3,
        tagName: "Favorite",
      },
      {
        creatorId: 2,
        linkId: 3,
        tagName: "School",
      },
      {
        creatorId: 2,
        linkId: 4,
        tagName: "Favorite",
      },
      {
        creatorId: 2,
        linkId: 3,
        tagName: "Video",
      },
      {
        creatorId: 2,
        linkId: 4,
        tagName: "Entertainment",
      },
      {
        creatorId: 2,
        linkId: 1,
        tagName: "School",
      },
      {
        creatorId: 1,
        linkId: 2,
        tagName: "Entertainment",
      },
      {
        creatorId: 1,
        linkId: 1,
        tagName: "Favorite",
      },
    ];
    const tags = await Promise.all(tagsToCreate.map(createTag));
    console.log("Tags created:");
    console.log(tags);
    console.log("Finished creating tags!");
    return tags;
  } catch (error) {
    console.log("Error creating tags!");
    console.error(error);
  }
};

async function populateInitialData() {
  try {
    await createInitialUsers();
    await createInitialLinks();
    await createInitialComments();
    await createInitialTags();
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());

//changed click-count to camelcase clickCount bc it is used in multiple functions.
