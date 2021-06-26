import InnerCard from "./InnerCard";
import "../../assets/styles/OfferCard.scss";
import ABI from "../../assets/TreasureTokenFactory.json";
import Web3 from "web3";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";

const OfferCard = (props) => {
  const { metamaskAccount } = useContext(TokenContext);
  var [isDeleted, setIsDeleted] = useState(false);
  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x055FBE752E37982476B54321D7BbE0DCA959D980";
  const history = useHistory();

  const onAccept = async () => {
    const contract = new web3.eth.Contract(ABI.abi, contractAddress);

    const estimateGasPromise = contract.methods
      .accept(props.offerId)
      .estimateGas({ from: metamaskAccount });

    estimateGasPromise
      .then((gasEstimate) => {
        contract.methods
          .accept(props.offerId)
          .send({ from: metamaskAccount, gas: gasEstimate * 3 });
      })
      .then((transactionReceipt) => {
        axios.delete(`/api/v1/offers/post/${props.post.id}`);
        setIsDeleted(true);
      })
      .catch(console.log);
  };

  const onReject = async () => {
    const contract = new web3.eth.Contract(ABI.abi, contractAddress);

    const estimateGasPromise = contract.methods
      .reject(props.offerId)
      .estimateGas({ from: metamaskAccount });

    estimateGasPromise
      .then((gasEstimate) => {
        contract.methods
          .reject(props.offerId)
          .send({ from: metamaskAccount, gas: gasEstimate * 3 });
      })
      .then((transactionReceipt) => {
        axios.delete(`/api/v1/offers/$props.offerId`);
        setIsDeleted(true);
      })
      .catch(console.log);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="card">
      <p className="header">
        u/{props.user} {props.status} for <b>${props.price.toFixed(2)}</b>
      </p>
      <InnerCard {...props.post} />
      {props.toFrom == "from" ? (
        <div>
          <input type="button" value="rescind" onClick={onReject}></input>
        </div>
      ) : (
        <div>
          <input type="button" value="Accept" onClick={onAccept}></input>
          <input type="button" value="Reject" onClick={onReject}></input>
        </div>
      )}
    </div>
  );
};

export default OfferCard;
