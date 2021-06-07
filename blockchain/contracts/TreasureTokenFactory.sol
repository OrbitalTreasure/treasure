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
    // mapping(string => uint256) private postIdToTokenId;
    RedditOffer[] postOffers;

    struct RedditOffer {
        string buyerId;
        string sellerId;
        string postId;
        uint256 bidAmount;
        bool isVerified;
        bool isCompleted;
    }

    event OfferCreated(
        uint256 offerId,
        string buyerId,
        string sellerId,
        string postId,
        uint256 bidAmount
    );

    event OfferVerified(uint256 offerId);

    event OfferCompleted(uint256 offerId);

    event UserLinked(string userId, address userAddress);

    // MODIFIERS
    modifier onlyBuyer(uint256 _offerId) {
        RedditOffer memory offer = postOffers[_offerId];
        address payable buyerAddress = userIdToAddress[offer.buyerId];
        require(
            msg.sender == buyerAddress,
            "Only the buyer can call this function."
        );
        _;
    }

    modifier onlySeller(uint256 _offerId) {
        RedditOffer memory offer = postOffers[_offerId];
        address payable sellerAddress = userIdToAddress[offer.sellerId];
        require(
            msg.sender == sellerAddress,
            "Only the seller can call this function."
        );
        _;
    }

    modifier offerVerifiedAndIncomplete(uint256 _offerId) {
        RedditOffer memory offer = postOffers[_offerId];
        require(!offer.isCompleted, "Offer is already completed.");
        require(offer.isVerified, "Offer is not verified.");
        _;
    }

    modifier offerValid(uint256 _offerId) {
        require(_offerId < postOffers.length, "Offer does not exist");
        _;
    }

    // USER FUNCTIONS
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

    function getUser(string memory _userId)
        public
        view
        onlyOwner
        returns (address payable)
    {
        require(
            userIdToAddress[_userId] != address(0),
            "This user does not exists"
        );
        return userIdToAddress[_userId];
    }

    // OFFER FUNCTIONS
    function createOffer(
        string memory _buyerId,
        string memory _sellerId,
        string memory _postId,
        uint256 _bidAmount
    ) public payable {
        // IMPORTANT: Make sure post belongs to the seller if you are calling this yourself!
        // Otherwise you have to rescind offer and incur your own gas fees.
        require(
            msg.sender == userIdToAddress[_buyerId],
            "You can only create offers from yourself"
        );
        require(
            msg.value >= _bidAmount,
            "Insufficient value, please match the bid amount."
        );

        postOffers.push(
            RedditOffer(_buyerId, _sellerId, _postId, _bidAmount, false, false)
        );
        uint256 offerId = postOffers.length - 1;
        emit OfferCreated(offerId, _buyerId, _sellerId, _postId, _bidAmount);
    }

    function verifyOffer(uint256 _offerId)
        external
        offerValid(_offerId)
        onlyOwner
    {
        require(
            _offerId >= 0 && _offerId < postOffers.length,
            "Offer does not exists"
        );
        postOffers[_offerId].isVerified = true;
        emit OfferVerified(_offerId);
    }

    function _completeOffer(uint256 _offerId)
        private
        offerValid(_offerId)
        offerVerifiedAndIncomplete(_offerId)
    {
        RedditOffer storage offer = postOffers[_offerId];
        offer.isCompleted = true;
        emit OfferCompleted(_offerId);
    }

    function accept(uint256 _offerId)
        public
        offerValid(_offerId)
        onlySeller(_offerId)
        offerVerifiedAndIncomplete(_offerId)
    {
        RedditOffer storage offer = postOffers[_offerId];
        address payable sellerAddress = userIdToAddress[offer.sellerId];
        (bool sent, bytes memory data) =
            sellerAddress.call{value: (offer.bidAmount / 10) * 9}("");
        (bool sentOwner, bytes memory dataOwner) = owner().call{value: offer.bidAmount/10}("");
        require(sent, "Failed to send ether");
        _completeOffer(_offerId);
    }

    function reject(uint256 _offerId)
        public
        offerValid(_offerId)
        offerVerifiedAndIncomplete(_offerId)
    {
        RedditOffer memory offer = postOffers[_offerId];
        address payable sellerAddress = userIdToAddress[offer.sellerId];
        address payable buyerAddress = userIdToAddress[offer.buyerId];

        require(
            msg.sender == sellerAddress || msg.sender == buyerAddress,
            "You are not the buyer or the seller of this offer"
        );

        (bool sent, bytes memory data) =
            buyerAddress.call{value: offer.bidAmount}("");
        require(sent, "Failed to refund ether");

        _completeOffer(_offerId);
    }

    // NFT FUNCTIONS
    // function assignPost(string memory _postId, address _recipient) private {
    //     if (postIdToTokenId[_postId] == 0) {
    //         mintNFT(_recipient, "something here");
    //     } else {
    //         tokenOwner[postIdToTokenId[_postId]] = _recipient;
    //     }
    // }

    function mintNFT(address _recipient, string memory _tokenURI)
        private
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        // tokenOwner[newItemId] = _recipient;
        return newItemId;
    }
}
