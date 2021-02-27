import React, {
  createContext, useEffect, useState, useContext,
} from 'react';
import getWeb3 from '../getWeb3';
import SimpleStorageContract from '../contracts/SimpleStorage.json';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
      // Get network provider and web3 instance.
        const web3Instance = await getWeb3();

        // Use web3 to get the user's accounts.
        const accountsInstance = await web3Instance.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3Instance.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3Instance);
        setAccounts(accountsInstance);
        setContract(instance);
      } catch (error) {
        alert('Failed to load web3');
        console.log(error);
      }
    };

    init();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, contract, accounts }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const { web3, accounts, contract } = useContext(Web3Context);
  return {
    web3,
    accounts,
    contract,
  };
};
