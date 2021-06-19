import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

import InnerCard from "../nested/InnerCard";

const Post = () => {
  const [redditPost, setRedditPost] = useState({});
  const { postId } = useParams();

  const fetchRedditPostInfo = (postID) => {
    const url = `https://api.reddit.com/api/info/?id=t3_${postID}`;
    axios.get(url)
      .then(res => res.data.data.children[0].data)
      .then((body) => {
        console.log(body)
        setRedditPost(body)
      })
      .catch(console.log);
  };

  const extractPostInfo = postData => {
    return (({ author, subreddit, score, title, selftext, url, id }) =>  ({ author, subreddit, score, title, selftext, url, id }))(postData)
  }

  useEffect(() => {
    fetchRedditPostInfo(postId)
  }, [])
  
  return (
    <div>
      <h1>This is the post page of post {postId}</h1>
      <InnerCard {...extractPostInfo(redditPost)}/>
    </div>
  ); 
};

export default Post;
