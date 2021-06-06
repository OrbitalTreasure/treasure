const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let TreasureFactoryContract;
let TreasureFactoryInstance;
let owner;
let addr1;
let addr2;
let addr3;
let offerStub1;
let offerStub2;
let offerStub3;
let objectToParameters;

beforeEach(async function () {
  TreasureFactoryContract = await ethers.getContractFactory(
    "TreasureTokenFactory"
  );
  [owner, adversary, addr1, addr2, addr3] = await ethers.getSigners();
  TreasureFactoryInstance = await TreasureFactoryContract.deploy();
  objectToParameters = (stub) => {
    return [stub._buyerId, stub._sellerId, stub._postId, stub._bidAmount];
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
    offerStub1 = {
      _buyerId: "1",
      _sellerId: "2",
      _postId: "1",
      _bidAmount: 50,
    };

    offerStub2 = {
      _buyerId: "2",
      _sellerId: "1",
      _postId: "2",
      _bidAmount: 60,
    };

    offerStub3 = {
      _buyerId: "3",
      _sellerId: "2",
      _postId: "1",
      _bidAmount: 70,
    };

    await TreasureFactoryInstance.connect(owner).mapUser("1", addr1.address);
    await TreasureFactoryInstance.connect(owner).mapUser("2", addr2.address);
    await TreasureFactoryInstance.connect(owner).mapUser("3", addr3.address);
  });

  it("Should create offer if buyerId match transaction sender", async function () {
    await expect(
      TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub1)
      )
    ).to.emit(TreasureFactoryInstance, "OfferCreated");

    await expect(
      TreasureFactoryInstance.connect(addr2).createOffer(
        ...objectToParameters(offerStub2)
      )
    ).to.emit(TreasureFactoryInstance, "OfferCreated");
  });

  it("Should fail if buyerId does not match transaction sender", async function () {
    await expect(
      TreasureFactoryInstance.connect(addr2).createOffer(
        ...objectToParameters(offerStub1)
      )
    ).to.be.revertedWith("You can only create offers from yourself");
  });

  it("Should allow multiple concurrent offers for the same post", async function () {
    await expect(
      TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub1)
      )
    ).to.emit(TreasureFactoryInstance, "OfferCreated");

    await expect(
      TreasureFactoryInstance.connect(addr3).createOffer(
        ...objectToParameters(offerStub3)
      )
    ).to.emit(TreasureFactoryInstance, "OfferCreated");
  });

  it("Should create correct events if offer is successful", async function () {
    await expect(
      TreasureFactoryInstance.connect(addr1).createOffer(
        ...objectToParameters(offerStub1)
      )
    )
      .to.emit(TreasureFactoryInstance, "OfferCreated")
      .withArgs("0", "1", "2", "1", 50);

    await expect(
      TreasureFactoryInstance.connect(addr2).createOffer(
        ...objectToParameters(offerStub2)
      )
    )
      .to.emit(TreasureFactoryInstance, "OfferCreated")
      .withArgs("1", "2", "1", "2", 60);
  });
});
