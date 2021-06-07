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
    mapping(string => string) private postIdToContentId;
    mapping(uint256 => string) private tokenIdToOwnerId;
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

    event OfferVerified(uint256 offerId, string contentId);

    event OfferCompleted(uint256 offerId);

    event UserLinked(string userId, address userAddress);

    event TokenCreated(uint256 tokenId, string ownerId);

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
        _isVerifiedAndIncomplete(_offerId);
        _;
    }
    function _isVerifiedAndIncomplete(uint256 _offerId) private view {
        require(!postOffers[_offerId].isCompleted, "Offer is already completed.");
        require(postOffers[_offerId].isVerified, "Offer is not verified.");
    }

    modifier offerValid(uint256 _offerId) {
        _isOfferValid(_offerId);
        _;
    }

    function _isOfferValid(uint256 _offerId) private view {
        require(_offerId < postOffers.length, "Offer does not exist");
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

    function verifyOffer(uint256 _offerId, string memory _contentId)
        external
        offerValid(_offerId)
        onlyOwner
    {
        require(
            _offerId >= 0 && _offerId < postOffers.length,
            "Offer does not exists"
        );
        RedditOffer memory offer = postOffers[_offerId];
        postIdToContentId[offer.postId] = _contentId;
        offer.isVerified = true;
        emit OfferVerified(_offerId, _contentId);
    }

    function getContentId(string memory _postId)
        public
        view
        returns (string memory)
    {
        return postIdToContentId[_postId];
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
        _completeOffer(_offerId);
        (bool sentOwner, bytes memory dataOwner) =
            owner().call{value: offer.bidAmount / 10}("");
        require(sent, "Failed to send ether to seller");
        require(sentOwner, "Failed to send ether to owner");
        uint256 newTokenId = mintNFT(postIdToContentId[offer.postId]);
        tokenIdToOwnerId[newTokenId] = offer.buyerId;
        emit TokenCreated(newTokenId, offer.buyerId);
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
        _completeOffer(_offerId);
        (bool sent, bytes memory data) =
            buyerAddress.call{value: offer.bidAmount}("");
        require(sent, "Failed to refund ether");
    }

    // NFT FUNCTIONS
    function mintNFT(string memory _tokenURI) private returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(owner(), newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }
}
