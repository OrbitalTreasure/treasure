import { useParams } from "react-router";
import { useState } from "react";
import HeaderLogo from "../nested/HeaderLogo";
import axios from "axios";
import Masonry from "react-masonry-css";
import InnerCard from "../nested/InnerCard";

const tokenCardStyle = {
  padding: "10px",
};

const User = () => {
  const { username } = useParams();
  const [collection, setCollection] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const getCollection = (username) => {
    axios
      .get(`/api/v1/reddit/user/${username}`)
      .then((data) => {
        const userDetails = data.data;
        setUserId(userDetails.id);
        console.log(userDetails.id);
        return userDetails.id;
      })
      .then((userId) => {
        const url = `/api/v1/tokens/${userId}`;
        axios
          .get(url)
          .then((res) => res.data)
          .then((body) => {
            setCollection(body);
            setLoading(false);
          })
          .catch(console.log);
      });
  };

  const generateCollectionJSX = (collection) => {
    if (collection.length === 0) {
      return (
        <h2 className="noToken">
          It seems like u/{username} does not own any tokens
        </h2>
      );
    }

    return (
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
          {collection.map((token) => {
            return (
              <div className="tokenCard" style={tokenCardStyle}>
                <InnerCard {...token} />
              </div>
            );
          })}
        </Masonry>
      </div>
    );
  };

  useState(() => {
    getCollection(username);
  }, []);

  return (
    <div>
      <HeaderLogo />
      {loading ? (
        <h2>Collection is loading ...</h2>
      ) : (
        <div>
          <h1>Collection of u/{username}</h1>
          {generateCollectionJSX(collection)}
        </div>
      )}
    </div>
  );
};

export default User;
