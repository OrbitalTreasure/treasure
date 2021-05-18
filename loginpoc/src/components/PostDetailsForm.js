import { useState } from "react";

function PostDetailsForm() {
  const [userTextInput, setTextInput] = useState("");
  const getRedditPostData = (e) => {
    e.preventDefault();

    console.log(userTextInput);
    if (!isURL(userTextInput)) {
      fetchRedditPostInfo(userTextInput);
    } else {
      const urlObject = new URL(userTextInput);
      fetchRedditPostInfo(urlObject.pathname.split("/")[4]);
    }
  };

  const fetchRedditPostInfo = (postID) => {
    const url = `https://api.reddit.com/api/info/?id=t3_${postID}`;
    fetch(url, { mode: "cors" })
      .then((response) => response.json())
      .then((body) => console.log(body.data.children[0].data))
      .catch((e) => console.log(e));
  };

  function isURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  function insertExample() {
    setTextInput("nduv6b");
  }

  return (
    <div>
      <h1>Reddit Login Test Page</h1>
      <form onSubmit={getRedditPostData}>
        <input
          type="text"
          id="post"
          placeholder="Insert Reddit Post ID or URL"
          onChange={(e) => setTextInput(e.target.value)}
          value={userTextInput}
        />
        <input type="submit" value="Get Post Details" id="submitButton" />
      </form>
      <input
        type="button"
        value="Insert example url"
        id="exampleButton"
        onClick={insertExample}
      />
    </div>
  );
}

export default PostDetailsForm;
