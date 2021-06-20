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
        .get(`/api/v1/posts?limit=${limit}`)
        .then((newOffers) => setOffers(newOffers.data))
        .catch(console.log);
    };
    fetchData();
  }, []);

  const generatePost = () => {
    return offers.map((data, index) => (
      <OuterCard {...data} key={index}></OuterCard>
    ));
  };

  return (
    <div>
      <h2>Recent Transactions</h2>
      <div id="masonry-container">
        <Masonry
          breakpointCols={3}
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
