import { useParams, useLoaderData } from "react-router-dom";
import articles from "../article-content";
import axios from "axios";
import CommentsList from "../CommentsList";
import { useState } from "react";
import AddComment from "../AddCommentForm";

export default function ArticlePage() {
  const { articleName } = useParams();
  const { upvotes: initialUpvotes, comments: initialComments } = useLoaderData();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState(initialComments);

  const article = articles.find((a) => a.name === articleName);

  async function onUpvoteClicked() {
    const response = await axios.post(
      "/api/articles/" + articleName + "/upvote"
    );
    console.log("data", response);
    const updatedArticleData = response.data;
    console.log("updatedArticleData", updatedArticleData);

    setUpvotes(updatedArticleData.upvotes);
  }

  async function onAddComment({ nameText, commentText }) {
    const response = await axios.post(
      "/api/articles/" + articleName + "/comments", {
        postedBy: nameText,
        text: commentText
      }
    );
    console.log("data", response);
    const updatedArticleData = response.data;
    setComments(updatedArticleData.comments);
  }
  console.log("article", article);

  return (
    <>
      <h1>{article?.title}</h1>
      <button onClick={onUpvoteClicked}>Upvote</button>
      <p>This article has {upvotes} upvotes! </p>
      {article?.content.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <AddComment onAddComment={onAddComment}></AddComment>
      <CommentsList comments={comments}></CommentsList>
    </>
  );
}

export async function loader({ params }) {
  const { articleName } = params;
  const response = await axios.get("/api/articles/" + articleName);
  const { upvotes, comments } = response.data;
  return { upvotes, comments };
}
