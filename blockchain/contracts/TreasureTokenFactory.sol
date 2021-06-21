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
    mapping(uint256 => string) private tokenIdToOwnerId;
    mapping(string => uint256) private postIdToTokenId;
    RedditOffer[] postOffers;

    struct RedditOffer {
        string buyerId;
        string sellerId;
        string postId;
        uint256 bidAmount;
        bool isVerified;
        bool isCompleted;
        string tokenUri;
        bool isTokenMinted;
    }

    event OfferCreated(
        uint256 offerId,
        string buyerId,
        string postId,
        uint256 bidAmount
    );

    event OfferVerified(uint256 offerId, string tokenUri, string sellerid);

    event OfferCompleted(uint256 offerId);

    event UserLinked(string userId, address userAddress);

    event TokenCreated(uint256 tokenId, string ownerId);
    event TokenOwnerChanged(uint tokenId, string ownerId);

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



    // OFFER FUNCTIONS
    function createOffer(
        string memory _buyerId,
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
            RedditOffer(_buyerId, "", _postId, _bidAmount, false, false, "", false)
        );
        uint256 offerId = postOffers.length - 1;
        emit OfferCreated(offerId, _buyerId, _postId, _bidAmount);
    }

    function verifyOffer(uint256 _offerId, string memory _tokenUri, string memory _sellerId)
        external
        offerValid(_offerId)
        onlyOwner
    {
        RedditOffer storage offer = postOffers[_offerId];
        uint tokenId = postIdToTokenId[offer.postId];
        if (bytes(tokenIdToOwnerId[tokenId]).length == 0) {
            offer.sellerId = _sellerId;
        } else {
            offer.isTokenMinted = true;
            offer.sellerId = tokenIdToOwnerId[tokenId];
        }
        offer.tokenUri = _tokenUri;
        offer.isVerified = true;
        emit OfferVerified(_offerId, _tokenUri, offer.sellerId);
    }

    function getTokenUri(string memory _postId)
        public
        view
        returns (string memory)
    {
        return tokenURI(postIdToTokenId[_postId]);
    }

    function getOwner(uint256 _tokenId) 
        public
        view
        returns (string memory)
    {
        return tokenIdToOwnerId[_tokenId];
    }

    function _completeOffer(uint256 _offerId)
        private
    {
        RedditOffer storage offer = postOffers[_offerId];
        offer.isCompleted = true;
        emit OfferCompleted(_offerId);
    }

    function accept(uint256 _offerId)
        public
        offerValid(_offerId)
        offerVerifiedAndIncomplete(_offerId)
        onlySeller(_offerId)
    {
        RedditOffer memory offer = postOffers[_offerId];
        if (offer.isTokenMinted) {
            _changeTokenOwner(postIdToTokenId[offer.postId], offer.buyerId);
        } else {
            uint256 newTokenId = mintNFT(offer.tokenUri);
            tokenIdToOwnerId[newTokenId] = offer.buyerId;
            postIdToTokenId[offer.postId] =  newTokenId;
            emit TokenCreated(newTokenId, offer.buyerId);
        }    
        _completeOffer(_offerId);
        address payable sellerAddress = userIdToAddress[offer.sellerId];
        (bool sent, bytes memory data) =
            sellerAddress.call{value: (offer.bidAmount / 10) * 9}("");
        (bool sentOwner, bytes memory dataOwner) =
            owner().call{value: offer.bidAmount / 10}("");
        require(sent, "Failed to send ether to seller");
        require(sentOwner, "Failed to send ether to owner");
    }

    function _changeTokenOwner(uint tokenId, string memory _newOwner) private {
        tokenIdToOwnerId[tokenId] = _newOwner ;
        emit TokenOwnerChanged(tokenId, _newOwner);
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
