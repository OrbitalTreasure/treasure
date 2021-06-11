import { useState, useEffect } from "react";
import upvoteImg from "../../assets/images/upvote.svg";
import "../../assets/styles/InnerCard.scss"

function checkURL(url) {
    return url === undefined ? false : (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

const InnerCard = (props) => {
    return (
        <div className="container">
            <h4 className="title">{props.post.title}</h4>
            <div className="subHeading">
                <p className="subreddit">{props.post.subreddit}</p>
                <p className="author">Post by u/{props.post.author}</p>
            </div>
            {props.post?.body && <div className="bodyText">{props.post?.body}</div>}
            {!props.post?.body && checkURL(props.post?.link) && <img className="bodyImg" src={props.post.link}/>}
            <div className="upvote">
                <img className="upvoteImg" src={upvoteImg} />
                <text className="upvoteCount">{props.post.upvoteCount}</text>
            </div>
        </div>
    );
}

export default InnerCard;