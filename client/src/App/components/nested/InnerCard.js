import upvoteImg from "../../assets/images/upvote.svg";
import "../../assets/styles/InnerCard.scss";
import { NavLink } from "react-router-dom";

const InnerCard = (props) => {
  const redirectToPost = (postId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/post/${postId}`;
  };

  return (
    <div className="container" onClick={redirectToPost(props.id)}>
      <h4 className="heading">
        {props.title}
      </h4>
      <div className="subHeading">
        <p className="subreddit">{"/r/" + props.subreddit}</p>
        <NavLink activeClassName="author" to={`/user/${props.author}`}>
          Post by u/{props.author}
        </NavLink>
      </div>
      {(props?.selftext || props?.url) && (
        <div className="content">
          {props?.selftext && <div className="bodyText">{props?.selftext}</div>}
          {!props?.selftext && props?.url && (
            <img className="bodyImg" src={props.url} />
          )}
        </div>
      )}
      <div className="upvote">
        <img className="upvoteImg" src={upvoteImg} />
        <p className="upvoteCount">{props.score}</p>
      </div>
    </div>
  );
};

export default InnerCard;
