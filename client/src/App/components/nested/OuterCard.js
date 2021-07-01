import InnerCard from"./InnerCard";

import "../../assets/styles/OuterCard.scss";

const OuterCard = (props) => {
    return (
        <div className="card">
            <p className="header">
                u/{props.user} {props.status} for <b>${props.price.toFixed(2)}</b>
            </p>
            <InnerCard {...props.post} isTruncate={true}/>
        </div>
    );
}

export default OuterCard;