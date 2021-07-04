import { useParams } from "react-router";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext, useState } from "react";
import HeaderLogo from "../nested/HeaderLogo";
import axios from "axios";
import Masonry from "react-masonry-css";
import InnerCard from "../nested/InnerCard";

const User = () => {
  const { userId } = useParams();
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCollection = (userId) => {
    const url = `/api/v1/tokens/${userId}`;
    axios
      .get(url)
      .then((res) => res.data)
      .then((body) => {
        setCollection(body);
        setLoading(false);
      })
      .catch(console.log);
  };

  const generateCollectionJSX = (collection) => {
    if (collection.length == 0) {
      <h2 className="noToken">
        It seems like u/{userId} does not own any tokens
      </h2>;
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
            return <InnerCard {...token} />;
          })}
        </Masonry>
      </div>
    );
  };

  useState(() => {
    getCollection(userId);
  }, []);

  return (
    <div>
      <HeaderLogo />
      <h1>Collection of {userId}</h1>
      {loading ? (
        <h2>Collection is loading ...</h2>
      ) : (
        generateCollectionJSX(collection)
      )}
      {/* <input
        type="button"
        onClick={() => {
          console.log(collection);
        }}
      ></input> */}
    </div>
  );
};

export default User;
