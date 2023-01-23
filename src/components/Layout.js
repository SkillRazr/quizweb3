import React from "react";
import { Outlet } from "react-router-dom";
import {
  WalletMultiButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { getTruncatedPubkey } from "../uiHelper";
import { useWallet } from "@solana/wallet-adapter-react";
import logo from "../assets/quiz_logo.png";
import twitter from "../assets/Twitter.png";
import linkedin from "../assets/LinkedIn.png";

const Layout = (props) => {
  const wallet = useWallet();
  return (
    <div className="flex flex-col h-screen">
      <Layout.Header>
        <div
          id="header"
          className="bg-green-300 h-16 text-center p-4 flex justify-between align-center items-center"
        >
          <a href="/">
            <img src={logo} alt="logo" className="w-[40px] cursor-pointer" />
          </a>
          <div className="text-center font-[60px] font-bold">
            Quiz Web3 - A Decentralised Quiz Platform
          </div>
          <div className="flex">
            <div className="flex mr-10">
              <a
                href="https://twitter.com/skillrazr"
                target="_blank"
                rel="noreferrer"
              >
                <img src={twitter} alt="twitter" className="w-[30px]" />
              </a>
              <a
                href="https://www.linkedin.com/company/80788727"
                target="_blank"
                rel="noreferrer"
              >
                <img src={linkedin} alt="linkedin" className="w-[30px]" />
              </a>
            </div>
            <WalletModalProvider>
              <WalletMultiButton
                startIcon={undefined}
                className={
                  wallet.connected
                    ? "colored wallet-adapter-button-trigger navbarbutton_connected !h-[36px] !text-[14px] !text-white !px-2 !font-thin"
                    : "colored wallet-adapter-button-trigger bg-gradient-to-r from-[#F45151] to-[#FF3378] !h-[36px] !text-[14px] !text-white !px-2 !font-thin"
                }
              >
                {wallet.publicKey && (
                  <span>
                    {getTruncatedPubkey(wallet.publicKey.toBase58())}
                    {""}
                  </span>
                )}
                {!wallet.connected && "Connect Wallet"}
              </WalletMultiButton>
            </WalletModalProvider>
          </div>
        </div>
      </Layout.Header>
      <Outlet className="flex flex-grow container" {...props} />
      <Layout.Footer>
        <div className="bg-green-300 h-16 text-center p-4">
          © 2023 Genlent Technologies All rights reserved
        </div>
      </Layout.Footer>
    </div>
  );
};

Layout.Header =
  Layout.Body =
  Layout.Footer =
    (props) => {
      return <>{props.children}</>;
    };

export default Layout;
