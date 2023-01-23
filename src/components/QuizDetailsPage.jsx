/* eslint-disable no-console */
// import { useState, useEffect } from "react";
import wallet_quiz from "../data/wallet.json";
import { useWallet } from "@solana/wallet-adapter-react";
import QuizInLine from "./Quiz";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { utils, web3 } from "@project-serum/anchor";
import {ErrorOutline} from '@mui/icons-material'
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
export const QuizPlayGround = ({ program, provider, quizData, editHandler }) => {
  const [notFound, setNotFound] = useState(false);
  const [score, setScore] = useState();
  // useEffect(() => {
  //     setQuizesData(quizData);
  //     quizData && setQuestionIndices(Array.from(Array(quizData.questions.length).keys()));
  // }, [quizData]);

  const {publicKey} = useWallet();

  const callFn = async () => {
    const quiz = new PublicKey('BDTWtU28yeEhp368uwKZK5rsaMub1KrRFCwEWAgqwLCw')
    
    const [participation, _participationBump] = web3.PublicKey.findProgramAddressSync(
      [
        utils.bytes.utf8.encode("participation"),
        quiz.toBuffer(),
        publicKey.toBuffer(),
      ],
      program.programId
      );
      
      try {
        const participationAccount = await program.account.participation.fetch(participation);
        console.log(participationAccount)
        if (participationAccount) {
          setNotFound(true);
          setScore(participationAccount.score.toNumber());
        }
      } catch (e) {
        console.log(e)
      }
    }

  useEffect(() => {
      callFn();
  }, []);

  console.log("wallet add", publicKey && publicKey.toBase58());
  return (
    <div
      className={`flex flex-grow flex-col w-full "mt-16 sm:mt-10 py-16  px-2 sm:px-20"
      }`}
    >
      {!notFound && <QuizInLine program={program} provider={provider} quizData={wallet_quiz} />}
      {notFound && (
          <div className="flex flex-col items-center p-10">
            {/* <span className="text-red-500 text-6xl">
              <span>4</span>
              <span>0</span>
              <span>4</span>
            </span> */}
            <div className="flex items-center text-xl text-green-500 flex-col">
              {" "}
              <span>
                <ErrorOutline htmlColor="green" />{" "}
                <span className="ml-1">You have already participated!</span>
              </span>
              <span className="ml-1">Score: {score}</span>
            </div>
              <NavLink to='/' className='mt-10'>
                <Button>
                  Go Back
                </Button>
              </NavLink>
          </div>
        )}
    </div>
  );
};

export default QuizPlayGround;
