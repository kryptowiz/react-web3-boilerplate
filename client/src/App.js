import React, { useState, useEffect } from 'react';
import { Web3Provider, useWeb3 } from './hooks';

const App = () => (
  <Web3Provider>
    <AppProviders>
      <ChildComponent />
    </AppProviders>
  </Web3Provider>
);

const AppProviders = ({ children }) => (
  <div>
    {children}
  </div>
);

const ChildComponent = () => {
  const {
    accounts, web3, contract, init,
  } = useWeb3();
  const [storage, setStorage] = useState(undefined);

  console.log(contract);

  const load = async () => {
    if (web3 && accounts.length > 0 && contract) {
      try {
        // Stores a given value, 5 by default.
        await contract.methods.set(5).send({ from: accounts[0] });
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();
        setStorage(response);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 flex justify-center">
      <div className="flex flex-col align-center">
        <h1 className="text-2xl my-10">Money Doubler</h1>
        <h1 className="text-2xl my-10">{storage}</h1>

        {
          accounts.length > 0 ? (
            <div>
              <h2>
                Connected:
                {' '}
                {accounts[0]}
              </h2>

              <button onClick={() => { load(); }}>Set Value</button>
            </div>

          ) : (
            <button
              type="button"
              className="px-8 py-3 text-sm
            text-purple-600
            font-semibold
            rounded-full
            border
            border-purple-200
            hover:text-white
            hover:bg-purple-600
            hover:border-transparent
            focus:outline-none
            focus:ring-2
            focus:ring-purple-600
            focus:ring-offset-2"
              onClick={() => {
                init();
              }}
            >
              Connect Wallet
            </button>
          )
        }

      </div>
    </div>
  );
};

export default App;
