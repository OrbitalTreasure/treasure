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

  const DomOnReject = (offerId) => {
    setOffersFrom(offersFrom.filter((e) => e.offerId !== offerId));
    setOffersTo(offersTo.filter((e) => e.offerId !== offerId));
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
              DomOnReject={DomOnReject}
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
              DomOnReject={DomOnReject}
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
      step: "Awaiting Confirmation",
      info: "A metamask popup should have appeared. Please confirm this transaction and pay the gas fee.",
    },
    {
      step: "Updating Blockchain",
      info: "This may take a while. This transaction changes the state on the blockchain.",
    },
    {
      step: "Updating Database",
      info: "Updating our database to match the blockchain",
    },
    { step: "Completed", info: "Returning you to your offers page" },
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
