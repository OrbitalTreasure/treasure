import { useState, useEffect } from "react";
import upvoteImg from "../../assets/images/upvote.svg";
import "../../assets/styles/InnerCard.scss"

function checkURL(url) {
    return url === undefined ? false : (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

const InnerCard = (props) => {
    return (
        <div className="container">
            <h4 className="heading">{props.title}</h4>
            <div className="subHeading">
                <p className="subreddit">{props.subreddit}</p>
                <p className="author">Post by u/{props.author}</p>
            </div>
            {(props?.body || checkURL(props?.link)) && <div className="content">
                {props?.body && <div className="bodyText">{props?.body}</div>}
                {!props?.body && checkURL(props?.link) && <img className="bodyImg" src={props.link}/>}
            </div>}
            <div className="upvote">
                <img className="upvoteImg" src={upvoteImg} />
                <text className="upvoteCount">{props.upvoteCount}</text>
            </div>
        </div>
    );
}

export default InnerCard;