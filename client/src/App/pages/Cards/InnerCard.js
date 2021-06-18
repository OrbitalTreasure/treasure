import { useState, useEffect } from "react";
import upvoteImg from "../../assets/images/upvote.svg";
import "../../assets/styles/InnerCard.scss";
import { Link } from "react-router-dom";

const InnerCard = (props) => {
  return (
    <div className="container">
      <h4 className="heading">{props.title}</h4>
      <div className="subHeading">
        <p className="subreddit">{"/r/" + props.subreddit}</p>
        <a href={`/user/${props.authorId}`} className="author">Post by u/{props.author}</a>
      </div>
      {(props?.selftext || props?.imageUrl) && (
        <div className="content">
          {props?.selftext && <div className="bodyText">{props?.selftext}</div>}
          {!props?.selftext && props?.imageUrl && (
            <img className="bodyImg" src={props.imageUrl} />
          )}
        </div>
      )}
      <div className="upvote">
        <img className="upvoteImg" src={upvoteImg} />
        <p className="upvoteCount">{props.upvotes}</p>
      </div>
    </div>
  );
};

export default InnerCard;
