import upvoteImg from "../../assets/images/upvote.png";
import "../../assets/styles/InnerCard.scss";
import { NavLink, useHistory } from "react-router-dom";

const InnerCard = (props) => {
  const history = useHistory();
  const redirectToPost = (postId) => (e) => {
    e.stopPropagation()
    history.push(`/post/${postId}`);
  };

  const decodeHTML = (html) => {
    const text = document.createElement("textarea");
    text.innerHTML = html.slice(21, html.length -20);
    return text.value;
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
        <div dangerouslySetInnerHTML={{__html:decodeHTML(props.selftext)}}></div>
        </div>
      );
    }
    if (isImage(props.imageUrl)) {
      return (
        <div className="content">
          <img className="bodyImg" src={props.imageUrl} alt="postImage" />
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
        <img className="upvoteImg" src={upvoteImg} alt="upvoteIcon" />
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
    </div>
  );
};

export default InnerCard;
