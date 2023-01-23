import React from "react";
import { Outlet } from "react-router-dom";
import {
  WalletMultiButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { getTruncatedPubkey } from "../uiHelper";
import { useWallet } from "@solana/wallet-adapter-react";

const Layout = (props) => {
  const wallet = useWallet();
  return (
    <div className="flex flex-col h-screen">
      <Layout.Header>
        <div
          id="header"
          className="bg-green-300 h-16 text-center p-4 flex justify-center align-center items-center"
        >
          <div className="text-center font-[60px] mr-20">Quiz Web3</div>

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
      </Layout.Header>
      <Outlet className="flex flex-grow container" {...props} />
      <Layout.Footer>
        <div className="bg-green-300 h-16 text-center p-4">2023</div>
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
