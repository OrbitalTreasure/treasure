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
  const history = useHistory();

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

  //   const testFunction = async () => {
  //     window.web3 = new Web3(window.ethereum);
  //     var contract = await new window.web3.eth.Contract(
  //       ABI.abi,
  //       "0xED54AE9644E20D90c83c1597E6E6Ae112A8E9e75"
  //     );
  //     console.log(contract)
  //   };

  const onConfirm = async () => {
    window.web3 = new Web3(window.ethereum);
    var contract = await new window.web3.eth.Contract(
      ABI.abi,
      "0xED54AE9644E20D90c83c1597E6E6Ae112A8E9e75"
    );
    // console.log(metamaskAccount)
    const estimatedGas = await contract.methods
      .createOffer(tokens.userId, postId, offer)
      .estimateGas({ value: offer });
    console.log(estimatedGas);
    contract.methods
      .createOffer(tokens.userId, postId, offer)
      .send({ from: metamaskAccount, value: offer, gas: 6283230 })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
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
      <input
        type="button"
        value="Back"
        onClick={() => history.push("/")}
      ></input>
      <input type="button" value="Confirm" onClick={onConfirm}></input>
    </div>
  );
};

export default Offer;
