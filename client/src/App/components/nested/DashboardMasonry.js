import axios from "axios";
import { useState, useEffect } from "react";
import OuterCard from "./OuterCard";
import Masonry from "react-masonry-css";
import "../../assets/styles/DashboardMasonry.scss";

const DashboardMasonry = () => {
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      const limit = 12;
      axios
        .get(`/api/v1/offers?limit=${limit}`)
        .then((newOffers) => setOffers(newOffers.data))
        .catch(console.log);
    };
    fetchData();
  }, []);

  const generatePost = () => {
    return offers.map((data, index) => (
      <OuterCard {...data} key={index} isTruncate={true}></OuterCard>
    ));
  };

  return (
    <div>
      <h2>Recent Transactions</h2>
      <div className="masonry-container">
        <Masonry
          breakpointCols={{
            default: 3,
            700: 2,
            500: 1,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {generatePost()}
        </Masonry>
      </div>
    </div>
  );
};

export default DashboardMasonry;
