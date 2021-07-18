import { TokenContext } from "../../contexts/TokenContext";
import { useContext, useState, useEffect } from "react";
import HeaderLogo from "../nested/HeaderLogo";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import InnerCard from "../nested/InnerCard";
import Web3 from "web3";
import ABI from "../../assets/TreasureTokenFactory.json";
import { convert } from "current-currency";
import "../../assets/styles/Offer.scss";
import TransactionPendingCard from "../nested/TransactionPendingCard";

const Offer = () => {
  const { tokens, metamaskAccount } = useContext(TokenContext);
  const { postId } = useParams();
  const [redditPost, setRedditPost] = useState({});
  const [offer, setOffer] = useState(0);
  var [transactionPending, setTransactionPending] = useState(0);
  const history = useHistory();
  const contractAddress = "0x055FBE752E37982476B54321D7BbE0DCA959D980";

  const url = new URLSearchParams(window.location.search);
  const offerSGD = url.get("offer");

  const fetchRedditPostInfo = (postID) => {
    const url = `/api/v1/posts/${postID}`;
    axios
      .get(url)
      .then((res) => res.data)
      .then((body) => {
        setRedditPost(body);
      })
      .catch(console.log);
  };

  const convertToWei = () => {
    convert("SGD", offerSGD, "ETH").then((data) => {
      const ethValue = data.amount;
      setOffer(Web3.utils.toWei(ethValue.toFixed(18), "ether"));
    });
  };

  useEffect(() => {
    fetchRedditPostInfo(postId);
    convertToWei();
  }, []);

  const onConfirm = async () => {
    window.web3 = new Web3(window.ethereum);
    var contract = await new window.web3.eth.Contract(ABI.abi, contractAddress);
    const estimatedGas = await contract.methods
      .createOffer(tokens.userId, postId, offer)
      .estimateGas({ value: offer, from: metamaskAccount });
    setTransactionPending(1);
    contract.methods
      .createOffer(tokens.userId, postId, offer)
      .send({ from: metamaskAccount, value: offer, gas: estimatedGas * 3 })
      .on("transactionHash", (e) => {
        setTransactionPending(2);
      })
      .on("receipt", (e) => {
        setTransactionPending(3);
        const offerId = e.events.OfferCreated.returnValues.offerId;
        const postId = e.events.OfferCreated.returnValues.postId;
        axios
          .post(`/api/v1/blockchain/verify/`, {
            offerId,
            postId,
            offer: offerSGD,
            username: tokens.username,
            userId: tokens.userId,
          })
          .then((e) => {
            setTransactionPending(4);
            history.push("/offers");
          });
      })
      .on("error", (e) => {
        setTransactionPending(0);
        if (e.code === 4001) {
          console.log(e.message);
        } else {
          console.log(e);
        }
      });
  };

  if (transactionPending) {
    const steps = [
      {
        step: "Awaiting Confirmation",
        info: "A metamask popup should have appeared. Please confirm this transaction and pay the gas fee.",
      },
      {
        step: "Creating Offer",
        info: "This may take a while. We are uploading the offer data onto the blockchain.",
      },
      {
        step: "Verifying Offer",
        info: "Our servers are checking that the data uploaded is correct. Please hang on.",
      },
      {
        step: "Completed",
        info: "Redirecting you to your profile...",
      },
    ];

    return (
      <TransactionPendingCard
        header="Your offer has been sent"
        steps={steps}
        transactionPending={transactionPending}
      />
    );
  }

  return (
    <div>
      <HeaderLogo />
      <div className="postColumn">
        <InnerCard {...redditPost} />
      </div>
      <p>
        Hello {tokens.username}, are you sure you want to buy this post for{" "}
        {<b>SGD {offerSGD}</b>} ({(offer / 10 ** 18).toFixed(6)} ethereum)
      </p>
      {transactionPending ? (
        <p>Please wait while your transaction is loading</p>
      ) : (
        <div>
          <input
            type="button"
            value="Back"
            onClick={() => history.push("/")}
          ></input>
          <input type="button" value="Confirm" onClick={onConfirm}></input>
        </div>
      )}
    </div>
  );
};

export default Offer;
