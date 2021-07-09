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
  const resetTransactionState = () =>
    props.transaction.set({ stage: 0, header: null });
  const setAcceptTransaction = (stage) => {
    props.transaction.set({ header: "You are accepting an offer", stage });
  };
  const setRejectTransaction = (stage) => {
    props.transaction.set({
      header: "This offer is being removed from the blockchain",
      stage,
    });
  };

  const onAccept = async () => {
    const contract = new web3.eth.Contract(ABI.abi, contractAddress);

    const estimateGasPromise = contract.methods
      .accept(props.offerId)
      .estimateGas({ from: metamaskAccount });

    setAcceptTransaction(1);
    estimateGasPromise
      .then((gasEstimate) => {
        return contract.methods
          .accept(props.offerId)
          .send({ from: metamaskAccount, gas: gasEstimate * 3 })
          .on("transactionHash", (e) => {
            setAcceptTransaction(2);
          })
          .on("receipt", (transactionReceipt) => {
            setAcceptTransaction(3);
            if (transactionReceipt.events.TokenOwnerChanged) {
              axios
                .post(`/api/v1/tokens/changeOwner/${props.offerId}`)
                .then((res) => {
                  props.DomOnAccept(props.post.id);
                  setAcceptTransaction(4);
                  resetTransactionState();
                });
            }
            if (transactionReceipt.events.TokenCreated) {
              console.log(transactionReceipt.events.TokenCreated);
              const tokenId =
                transactionReceipt.events.TokenCreated?.returnValues?.tokenId;
              console.log(tokenId);
              axios
                .post(`/api/v1/tokens/mint/${props.offerId}`, {
                  tokenId,
                })
                .then((res) => {
                  props.DomOnAccept(props.post.id);
                  setAcceptTransaction(4);
                  resetTransactionState();
                });
            }
          })
          .on("error", (e) => resetTransactionState);
      })
      .catch((e) => resetTransactionState);
  };

  const onReject = async () => {
    const contract = new web3.eth.Contract(ABI.abi, contractAddress);

    const estimateGasPromise = contract.methods
      .reject(props.offerId)
      .estimateGas({ from: metamaskAccount });
    setRejectTransaction(1);
    estimateGasPromise
      .then((gasEstimate) => {
        return contract.methods
          .reject(props.offerId)
          .send({ from: metamaskAccount, gas: gasEstimate * 3 })
          .on("transactionHash", (e) => {
            setRejectTransaction(2);
          })
          .on("receipt", (transactionReceipt) => {
            console.log("deleting from db");
            setRejectTransaction(3);
            axios.delete(`/api/v1/offers/${props.offerId}`).then((response) => {
              setIsDeleted(true);
              setRejectTransaction(4);
              resetTransactionState();
            });
          })
          .on("error", (e) => {
            resetTransactionState();
          });
      })

      .catch((e) => {
        resetTransactionState();
        console.log(e.message);
      });
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
          <input
            type="button"
            value="Rescind"
            className="option rescind"
            onClick={onReject}
          ></input>
        </div>
      ) : (
        <div>
          <input
            type="button"
            value="Accept"
            className="option accept"
            onClick={onAccept}
          ></input>
          <input
            type="button"
            value="Reject"
            className="option reject"
            onClick={onReject}
          ></input>
        </div>
      )}
    </div>
  );
};

export default OfferCard;
