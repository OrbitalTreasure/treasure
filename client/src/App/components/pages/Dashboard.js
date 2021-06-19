import axios from "axios";
import { useState, useEffect } from "react";
import OuterCard from "../nested/OuterCard";
import Masonry from "react-masonry-css";
import "../../assets/styles/Dashboard.scss";
import HeaderLogo from "../nested/HeaderLogo";

const Dashboard = () => {
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      const limit = 12;
      axios
        .get(`/api/v1/posts?limit=${limit}`)
        .then((newOffers) => {
          setOffers(newOffers.data);
        })
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
      <HeaderLogo />
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

export default Dashboard;
