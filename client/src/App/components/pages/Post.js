import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

import InnerCard from "../nested/InnerCard";
import HeaderLogo from "../nested/HeaderLogo";
import OfferBar from "../nested/OfferBar";
import PreviousOwners from "../nested/PreviousOwners";
import "../../assets/styles/Post.scss";

const Post = () => {
  const [redditPost, setRedditPost] = useState({});
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();

  const fetchRedditPostInfo = (postID) => {
    const url = `/api/v1/posts/${postID}`;
    axios
      .get(url)
      .then((body) => {
        setRedditPost(body.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setErrors(error?.response?.data);
      });
  };

  const postFound = () => (
    <div className="postColumn">
      <InnerCard {...redditPost} />
      <p>Want to own this post? Give u/ an offer!</p>
      <OfferBar postId={postId} />
      <PreviousOwners />
    </div>
  );

  const postNotFound = () => {
    const requestErrors = errors.errors
    return <h1>{requestErrors[0]}</h1>
  };

  const loadingJSX = () => {
    return <div>
      <h1>Loading post data...</h1>
    </div>;
  };

  useEffect(() => {
    fetchRedditPostInfo(postId);
  }, []);

  return (
    <div>
      <HeaderLogo />
      {loading ? loadingJSX() : errors ? postNotFound() : postFound()}
    </div>
  );
};

export default Post;
