import axios from "axios";
import { useState, useEffect } from "react";

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

  return (
    <div>
      <h1>This is a dashboard</h1>
      <input value="hi" type="button" onClick={generatePost}></input>
      {generatePost()}
    </div>
  );
};

export default Dashboard;
