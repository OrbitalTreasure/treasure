import { useEffect } from "react";
import { useState } from "react";
import HeaderLogo from "../nested/HeaderLogo";
import OfferCard from "../nested/OfferCard";
import axios from "axios";
import TransactionPendingCard from "../nested/TransactionPendingCard";

const Profile = () => {
  const [offersFrom, setOffersFrom] = useState([]);
  const [offersTo, setOffersTo] = useState([]);
  const [transactionPending, settransactionPending] = useState({
    header: null,
    stage: 0,
  });
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
  }, [setOffersFrom, setOffersTo]);

  const DomOnAccept = (postId) => {
    setOffersTo(offersTo.filter((e) => e.post.id !== postId));
  };

  const generateOfferTo = (offers) => {
    return (
      <div className="offerTo">
        <h2 className="offerTitle">Offer To</h2>
        {offers.length === 0 ? (
          <h2>No offers to this user.</h2>
        ) : (
          offers.map((data, index) => (
            <OfferCard
              {...data}
              key={index}
              toFrom="to"
              DomOnAccept={DomOnAccept}
              transaction={{
                state: transactionPending,
                set: settransactionPending,
              }}
            ></OfferCard>
          ))
        )}
      </div>
    );
  };
  const generateOfferFrom = (offers) => {
    return (
      <div className="offerFrom">
        <h2 className="offerTitle">Offer from</h2>
        {offers.length === 0 ? (
          <h2>No offers to this user.</h2>
        ) : (
          offers.map((data, index) => (
            <OfferCard
              {...data}
              key={index}
              toFrom="from"
              transaction={{
                state: transactionPending,
                set: settransactionPending,
              }}
            ></OfferCard>
          ))
        )}
      </div>
    );
  };

  if (!transactionPending.stage) {
    return (
      <div>
        <HeaderLogo />
        <div>
          {generateOfferTo(offersTo)}
          {generateOfferFrom(offersFrom)}
        </div>
      </div>
    );
  }

  const steps = [
    {
      step: "Waiting on your confirmation",
      info: "A metamask popup should have appeared.",
    },
    {
      step: "Updating the blockchain",
      info: "This may take a while. This transaction changes the state on the blockchain.",
    },
    { step: "Updating our database to match the blockchain" },
    { step: "Returning you to your offers page" },
  ];

  return (
    <TransactionPendingCard
      steps={steps}
      header={transactionPending.header}
      transactionPending={transactionPending.stage}
    />
  );
};

export default Profile;
