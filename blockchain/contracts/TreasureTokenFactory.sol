//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreasureTokenFactory is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("TreasureOrbital", "TOR") {}

    mapping(string => address payable) private userIdToAddress;
    RedditOffer[] postOffers;

    struct RedditOffer {
        string buyerId;
        string sellerId;
        string postId;
        uint256 bidAmount;
        bool isFunded;
        bool isCompleted;
    }

    event OfferCreated(
        string buyerId,
        string sellerId,
        string postId,
        uint256 bidAmount
    );

    event UserLinked(string userId, address userAddress);

    function mapUser(string memory _userId, address payable _userAddress)
        public
        onlyOwner
    {
        require(
            userIdToAddress[_userId] == address(0),
            "Username already is already linked!"
        );
        userIdToAddress[_userId] = _userAddress;
        emit UserLinked(_userId, _userAddress);
    }

    function createOffer(
        string memory _buyerId,
        string memory _sellerId,
        string memory _postId,
        uint256 _bidAmount
    ) external {
        require(
            msg.sender == userIdToAddress[_buyerId],
            "You can only create offers from yourself"
        );

        postOffers.push(
            RedditOffer(_buyerId, _sellerId, _postId, _bidAmount, false, false)
        );
        uint256 offerId = postOffers.length - 1;
        emit OfferCreated(_buyerId, _sellerId, _postId, _bidAmount);
    }

    function mintNFT(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}

// //Emitted when update function is called
// //Smart contract events are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.
// event UpdatedMessages(string oldStr, string newStr);

// // Declares a state variable `message` of type `string`.
// // State variables are variables whose values are permanently stored in contract storage. The keyword `public` makes variables accessible from outside a contract and creates a function that other contracts or clients can call to access the value.
// string public message;

// // Similar to many class-based object-oriented languages, a constructor is a special function that is only executed upon contract creation.
// // Constructors are used to initialize the contract's data. Learn more:https://solidity.readthedocs.io/en/v0.5.10/contracts.html#constructors
// constructor(string memory initMessage) {

//    // Accepts a string argument `initMessage` and sets the value into the contract's `message` storage variable).
//    message = initMessage;
// }

// // A public function that accepts a string argument and updates the `message` storage variable.
// function change(string memory newMessage) public {
//    string memory oldMsg = message;
//    message = newMessage;
//    emit UpdatedMessages(oldMsg, newMessage);
// }
