import InnerCard from "./InnerCard";
import "../../assets/styles/OuterCard.scss";
import { useHistory } from "react-router";

const OuterCard = (props) => {
  const history = useHistory();

  return (
    <div className="card" onClick ={() => history.push(`post/${props.post.id}`)}>
      <p className="header">
        <span
          onClick={() => history.push(`/user/${props.user}`)}
          className="urlLink"
        >
          u/{props.user}
        </span>{" "}
        {props.status} for <b>${props.price.toFixed(2)}</b>
      </p>
      <InnerCard {...props.post} isTruncate={true} />
    </div>
  );
};

export default OuterCard;
