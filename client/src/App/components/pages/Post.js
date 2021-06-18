import { useParams } from "react-router";

const Post = () => {
  const { postId } = useParams();
  return (
    <div>
      <h1>This is the post page of post {postId}</h1>
    </div>
  );
};

export default Post;
