export const hasMetamask = async () => {
  return typeof window.ethereum != "undefined" && window.ethereum.isMetaMask;
};
export const metamaskLoggedIn = async () => {
  if (await hasMetamask()) {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts.length > 0;
  }
  return false;
};

export const hasMetamaskPermissions = async () => {
  if (await metamaskLoggedIn()) {
    const permissions = await window.ethereum.request({
      method: "wallet_getPermissions",
    });
    return permissions.length > 0;
  }
  return false;
};
export const metamaskAtNetwork = async (networkName) => {
  const hasPermission = await hasMetamaskPermissions()
  if (!hasPermission) {
    return false;
  }
  const chainNameToId = {
    ethereum: "0x1",
    ropsten: "0x3",
    rinkeby: "0x4",
    goerli: "0x5",
    kovan: "0x42",
  };
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  return chainId === chainNameToId[networkName];
};

export const checkAllMetamaskConditions = async (networkName) => {
  return Promise.all([
    hasMetamask(),
    metamaskLoggedIn(),
    hasMetamaskPermissions(),
    metamaskAtNetwork(networkName),
  ]);
};
