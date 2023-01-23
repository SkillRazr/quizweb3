import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import HomePage from "./components/HomePage";
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizDetailsPage from "./components/QuizDetailsPage";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { AnchorProvider, Program, Idl } from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl/quiz_programs.json";

require("@solana/wallet-adapter-react-ui/styles.css");

function App(props) {
  const [web3Program, setProgram] = useState();
  const [web3Provider, setProvider] = useState();

  const network = WalletAdapterNetwork.Devnet;

  const networkUrl = "https://api.devnet.solana.com";

  const programID = new PublicKey(idl.metadata.address);
  const opts = {
    preflightCommitment: "processed",
  };

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    []
  );

  const getProvider = () => {
    const connection = new Connection(networkUrl);

    const provider = new AnchorProvider(
      connection,
      wallets[0],
      opts.preflightCommitment
    );
    return provider;
  };

  const callFn = () => {
    try {
      const provider = getProvider();

      const program = new Program(idl, programID, provider);
      setProvider(provider);
      console.log(provider);
      setProgram(program);
      console.log(program);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    callFn();
  }, []);

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  {...props}
                  program={web3Program}
                  provider={web3Provider}
                />
              }
            >
              <Route
                index
                element={
                  <HomePage
                    program={web3Program}
                    provider={web3Provider}
                    {...props}
                  />
                }
              />

              <Route
                path="/quizzes/:id"
                element={
                  <QuizDetailsPage
                    program={web3Program}
                    provider={web3Provider}
                    {...props}
                  />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
