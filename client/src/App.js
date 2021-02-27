import React, { useState, useEffect } from 'react';
import { Web3Provider, useWeb3 } from './hooks';

import './App.css';

const App = () => (
  <Web3Provider>
    <AppProviders>
      <ChildComponent />
    </AppProviders>
  </Web3Provider>
);

const AppProviders = ({ children }) => {
  const { accounts, web3, contract } = useWeb3();

  if (!web3 || !accounts || !contract) {
    return (
      <div>
        Web3, accounts or contract not existent
      </div>
    );
  }

  return (
    <div>
      <h1>My App</h1>
      {children}
    </div>
  );
};

const ChildComponent = () => {
  const { accounts, web3, contract } = useWeb3();
  const [storage, setStorage] = useState(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        // Stores a given value, 5 by default.
        await contract.methods.set(5).send({ from: accounts[0] });

        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();

        setStorage(response);
      } catch (error) {
        alert('Failed to run method');
        console.log(error);
      }
    };

    if (web3 && accounts.length > 0 && contract) {
      load();
    }
  }, [web3, accounts, contract]);

  return (
    <div>
      {storage && (<h2>{storage}</h2>)}
    </div>
  );
};

export default App;
