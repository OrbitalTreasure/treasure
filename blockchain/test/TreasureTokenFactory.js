const { expect, assert } = require("chai");
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
  _bidAmount: 50,
};

let offerStub1 = {
  _buyerId: "2",
  _sellerId: "1",
  _postId: "2",
  _bidAmount: 60,
};

let offerStub2 = {
  _buyerId: "3",
  _sellerId: "2",
  _postId: "1",
  _bidAmount: 70,
};

beforeEach(async function () {
  TreasureFactoryContract = await ethers.getContractFactory(
    "TreasureTokenFactory"
  );
  [owner, adversary, addr1, addr2, addr3] = await ethers.getSigners();
  TreasureFactoryInstance = await TreasureFactoryContract.deploy();
  objectToParameters = (stub) => {
    return [stub._buyerId, stub._sellerId, stub._postId, stub._bidAmount];
  };
  mapUser123 = async () => {
    await TreasureFactoryInstance.connect(owner).mapUser("1", addr1.address);
    await TreasureFactoryInstance.connect(owner).mapUser("2", addr2.address);
    await TreasureFactoryInstance.connect(owner).mapUser("3", addr3.address);
  };
});

describe("Deployment", function () {
  it("Should set owner of the contract correctly", async function () {
    expect(await TreasureFactoryInstance.owner()).to.equal(owner.address);
  });
});

describe("mapUser() function", function () {
  it("Should allow owner to map a user", async function () {
    await TreasureFactoryInstance.connect(owner).mapUser("1", addr2.address);
    expect(await TreasureFactoryInstance.getUser("1")).to.equal(addr2.address);
  });

  it("Should not allow non-owner to map a user", async function () {
    await expect(
      TreasureFactoryInstance.connect(addr1).mapUser("1", addr2.address)
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

describe("Creating Offers", function () {
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

  it("Should fail if buyerId does not match transaction sender", async function () {
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

  it("Should fail if transaction value is less than the offer bid amount.", async function () {
    await expect(
      TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub0),
        { value: offerStub0._bidAmount - 1 }
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
      .withArgs("0", "1", "2", "1", 50);

    await expect(
      TreasureFactoryInstance.connect(addr2).createOffer(
        ...objectToParameters(offerStub1),
        { value: offerStub1._bidAmount }
      )
    )
      .to.emit(TreasureFactoryInstance, "OfferCreated")
      .withArgs("1", "2", "1", "2", 60);
  });
});

describe("Verify Offer", function () {
  this.beforeEach(async function () {
    await mapUser123();
    await TreasureFactoryInstance.connect(addr1).createOffer(
      ...objectToParameters(offerStub0),
      { value: offerStub0._bidAmount }
    );
  });

  it("Should allow owner to verify offer", async function () {
    await expect(TreasureFactoryInstance.connect(owner).verifyOffer(0))
      .to.emit(TreasureFactoryInstance, "OfferVerified")
      .withArgs(0);
  });

  it("Should not allow non-owner to verify offer", async function () {
    await expect(
      TreasureFactoryInstance.connect(addr1).verifyOffer(0)
    ).to.be.revertedWith("caller is not the owner");
  });

  it("Should fail if offerId does not exist", async function () {
    await expect(
      TreasureFactoryInstance.connect(owner).verifyOffer(1)
    ).to.be.revertedWith("Offer does not exist");
  });
});

describe("Reject Offer", function () {
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
    await TreasureFactoryInstance.verifyOffer(0);
    await expect(TreasureFactoryInstance.connect(addr1).reject(0))
      .to.emit(TreasureFactoryInstance, "OfferCompleted")
      .withArgs(0);

    await TreasureFactoryInstance.verifyOffer(1);
    await expect(TreasureFactoryInstance.connect(addr2).reject(1))
      .to.emit(TreasureFactoryInstance, "OfferCompleted")
      .withArgs(1);
  });

  it("Should allow seller to reject an offer", async function () {
    await TreasureFactoryInstance.verifyOffer(0);
    await expect(TreasureFactoryInstance.connect(addr2).reject(0))
      .to.emit(TreasureFactoryInstance, "OfferCompleted")
      .withArgs(0);

    await TreasureFactoryInstance.verifyOffer(1);
    await expect(TreasureFactoryInstance.connect(addr1).reject(1))
      .to.emit(TreasureFactoryInstance, "OfferCompleted")
      .withArgs(1);
  });

  it("Should not allow non-seller or non-buyer to reject an offer", async function () {
    await TreasureFactoryInstance.verifyOffer(0);
    await expect(
      TreasureFactoryInstance.connect(addr3).reject(0)
    ).to.be.revertedWith("You are not the buyer or the seller of this offer");

    await TreasureFactoryInstance.verifyOffer(1);
    await expect(
      TreasureFactoryInstance.connect(addr3).reject(1)
    ).to.be.revertedWith("You are not the buyer or the seller of this offer");
  });


});
