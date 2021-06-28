const { expect } = require("chai");
const { ethers } = require("hardhat");

let TreasureFactoryContract;
let TreasureFactoryInstance;
let owner;
let addr1;
let addr2;
let addr3;
let objectToParameters;
let mapUser123;
let offerStub0 = {
  _buyerId: "1",
  _sellerId: "2",
  _postId: "1",
  _bidAmount: ethers.BigNumber.from("5000000000000000000"),
};

let offerStub1 = {
  _buyerId: "2",
  _sellerId: "1",
  _postId: "2",
  _bidAmount: ethers.BigNumber.from("6000000000000000000"),
};

let offerStub2 = {
  _buyerId: "3",
  _sellerId: "2",
  _postId: "1",
  _bidAmount: ethers.BigNumber.from("7000000000000000000"),
};

let resaleOfferStub0 = {
  _buyerId: "3",
  _sellerId: "1",
  _postId: "1",
  _bidAmount: ethers.BigNumber.from("9000000000000000000"),
};
let provider = ethers.getDefaultProvider();

describe("Unit Tests", function () {
  this.beforeEach(async function () {
    TreasureFactoryContract = await ethers.getContractFactory(
      "TreasureTokenFactory"
    );
    [owner, adversary, addr1, addr2, addr3] = await ethers.getSigners();
    TreasureFactoryInstance = await TreasureFactoryContract.deploy();
    objectToParameters = (stub) => {
      return [stub._buyerId, stub._postId, stub._bidAmount];
    };
    mapUser123 = async () => {
      await TreasureFactoryInstance.connect(owner).mapUser("1", addr1.address);
      await TreasureFactoryInstance.connect(owner).mapUser("2", addr2.address);
      await TreasureFactoryInstance.connect(owner).mapUser("3", addr3.address);
    };
  });

  describe("Unit Test: Deployment", function () {
    it("Should set owner of the contract correctly", async function () {
      expect(await TreasureFactoryInstance.owner()).to.equal(owner.address);
    });
  });

  describe("mapUser() function", function () {
    it("Should allow owner to map a user", async function () {
      await expect(
        TreasureFactoryInstance.connect(owner).mapUser("1", addr1.address)
      )
        .to.emit(TreasureFactoryInstance, "UserLinked")
        .withArgs("1", addr1.address);
    });

    it("Should not allow non-owner to map a user", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).mapUser("1", addr1.address)
      ).to.be.revertedWith("caller is not the owner");
    });

    it("Should not be able to map a userId twice", async function () {
      await TreasureFactoryInstance.connect(owner).mapUser("1", addr2.address);
      await expect(
        TreasureFactoryInstance.connect(owner).mapUser("1", addr3.address)
      ).to.be.revertedWith("Username already is already linked!");
    });

    it("Should emit the correct event", async function () {
      await expect(
        TreasureFactoryInstance.connect(owner).mapUser("1", addr2.address)
      )
        .to.emit(TreasureFactoryInstance, "UserLinked")
        .withArgs("1", addr2.address);
    });
  });

  describe("Unit Test: Creating Offers", function () {
    this.beforeEach(async function () {
      await mapUser123();
    });

    it("Should create offer if buyerId match transaction sender", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount }
        )
      ).to.emit(TreasureFactoryInstance, "OfferCreated");

      await expect(
        TreasureFactoryInstance.connect(addr2).createOffer(
          ...objectToParameters(offerStub1),
          { value: offerStub1._bidAmount }
        )
      ).to.emit(TreasureFactoryInstance, "OfferCreated");
    });

    it("Should revert if buyerId does not match transaction sender", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr2).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount }
        )
      ).to.be.revertedWith("You can only create offers from yourself");
    });

    it("Should allow if transaction value is more than the offer bid amount.", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount + 1 }
        )
      ).to.emit(TreasureFactoryInstance, "OfferCreated");
    });

    it("Should revert if transaction value is less than the offer bid amount.", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount.sub(1) }
        )
      ).to.be.revertedWith("Insufficient value, please match the bid amount.");
    });

    it("Should allow multiple concurrent offers for the same post", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount }
        )
      ).to.emit(TreasureFactoryInstance, "OfferCreated");

      await expect(
        TreasureFactoryInstance.connect(addr3).createOffer(
          ...objectToParameters(offerStub2),
          { value: offerStub2._bidAmount }
        )
      ).to.emit(TreasureFactoryInstance, "OfferCreated");
    });

    it("Should create correct events if offer is successful", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount }
        )
      )
        .to.emit(TreasureFactoryInstance, "OfferCreated")
        .withArgs("0", "1", "1", offerStub0._bidAmount);

      await expect(
        TreasureFactoryInstance.connect(addr2).createOffer(
          ...objectToParameters(offerStub1),
          { value: offerStub1._bidAmount }
        )
      )
        .to.emit(TreasureFactoryInstance, "OfferCreated")
        .withArgs("1", "2", "2", offerStub1._bidAmount);
    });

    it("Should deduct the bid amount from buyer account", async function () {
      await expect(() =>
        TreasureFactoryInstance.connect(addr1).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount }
        )
      ).to.changeEtherBalance(addr1, offerStub0._bidAmount.mul(-1));
    });

    it("Should increase contract balance by bid amount", async function () {
      await expect(() =>
        TreasureFactoryInstance.connect(addr1).createOffer(
          ...objectToParameters(offerStub0),
          { value: offerStub0._bidAmount }
        )
      ).to.changeEtherBalance(TreasureFactoryInstance, offerStub0._bidAmount);
    });
  });

  describe("Unit Test: Verifying Offer", function () {
    this.beforeEach(async function () {
      await mapUser123();
      await TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub0),
        { value: offerStub0._bidAmount }
      );
    });

    it("Should allow owner to verify offer", async function () {
      await expect(
        TreasureFactoryInstance.connect(owner).verifyOffer(
          0,
          "hash0",
          offerStub0._sellerId
        )
      )
        .to.emit(TreasureFactoryInstance, "OfferVerified")
        .withArgs(0, "hash0", offerStub0._sellerId);
    });

    it("Should not allow non-owner to verify offer", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).verifyOffer(
          0,
          "hash0",
          offerStub0._sellerId
        )
      ).to.be.revertedWith("caller is not the owner");
    });

    it("Should revert if offerId does not exist", async function () {
      await expect(
        TreasureFactoryInstance.connect(owner).verifyOffer(
          1,
          "hash1",
          offerStub1._sellerId
        )
      ).to.be.revertedWith("Offer does not exist");
    });
  });

  describe("Unit Test: Rejecting Offer", function () {
    this.beforeEach(async function () {
      await mapUser123();

      await TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub0),
        { value: offerStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(addr2).createOffer(
        ...objectToParameters(offerStub1),
        { value: offerStub1._bidAmount }
      );
    });

    it("Should allow buyer to rescind an offer", async function () {
      await expect(
        TreasureFactoryInstance.verifyOffer(0, "hash0", offerStub0._sellerId)
      )
        .to.emit(TreasureFactoryInstance, "OfferVerified")
        .withArgs("0", "hash0", offerStub0._sellerId);
      await expect(TreasureFactoryInstance.connect(addr1).reject(0))
        .to.emit(TreasureFactoryInstance, "OfferCompleted")
        .withArgs(0);

      await TreasureFactoryInstance.verifyOffer(
        1,
        "hash1",
        offerStub1._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr2).reject(1))
        .to.emit(TreasureFactoryInstance, "OfferCompleted")
        .withArgs(1);
    });

    it("Should allow seller to reject an offer", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr2).reject(0))
        .to.emit(TreasureFactoryInstance, "OfferCompleted")
        .withArgs(0);

      await TreasureFactoryInstance.verifyOffer(
        1,
        "hash1",
        offerStub1._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr1).reject(1))
        .to.emit(TreasureFactoryInstance, "OfferCompleted")
        .withArgs(1);
    });

    it("Should not allow non-seller or non-buyer to reject an offer", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(
        TreasureFactoryInstance.connect(addr3).reject(0)
      ).to.be.revertedWith("You are not the buyer or the seller of this offer");

      await TreasureFactoryInstance.verifyOffer(
        1,
        "hash1",
        offerStub1._sellerId
      );
      await expect(
        TreasureFactoryInstance.connect(addr3).reject(1)
      ).to.be.revertedWith("You are not the buyer or the seller of this offer");
    });

    it("Should revert if offer does not exist", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(
        TreasureFactoryInstance.connect(addr1).reject(2)
      ).to.be.revertedWith("Offer does not exist");
    });

    it("Should revert if offer is not verified", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr1).reject(0)
      ).to.be.revertedWith("Offer is not verified.");
    });

    it("Should revert if offer is already completed.", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr1).reject(0)).to.emit(
        TreasureFactoryInstance,
        "OfferCompleted"
      );
      await expect(
        TreasureFactoryInstance.connect(addr1).reject(0)
      ).to.be.revertedWith("Offer is already completed.");
    });

    it("Should deduct bid amount from contract.", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(() =>
        TreasureFactoryInstance.connect(addr1).reject(0)
      ).to.changeEtherBalance(
        TreasureFactoryInstance,
        offerStub0._bidAmount.mul(-1)
      );
    });

    it("Should deposit bid amount to buyer wallet", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(() =>
        TreasureFactoryInstance.connect(addr1).reject(0)
      ).to.changeEtherBalance(addr1, offerStub0._bidAmount);
    });
  });

  describe("Unit Test: Accepting Offer", function () {
    this.beforeEach(async function () {
      await mapUser123();

      await TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub0),
        { value: offerStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(addr2).createOffer(
        ...objectToParameters(offerStub1),
        { value: offerStub1._bidAmount }
      );
    });

    it("Should allow seller to accept offer", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr2).accept(0))
        .to.emit(TreasureFactoryInstance, "OfferCompleted")
        .withArgs(0);
    });

    it("Should not allow non-seller to accept offer", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(
        TreasureFactoryInstance.connect(addr1).accept(0)
      ).to.be.revertedWith("Only the seller can call this function.");
      await expect(
        TreasureFactoryInstance.connect(addr3).accept(0)
      ).to.be.revertedWith("Only the seller can call this function.");
    });

    it("Should revert if offer does not exist", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(
        TreasureFactoryInstance.connect(addr2).accept(2)
      ).to.be.revertedWith("Offer does not exist");
    });

    it("Should revert if offer is not verified", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr2).accept(0)
      ).to.be.revertedWith("Offer is not verified.");
    });

    it("Should revert if offer has already been completed", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr2).accept(0))
        .to.emit(TreasureFactoryInstance, "OfferCompleted")
        .withArgs(0);
      await expect(
        TreasureFactoryInstance.connect(addr2).accept(0)
      ).to.be.revertedWith("Offer is already completed.");
    });

    it("Should deduct bid amount from contract", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(() =>
        TreasureFactoryInstance.connect(addr2).accept(0)
      ).to.changeEtherBalance(
        TreasureFactoryInstance,
        offerStub0._bidAmount.mul(-1)
      );
    });

    it("Should deposit correct amount to seller wallet", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(() =>
        TreasureFactoryInstance.connect(addr2).accept(0)
      ).to.changeEtherBalance(addr2, offerStub0._bidAmount.mul(9).div(10));
    });

    it("Should deposit correct amount to owner wallet", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(() =>
        TreasureFactoryInstance.connect(addr2).accept(0)
      ).to.changeEtherBalance(owner, offerStub0._bidAmount.div(10));
    });

    it("Should give custody of NFT to owner", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr2).accept(0))
        .to.emit(TreasureFactoryInstance, "TokenCreated")
        .withArgs("1", offerStub0._buyerId);
      expect(await TreasureFactoryInstance.ownerOf(1)).to.be.equals(
        owner.address
      );
    });

    it("Should make buyer the owner of NFT", async function () {
      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );
      await expect(TreasureFactoryInstance.connect(addr2).accept(0))
        .to.emit(TreasureFactoryInstance, "TokenCreated")
        .withArgs("1", offerStub0._buyerId);
      expect(await TreasureFactoryInstance.getOwner(1)).to.be.equal("1");
    });
  });

  describe("Reselling Tokens", function () {
    this.beforeEach(async function () {
      await mapUser123();

      await TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub0),
        { value: offerStub0._bidAmount }
      );

      await TreasureFactoryInstance.verifyOffer(
        0,
        "hash0",
        offerStub0._sellerId
      );

      await expect(TreasureFactoryInstance.connect(addr2).accept(0))
        .to.emit(TreasureFactoryInstance, "TokenCreated")
        .withArgs("1", offerStub0._buyerId);
    });

    it("Should be able to make an offer on a minted token", async function () {
      await expect(
        TreasureFactoryInstance.connect(addr3).createOffer(
          ...objectToParameters(resaleOfferStub0),
          { value: resaleOfferStub0._bidAmount }
        )
      )
        .to.emit(TreasureFactoryInstance, "OfferCreated")
        .withArgs(
          "1",
          resaleOfferStub0._buyerId,
          resaleOfferStub0._postId,
          resaleOfferStub0._bidAmount
        );
    });

    it("Should allow owner to verify resale offer", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await expect(
        TreasureFactoryInstance.connect(owner).verifyOffer(
          "1",
          "resaleHash0",
          "does not matter what the seller id is"
        )
      )
        .to.emit(TreasureFactoryInstance, "OfferVerified")
        .withArgs("1", "resaleHash0", resaleOfferStub0._sellerId);
    });

    it("Should allow existing token owner to accept offer", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(owner).verifyOffer(
        "1",
        "resaleHash0",
        "does not matter what the seller id is"
      );

      await expect(TreasureFactoryInstance.connect(addr1).accept("1"))
        .to.emit(TreasureFactoryInstance, "TokenOwnerChanged")
        .withArgs("1", "3");
    });

    it("Should not allow non-token owner to accept offer", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(owner).verifyOffer(
        "1",
        "resaleHash0",
        "does not matter what the seller id is"
      );

      await expect(
        TreasureFactoryInstance.connect(addr2).accept("1")
      ).to.be.revertedWith("Only the seller can call this function.");
    });

    it("Should give custody of token to owner.", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(owner).verifyOffer(
        "1",
        "resaleHash0",
        "does not matter what the seller id is"
      );

      await TreasureFactoryInstance.connect(addr1).accept("1");

      expect(await TreasureFactoryInstance.ownerOf(1)).to.be.equals(
        owner.address
      );
    });

    it("Should make the new owner of the token the buyer", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(owner).verifyOffer(
        "1",
        "resaleHash0",
        "does not matter what the seller id is"
      );

      await TreasureFactoryInstance.connect(addr1).accept("1");

      expect(await TreasureFactoryInstance.getOwner(1)).to.be.equal("3");
    });

    it("Should deduct bid amount from the contract", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(owner).verifyOffer(
        "1",
        "resaleHash0",
        "does not matter what the seller id is"
      );

      await expect(() =>
        TreasureFactoryInstance.connect(addr1).accept("1")
      ).to.changeEtherBalance(
        TreasureFactoryInstance,
        resaleOfferStub0._bidAmount.mul(-1)
      );
    });

    it("Should transfer seller's share to seller", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(owner).verifyOffer(
        "1",
        "resaleHash0",
        "does not matter what the seller id is"
      );

      await expect(() =>
        TreasureFactoryInstance.connect(addr1).accept("1")
      ).to.changeEtherBalance(
        addr1,
        resaleOfferStub0._bidAmount.mul(9).div(10)
      );
    });

    it("Should transfer commission to owner", async function () {
      await TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(resaleOfferStub0),
        { value: resaleOfferStub0._bidAmount }
      );

      await TreasureFactoryInstance.connect(owner).verifyOffer(
        "1",
        "resaleHash0",
        "does not matter what the seller id is"
      );

      await expect(() =>
        TreasureFactoryInstance.connect(addr1).accept("1")
      ).to.changeEtherBalance(owner, resaleOfferStub0._bidAmount.div(10));
    });
  });
});
