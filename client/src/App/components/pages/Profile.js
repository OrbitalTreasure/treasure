import { useEffect } from "react";
import { TokenContext } from "../../contexts/TokenContext";
import { useContext, useState } from "react";
import HeaderLogo from "../nested/HeaderLogo";
import OfferCard from "../nested/OfferCard";
import axios from "axios";

const Profile = () => {
  const { tokens } = useContext(TokenContext);
  const [offersFrom, setOffersFrom] = useState([]);
  const [offersTo, setOffersTo] = useState([]);

  useEffect(() => {
    const getOffersfrom = () => {
      axios
        .get(`/offers/from/${tokens.userId}`)
        .then((res) => {
          setOffersFrom(res.data);
        })
        .catch(console.log);
    };
    const getOffersTo = () => {
      axios
        .get(`/offers/to/${tokens.userId}`)
        .then((res) => {
          setOffersTo(res.data);
        })
        .catch(console.log);
    };
    // getOffersfrom();
    // getOffersTo();
    //delete this
    const offer = [
      {
        post: {
          createdAt: 1624024481,
          author: "Athos55",
          subreddit: "techsupport",
          id: "o2i00i",
          num_comments: 2,
          url: "https://www.reddit.com/r/techsupport/comments/o2i00i/obs_crash_help/",
          upvotes: 2,
          imageUrl: null,
          authorId: "3vabp2np",
          ipfsHash: "QmUryLscoB3KJzLdi9NRacRdLzUcFB1QwtSGLaHGSeGD28",
          title: "OBS Crash HELP!",
          selftext:
            "Hello, I am writing this Reddit post since I have a problem with my streaming settings. When I stream Call of duty Warzone at times I have 140 to 160+ FPS but suddenly I get an unstable 40 to 80 fps and then my Streamlabs OBS crashes. I have done the most basic things like reinstalling drivers, updating Windows, formatting the whole computer, updating all EVGA graphics drivers and I have not obtained any favorable results.\n\nThis are my computer specs:\n\n&amp;#x200B;\n\n♦️  Processor: Ryzen 7 5800X  \n♦️  RAM: 32 GB DDR4 Hyperx at 3200 MmHz  \n♦️  Graphics Card: RTX 3080 10 GB FTW3 EVGA  \n♦️  SSD: Spectrix S40G, 1TB, PCI Express 3.0, M.2  \n♦️  Power Source: EVGA 850 W Gold  \n♦️  Motherboard: Gigabyte X470 AORUS Gaming 5  \n♦️  Cooling: NZXT Kraken X62\n\nMy streaming configuration is as follows:\n\n♦️ Encoder: NVENC (new)  \n♦️ Rate control: CBR  \n♦️ Bitrate: 6000  \n♦️ Preset: Quality  \n♦️ Profile: High  \n♦️ Psycho visual turing: ON  \n♦️ Look ahead: Off  \n♦️ Max B-frames: 2  \n♦️ Base: 1920 x 1080  \n♦️ Output: 1920 x 1080  \n♦️ Downscale filter: Lanzczos (Sharpened scaling, 32 simples)  \n♦️ FPS Type: Common FPS Value  \n♦️ Common FPS Value: 60",
        },
        offerId: 2,
        price: 100000,
        userId: "tester",
        status: "offered",
        createdAt: 1624430207081,
        user: "El-Ricardo",
        sellerId: "3vabp2np",
      },
      {
        offerId: 1,
        createdAt: 1623997095141,
        price: 10000,
        sellerId: "3vabp2np",
        userId: "tester",
        status: "offered",
        post: {
          createdAt: 1623974522,
          imageUrl: null,
          title: "How does save() work?",
          ipfsHash: "QmaqtPBD6ckpwaX2qBtK4GTsXfsvVPxN4PazzcqBoanhnj",
          selftext:
            "I have used the save() method to save the comments. But how and where does save() actually 'save' the comments and are there any limits as to how many objects it can 'save' at once?\nI am new to PRAW and have been browsing the docs for save() but only found how to use it. Thnx!",
          upvotes: 7,
          id: "o20p7e",
          subreddit: "redditdev",
          author: "Crazycocfan",
          authorId: "egx94w4",
          num_comments: 21,
          url: "https://www.reddit.com/r/redditdev/comments/o20p7e/how_does_save_work/",
        },
        user: "hi",
      },
    ];
    setOffersTo(offer);
    setOffersFrom(offer);
  }, []);

  const generateOfferTo = (offers) => {
    console.log(offers);
    return (
      <div className="offerTo">
        <h2>Offer To</h2>
        {offers.map((data, index) => (
          <OfferCard {...data} key={index} toFrom="to"></OfferCard>
        ))}
      </div>
    );
  };
  const generateOfferFrom = (offers) => {
    return (
      <div className="offerFrom">
        <h2>Offer from</h2>
        {offers.map((data, index) => (
          <OfferCard {...data} key={index} toFrom="from"></OfferCard>
        ))}
      </div>
    );
  };

  return (
    <div>
      <HeaderLogo />
      <div>
        {generateOfferTo(offersTo)}
        {generateOfferFrom(offersFrom)}
      </div>
    </div>
  );
};

export default Profile;
