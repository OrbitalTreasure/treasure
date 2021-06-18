import axios from "axios";
import { useState, useEffect } from "react";
import OuterCard from "../Cards/OuterCard";
import Masonry from "react-masonry-css";
import "../../assets/styles/Dashboard.scss";

const Dashboard = () => {
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    const fetchData = () => {
      const limit = 12;
      axios
        .get(`http://localhost:4000/api/v1/posts?limit=${limit}`)
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
      <h1>This is a dashboard</h1>
      <div id="masonry-container">
        <Masonry
          breakpointCols={3}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        ></Masonry>
        {generatePost()}
      </div>
    </div>
  );
};

export default Dashboard;
