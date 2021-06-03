async function main() {
  const TreasureTokenFactory = await ethers.getContractFactory("TreasureTokenFactory");

  // Start deployment, returning a promise that resolves to a contract object
  const treasure_token_factory = await TreasureTokenFactory.deploy(overrides);
  console.log(`Contract deployed to address: ${treasure_token_factory.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
