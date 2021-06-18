import { useParams } from "react-router";

const User = () => {
  const { userId } = useParams();
  return (
    <div>
      <h1>this is user page of {userId}</h1>
    </div>
  );
};

export default User;
