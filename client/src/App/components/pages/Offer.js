import { TokenContext } from "../../contexts/TokenContext";
import { useContext, useState, useEffect } from "react";
import HeaderLogo from "../nested/HeaderLogo";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import InnerCard from "../nested/InnerCard";
import Web3 from "web3";
import ABI from "../../assets/TreasureTokenFactory.json";

const Offer = () => {
  const { tokens, metamaskAccount } = useContext(TokenContext);
  const { postId } = useParams();
  const [redditPost, setRedditPost] = useState({});
  var [transactionPending, setTransactionPending] = useState(false);
  const history = useHistory();
  const contractAddress = "0x055FBE752E37982476B54321D7BbE0DCA959D980";

  const url = new URLSearchParams(window.location.search);
  const offer = url.get("offer");

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

  useEffect(() => {
    fetchRedditPostInfo(postId);
  }, []);

  const onConfirm = async () => {
    window.web3 = new Web3(window.ethereum);
    var contract = await new window.web3.eth.Contract(ABI.abi, contractAddress);
    const estimatedGas = await contract.methods
      .createOffer(tokens.userId, postId, offer)
      .estimateGas({ value: offer, from: metamaskAccount });
    setTransactionPending(true);
    console.log(offer)
    contract.methods
      .createOffer(tokens.userId, postId, offer)
      .send({ from: metamaskAccount, value: offer, gas: estimatedGas * 3 })
      .then((e) => {
        console.log(e);
        const offerId = e.events.OfferCreated.returnValues.offerId;
        const postId = e.events.OfferCreated.returnValues.postId;
        axios
          .post(`/api/v1/blockchain/verify/`, {
            offerId,
            postId,
            offer,
            username: tokens.username,
          })
          .then((e) => {
            history.push("/profile");
          });
      })
      .catch((e) => {
        setTransactionPending(false);
        if (e.code == 4001) {
          console.log(e.message);
          console.log("hi");
        } else {
          console.log(e);
        }
      });
  };

  return (
    <div>
      <HeaderLogo />
      <InnerCard {...redditPost} />
      <p>
        Hello {tokens.username}, are you sure you want to buy this post for{" "}
        {offer}
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
