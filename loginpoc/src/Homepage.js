import Login from './Login'

function Homepage() {
  const postTextInput = document.querySelector("#post");

  const getRedditPostData = (e) => {
    e.preventDefault();
    const textInput = postTextInput.value;

    if (!isURL(textInput)) {
      fetchRedditPostInfo(textInput);
    } else {
      const urlObject = new URL(textInput);
      fetchRedditPostInfo(urlObject.pathname.split("/")[4]);
    }
  };

  const fetchRedditPostInfo = (postID) => {
    const url = `https://api.reddit.com/api/info/?id=t3_${postID}`;
    fetch(url, { mode: "cors" })
      .then((response) => response.json())
      .then((data) => console.log(data))
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

  const insertExample = (e) =>
    (postTextInput.value =
      "https://www.reddit.com/r/news/comments/ndyvkx/now_is_not_the_time_nurses_union_condemns_cdc_for/?utm_source=share&utm_medium=web2x&context=3");

  return (
    <div className="card">
      <h1>Reddit Login Test Page</h1>
      <form onSubmit={getRedditPostData}>
        <input
          type="text"
          id="post"
          placeholder="Insert Reddit Post ID or URL"
        />
        <input type="submit" value="Get Post Details" id="submitButton" />
      </form>
      <input
        type="button"
        value="Insert example url"
        id="exampleButton"
        onSubmit={insertExample}
      />
      <br />
      <br />
      <Login />
    </div>
  );
}

export default Homepage;
