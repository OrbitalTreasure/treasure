import { useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext, useState } from "react";
import HeaderLogo from "../nested/HeaderLogo";
import OfferCard from "../nested/OfferCard";
import axios from "axios";

const Profile = () => {
  const { tokens, setTokens } = useContext(TokenContext);
  const [offersFrom, setOffersFrom] = useState([]);
  const [offersTo, setOffersTo] = useState([]);

  useEffect(() => {
    const localToken = window.localStorage.getItem("tokens");
    const userId = JSON.parse(localToken).userId;
    const getOffersfrom = () => {
      axios
        .get(`/api/v1/offers/from/${userId}`)
        .then((res) => {
          setOffersFrom(res.data);
        })
        .catch(console.log);
    };
    const getOffersTo = () => {
      axios
        .get(`/api/v1/offers/to/${userId}`)
        .then((res) => {
          setOffersTo(res.data);
        })
        .catch(console.log);
    };
    getOffersfrom();
    getOffersTo();
  }, [setTokens, setOffersFrom, setOffersTo]);

  const generateOfferTo = (offers) => {
    return (
      <div className="offerTo">
        <h2>Offer To</h2>
        {offers.map((data, index) => (
          <OfferCard {...data} key={index} toFrom="to"></OfferCard>
        ))}
      </div>
    );
  };
  const generateOfferFrom = (offers) => {
    return (
      <div className="offerFrom">
        <h2>Offer from</h2>
        {offers.map((data, index) => (
          <OfferCard {...data} key={index} toFrom="from"></OfferCard>
        ))}
      </div>
    );
  };

  return (
    <div>
      <HeaderLogo />
      <div>
        {generateOfferTo(offersTo)}
        {generateOfferFrom(offersFrom)}
      </div>
    </div>
  );
};

export default Profile;
