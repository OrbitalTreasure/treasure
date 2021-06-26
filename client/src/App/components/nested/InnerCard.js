import upvoteImg from "../../assets/images/upvote.png";
import "../../assets/styles/InnerCard.scss";
import { NavLink } from "react-router-dom";

const InnerCard = (props) => {
  const redirectToPost = (postId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/post/${postId}`;
  };

  return (
    <div className="container">
      <h4 className="heading" onClick={redirectToPost(props.id)}>
        {props.title}
      </h4>
      <div className="subHeading">
        <p className="subreddit">{"/r/" + props.subreddit}</p>
        <NavLink className="author" to={`/user/${props.authorId}`}>
          Post by u/{props.author}
        </NavLink>
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
