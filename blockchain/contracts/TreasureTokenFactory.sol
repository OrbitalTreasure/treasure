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
    mapping(uint256 => address) private tokenToOwner;
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
        uint256 offerId,
        string buyerId,
        string sellerId,
        string postId,
        uint256 bidAmount
    );

    event UserLinked(string userId, address userAddress);

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

    modifier offerIncomplete(uint256 _offerId) {
        RedditOffer memory offer = postOffers[_offerId];
        require(!offer.isCompleted, "Offer is already completed.");
        _;
    }

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

    function createOffer(
        string memory _buyerId,
        string memory _sellerId,
        string memory _postId,
        uint256 _bidAmount
    ) public {
        require(
            msg.sender == userIdToAddress[_buyerId],
            "You can only create offers from yourself"
        );

        postOffers.push(
            RedditOffer(_buyerId, _sellerId, _postId, _bidAmount, false, false)
        );
        uint256 offerId = postOffers.length - 1;
        emit OfferCreated(offerId, _buyerId, _sellerId, _postId, _bidAmount);
    }

    function fundOffer(uint256 _offerId) public onlyOwner {
        RedditOffer storage offer = postOffers[_offerId];
        offer.isFunded = true;
    }

    function _completeOffer(uint256 _offerId)
        private
        offerIncomplete(_offerId)
    {
        RedditOffer storage offer = postOffers[_offerId];
        offer.isCompleted = true;
    }

    function fundOffer(uint256 _offerId) public payable onlyBuyer(_offerId) {
        RedditOffer memory offer = postOffers[_offerId];
        require(msg.value == offer.bidAmount)
    }

    function success(uint256 _offerId)
        public
        onlySeller(_offerId)
        offerIncomplete(_offerId)
    {
        RedditOffer storage offer = postOffers[_offerId];
        address payable sellerAddress = userIdToAddress[offer.sellerId];
        (bool sent, bytes memory data) =
            sellerAddress.call{value: offer.bidAmount}("");
        require(sent, "Failed to send ether");
        _completeOffer(_offerId);
    }

    function reject(uint256 _offerId) public offerIncomplete(_offerId) {
        RedditOffer memory offer = postOffers[_offerId];
        address payable sellerAddress = userIdToAddress[offer.sellerId];
        address payable buyerAddress = userIdToAddress[offer.buyerId];

        require(msg.sender == sellerAddress || msg.sender == buyerAddress);

        (bool sent, bytes memory data) =
            buyerAddress.call{value: offer.bidAmount}("");
        require(sent, "Failed to refund ether");

        _completeOffer(_offerId);
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
