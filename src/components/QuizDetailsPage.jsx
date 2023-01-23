/* eslint-disable no-console */
// import { useState, useEffect } from "react";
import wallet_quiz from "../data/wallet.json";
import { useWallet } from "@solana/wallet-adapter-react";
import QuizInLine from "./Quiz";
export const QuizPlayGround = ({ quizData, editHandler }) => {
  // useEffect(() => {
  //     setQuizesData(quizData);
  //     quizData && setQuestionIndices(Array.from(Array(quizData.questions.length).keys()));
  // }, [quizData]);

  // useEffect(() => {
  //     const getData = async () => {
  //         try {
  //             setFetchingData(true);
  //             const resp = quizId && await getQuiz(quizId);
  //             setQuizesData(resp.data);
  //             setQuestionIndices(shuffleArray(Array.from(Array(resp.data.questions.length).keys())));
  //             setAllowedTime(resp.data.allowedTime || 120);
  //             setLearnMoreLinks(resp.data.learnMoreLinks || []);
  //             setFetchingData(false);
  //             if (resp.status === 0) {
  //                 setNotFound(true);
  //             }
  //         } catch (e) {
  //         }
  //     }
  //     quizId && getData();
  // }, [quizId]);

  const { publicKey } = useWallet();

  console.log("wallet add", publicKey && publicKey.toBase58());
  return (
    <div
      className={`flex flex-grow flex-col w-full "mt-16 sm:mt-10 py-16  px-2 sm:px-20"
      }`}
    >
      <QuizInLine quizData={wallet_quiz} />
      {/* {notFound && (
          <div className="flex flex-col items-center p-10">
            <span className="text-red-500 text-6xl">
              <span>4</span>
              <span>0</span>
              <span>4</span>
            </span>
            <span className="flex items-center text-xl text-red-500">
              {" "}
              <ErrorOutlineIcon htmlColor="red" />{" "}
              <span className="ml-1">Quiz not found!</span>
            </span>
          </div>
        )} */}
    </div>
  );
};

export default QuizPlayGround;
