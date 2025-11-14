import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";

// const articleInfo = [
//   { articleName: "learn-node", upvotes: 0, comments: [] },
//   { articleName: "learn-react", upvotes: 0, comments: [] },
//   { articleName: "learn-mongo", upvotes: 0, comments: [] },
// ];

const app = express();
app.use(cors());

// app.get('/', function (req, res){
//     // res.send('Hello');
//     console.log('hello')
// })

app.use(express.json());

let db;

async function connectToDB() {
  const uri = "mongodb://127.0.0.1:27017";

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

app.get("/api/articles/:articleName", async (req, res) => {
  const { articleName } = req.params;

  const article = await db.collection("articles").findOne({ articleName });

  res.json(article);
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
  // const article = articleInfo.find((a) => a.articleName === req.params.name);

  // if (!article) {
  //   return res.status(404).send("Article not found");
  // }

  // article.upvotes += 1;
  // // res.send(`Success! The article ${req.params.name} now has ${article.upvotes} upvotes!`);
  // res.json(article);
  const { articleName } = req.params;
  const updatedArticle = await db
    .collection("articles")
    .findOneAndUpdate(
      { articleName },
      { $inc: { upvotes: 1 } },
      { returnDocument: "after" }
    );
  res.json(updatedArticle);
});

app.post("/api/articles/:articleName/comments", async (req, res) => {
  const { articleName } = req.params;
  const { postedBy, text } = req.body;
  const newComment = {postedBy, text};

  // const article = articleInfo.find((a) => a.articleName === name);

  // article.comments.push({
  //   postedBy,
  //   text,
  // });

  // res.json(article);
  const updatedArticle = await db.collection('articles').findOneAndUpdate({ articleName}, {
    $push: {comments: newComment}
  }, {
    returnDocument: 'after'
  });

  res.json(updatedArticle);
});

async function start() {
  await connectToDB();

  app.listen(8000, function () {
    console.log("Server is listening on port 8000");
  });
}

start();
