import upvoteImg from "../../assets/images/upvote.png";
import "../../assets/styles/InnerCard.scss";
import { NavLink } from "react-router-dom";

const InnerCard = (props) => {
  const redirectToPost = (postId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/post/${postId}`;
  };

  const truncate = (str, maxLength, isTruncate) => {
    if (!isTruncate) {
      return str;
    }
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  const heading = () => (
    <h4 className="heading" onClick={redirectToPost(props.id)}>
      {props.title}
    </h4>
  );

  const subheading = () => {
    const subreddit = <p className="subreddit">{"/r/" + props.subreddit}</p>;
    const author = (
      <NavLink className="author" to={`/user/${props.author}`}>
        Post by u/{props.author}
      </NavLink>
    );
    return (
      <div className="subHeading">
        {subreddit}
        {author}
      </div>
    );
  };

  const content = () => {
    const isImage = (url) => {
      if (!url) {
        return false;
      }
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    };

    if (props.selftext) {
      return (
        <div className="content">
          <div className="bodyText">
            {truncate(props?.selftext, 1000, props.isTruncate)}
          </div>
        </div>
      );
    }
    if (isImage(props.imageUrl)) {
      return (
        <div className="content">
          <img className="bodyImg" src={props.imageUrl} />
        </div>
      );
    }
    if (props.imageUrl) {
      return (
        <div className="content">
          <div
            className="bodyText urlLink"
            onClick={() => {
              window.open(props.imageUrl);
            }}
          >
            {props.imageUrl}
          </div>
        </div>
      );
    }
    return null;
  };

  const upvote = () => {
    return (
      <div className="upvote">
        <img className="upvoteImg" src={upvoteImg} />
        <p className="upvoteCount">{props.upvotes}</p>
      </div>
    );
  };

  return (
    <div className="container">
      {heading()}
      {subheading()}
      {content()}
      {upvote()}
      {/* <input type="button" onClick={() => {console.log(props.imageURL)}}></input> */}
    </div>
  );
};

export default InnerCard;
