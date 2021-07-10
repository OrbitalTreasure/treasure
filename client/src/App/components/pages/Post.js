import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

import InnerCard from "../nested/InnerCard";
import HeaderLogo from "../nested/HeaderLogo";
import OfferBar from "../nested/OfferBar";
import PreviousOwners from "../nested/PreviousOwners";
import "../../assets/styles/Post.scss";

const Post = () => {
  const [redditPost, setRedditPost] = useState({});
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

  const html =
    '&lt;!-- SC_OFF --&gt;&lt;div class="md"&gt;&lt;p&gt;edit: &lt;em&gt;Solved&lt;/em&gt; thanks to &lt;a href="/u/intortus"&gt;/u/intortus&lt;/a&gt;.  Apparently I was calling the same code twice without realizing it... &lt;em&gt;oopsie&lt;/em&gt;!&lt;/p&gt;\n\n&lt;hr/&gt;\n\n&lt;p&gt;Maybe it has something to do with it being midnight, but..&lt;/p&gt;\n\n&lt;p&gt;I&amp;#39;m trying to incorporate reddits OAuth into &lt;a href="http://radd.it"&gt;my site&lt;/a&gt; but am running into an error that makes no sense to me.  I have no problems when trying to get the posts that a user has upvoted/ downvoted/ submitted but get a &amp;quot;invalid_grant&amp;quot; error when trying to retrieve subreddit subscriptions or the list of subs the user moderates.&lt;/p&gt;\n\n&lt;p&gt;E.g. &lt;a href="http://radd.it/.oauth?where=liked"&gt;http://radd.it/.oauth?where=liked&lt;/a&gt; works just fine but &lt;a href="http://radd.it/.oauth?where=subscriber"&gt;http://radd.it/.oauth?where=subscriber&lt;/a&gt; throws the &amp;quot;invalid_grant&amp;quot; error.  The weird part: it&amp;#39;s running the exact same code and this error occurs before my code even checks to see what you&amp;#39;re requesting.  It&amp;#39;s like reddit can see into the future (and then breaks.)&lt;/p&gt;\n\n&lt;p&gt;Anyone got a clue?  My code is a modified version &lt;a href="https://github.com/reddit/reddit/wiki/OAuth2-PHP-Example"&gt;of the example for the PHP OAuth2 library&lt;/a&gt; except the &lt;code&gt;scope&lt;/code&gt; value for my &lt;code&gt;getAuthenticationUrl()&lt;/code&gt; call is &amp;quot;identity,history,mysubreddits&amp;quot; instead of just &amp;quot;identity&amp;quot; as in the example and &lt;code&gt;state&lt;/code&gt; value is either &amp;quot;only:any,where:liked&amp;quot; or &amp;quot;only:any,where:subscriber&amp;quot; depending on the &lt;code&gt;where&lt;/code&gt; parameter in the URLs in the above paragraph.&lt;/p&gt;\n\n&lt;p&gt;&lt;sup&gt;&lt;sup&gt;ok,&lt;/sup&gt;&lt;/sup&gt; &lt;sup&gt;&lt;sup&gt;brain&lt;/sup&gt;&lt;/sup&gt; &lt;sup&gt;&lt;sup&gt;off&lt;/sup&gt;&lt;/sup&gt; &lt;sup&gt;&lt;sup&gt;time.&lt;/sup&gt;&lt;/sup&gt;&lt;/p&gt;\n&lt;/div&gt;&lt;!-- SC_ON --&gt;';
  const decodedHTML = decodeHtml(html.slice(21, html.length - 20));
  const fetchRedditPostInfo = (postID) => {
    const url = `/api/v1/posts/${postID}`;
    axios
      .get(url)
      .then((body) => {
        setRedditPost(body.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setErrors(error?.response?.data);
      });
  };

  const postFound = () => (
    <div className="postColumn">
      <InnerCard {...redditPost} />
      <p>Want to own this post? Give u/ an offer!</p>
      <OfferBar postId={postId} />
      <PreviousOwners />
    </div>
  );

  const postNotFound = () => {
    const requestErrors = errors.errors;
    return <h1>{requestErrors[0]}</h1>;
  };

  const loadingJSX = () => {
    return (
      <div>
        <h1>Loading post data...</h1>
      </div>
    );
  };

  useEffect(() => {
    fetchRedditPostInfo(postId);
  }, []);

  return (
    <div>
      <HeaderLogo />
      {loading ? loadingJSX() : errors ? postNotFound() : postFound()}
      <div dangerouslySetInnerHTML={{ __html: decodedHTML }}></div>
      <input type="button" onClick={() => {console.log(decodedHTML)}}></input>
    </div>
  );
};

export default Post;
