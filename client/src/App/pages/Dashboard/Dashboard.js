import axios from "axios";
import { useState, useEffect } from "react";
import OuterCard from "../Cards/OuterCard";
import Masonry from "react-masonry-css";
import "../../assets/styles/Dashboard.scss";

const Dashboard = () => {
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const limit = 12;
      const offers = await axios.get(`/api/v1/posts?limit=${limit}`);
      setOffers(offers.data);
    };
    fetchData();
  }, []);

  const generatePost = () => {
    return offers.map((data, index) => <h2 key={index}>{data.id}</h2>);
  };

  const testPostData = {
    title: "Hello World!",
    subreddit: "r/all",
    author: "OriginalPoster",
    // body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    // link: "https://static.wikia.nocookie.net/mrmen/images/d/d2/Mrtallimage.png",
    link: "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    upvoteCount: 1928,
  };

  const testPostData1 = {
    title: "Hello World!",
    subreddit: "r/all",
    author: "OriginalPoster",
    // body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    link: "https://static.wikia.nocookie.net/mrmen/images/d/d2/Mrtallimage.png",
    // link: "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    upvoteCount: 1928,
  };

  const BOUGHT = "purchased";
  const OFFER = "offered";

  const testOfferData = {
    user: "RichMan99",
    status: BOUGHT,
    price: 12.1384340590234,
    post: testPostData,
  };

  const testOfferData1 = {
    user: "PoorMan90",
    status: OFFER,
    price: 12.1384340590234,
    post: testPostData1,
  };

  return (
    <div>
      <h1>This is a dashboard</h1>
      <div id="masonry-container">
        <Masonry
          breakpointCols={{ default: 3, 700: 2, 500: 1 }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          <OuterCard {...testOfferData1} />
          <OuterCard {...testOfferData} />
          <OuterCard {...testOfferData} />
          <OuterCard {...testOfferData1} />
          <OuterCard {...testOfferData} />
          <OuterCard {...testOfferData} />
        </Masonry>
      </div>
    </div>
  );
};

export default Dashboard;
