import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

import InnerCard from "../nested/InnerCard";
import HeaderLogo from "../nested/HeaderLogo";
import OfferBar from "../nested/OfferBar";
import PreviousOwners from "../nested/PreviousOwners";

const Post = () => {
  const [redditPost, setRedditPost] = useState({});
  const { postId } = useParams();

  const fetchRedditPostInfo = (postID) => {
    const url = `/api/v1/posts/${postID}`;
    axios.get(url)
      .then(res => res.data)
      .then((body) => {
        setRedditPost(body)
      })
      .catch(console.log);
  };

  useEffect(() => {
    fetchRedditPostInfo(postId)
  }, [])
  
  return (
    <div>
      <HeaderLogo />
      <InnerCard {...redditPost}/>
      <p>Want to own this post? Give u/ an offer!</p>
      <OfferBar postId={postId}/>
      <PreviousOwners />
    </div>
  ); 
};

export default Post;
