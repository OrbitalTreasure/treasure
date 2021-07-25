export const hasMetamask = async () => {
  return typeof window.ethereum != "undefined" && window.ethereum.isMetaMask;
};
export const hasMetamaskPermissions = async () => {
  const permissions = await window.ethereum.request({
    method: "wallet_getPermissions",
  });
  return permissions.length > 0;
};
export const metamaskLoggedIn = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });
  return accounts.length > 0;
};
export const metamaskAtNetwork = async (networkName) => {
  const chainNameToId = {
    ethereum: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
  };
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  return chainId === chainNameToId[networkName];
};
