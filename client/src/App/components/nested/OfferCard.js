import InnerCard from "./InnerCard";
import "../../assets/styles/OfferCard.scss";
import ABI from "../../assets/TreasureTokenFactory.json";
import Web3 from "web3";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext } from "react";

const OfferCard = (props) => {
  const { metamaskAccount } = useContext(TokenContext);
  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x055FBE752E37982476B54321D7BbE0DCA959D980";

  const onAccept = async () => {
    const contractPromise = new web3.eth.Contract(
      ABI.abi,
      contractAddress
    );

    const estimateGasPromise = contractPromise.then((contract) =>
      contract.methods
        .accept(props.offerId)
        .estimateGas({ from: metamaskAccount })
    );

    Promise.all([contractPromise, estimateGasPromise])
      .then(([contract, gasEstimate]) => {
        contract.methods
          .accept(props.offerId)
          .send({ from: metamaskAccount, gas: gasEstimate * 3 });
      })
      .then((transactionReceipt) => {
        const handleSuccessfulAccept = () => {};
        handleSuccessfulAccept();
      })
      .catch(console.log);
  };

  const onReject = async () => {
    const contractPromise = new web3.eth.Contract(
      ABI.abi,
      contractAddress
    );

    const estimateGasPromise = contractPromise.then((contract) =>
      contract.methods
        .reject(props.offerId)
        .estimateGas({ from: metamaskAccount })
    );

    Promise.all([contractPromise, estimateGasPromise])
      .then(([contract, gasEstimate]) => {
        contract.methods
          .reject(props.offerId)
          .send({ from: metamaskAccount, gas: gasEstimate * 3 });
      })
      .then((transactionReceipt) => {
        const handleSuccessfulReject = () => {};
        handleSuccessfulReject();
      })
      .catch(console.log);
  };

  return (
    <div className="card">
      <p className="header">
        u/{props.user} {props.status} for <b>${props.price.toFixed(2)}</b>
      </p>
      <InnerCard {...props.post} />
      {props.toFrom == "from" ? (
        <input type="button" value="rescind"></input>
      ) : (
        <div>
          <input type="button" value="Accept" onClick={onAccept}></input>
          <input type="button" value="Reject"></input>
        </div>
      )}
    </div>
  );
};

export default OfferCard;
