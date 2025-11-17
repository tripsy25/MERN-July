import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";
import fs from "fs";
import path from 'path';

import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const articleInfo = [
//   { articleName: "learn-node", upvotes: 0, comments: [] },
//   { articleName: "learn-react", upvotes: 0, comments: [] },
//   { articleName: "learn-mongo", upvotes: 0, comments: [] },
// ];
const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(cors());

// app.get('/', function (req, res){
//     // res.send('Hello');
//     console.log('hello')
// })

app.use(express.json());

let db;

async function connectToDB() {
  const uri = !process.env.MONGODB_USERNAME 
  ? "mongodb://127.0.0.1:27017" 
  : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}}@cluster0.7jbj2aa.mongodb.net/?appName=Cluster0`;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();

  db = client.db("full-stack-react-db");
}

app.use(express.static(path.join(__dirname, '../dist')))

app.get(/^(?!\/api).+/, (req, res)=>{
  res.sendFile(path.join(__dirName, '../dist/index.html'));
})

app.get("/api/articles/:articleName", async (req, res) => {
  const { articleName } = req.params;

  const article = await db.collection("articles").findOne({ articleName });

  res.json(article);
});

//Middleware
app.use(async (req, res, next) => {
  const token = req.headers.authtoken;

  if (token) {
    try {
      const user = await admin.auth().verifyIdToken(token);
      req.user = user;
    } catch (e) {
      return res.status(400).json({ message: "Invalid token" });
    }
  }

  next();
});


// app.get("/hello", function (req, res) {
//   res.send("Hello from a GET endpoint!");
// });

// app.get("/hello/:name", function (req, res) {
//   res.send("Hello," + req.params.name);
// });

// app.post("/hello", function (req, res) {
//   res.send("Hello, " + req.body.name + " from a POST endpoint!");
// });

//API url http://localhost:8000/api/articles/learn-node/upvote
app.post("/api/articles/:articleName/upvote", async (req, res) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: "Unauthorized - No user found" });
  }

  const { articleName } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ articleName });

  const upvoteIds = article.upvoteIds || [];
  const canUpvote = uid && !upvoteIds.includes(uid);

  if (canUpvote) {
    const updatedArticle = await db
      .collection("articles")
      .findOneAndUpdate(
        { articleName },
        { $inc: { upvotes: 1 }, $push: { upvoteIds: uid } },
        { returnDocument: "after" }
      );
    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

app.post("/api/articles/:articleName/comments", async (req, res) => {
  const { articleName } = req.params;
  const { postedBy, text } = req.body;
  const newComment = { postedBy, text };

  // const article = articleInfo.find((a) => a.articleName === name);

  // article.comments.push({
  //   postedBy,
  //   text,
  // });

  // res.json(article);
  const updatedArticle = await db.collection("articles").findOneAndUpdate(
    { articleName },
    {
      $push: { comments: newComment },
    },
    {
      returnDocument: "after",
    }
  );

  res.json(updatedArticle);
});

const PORT = process.env.PORT || 8000;

async function start() {
  await connectToDB();

  app.listen(PORT, function () {
    console.log("Server is listening on port " + PORT);
  });
}

start();
