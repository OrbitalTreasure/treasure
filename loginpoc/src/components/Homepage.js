import Login from "./Login";
import PostDetailsForm from "./PostDetailsForm";

function Homepage(props) {
  return (
    <div className="card">
      <PostDetailsForm/>
      <br />
      <br />
      <Login />
    </div>
  );
}

export default Homepage;
