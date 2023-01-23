import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { QuizPrograms } from "../target/types/quiz_programs";

describe("quiz-programs", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const program = anchor.workspace.QuizPrograms as Program<QuizPrograms>;
  
  const quizName = "wallets";

  let quiz = null;
  
  it("Can initialize quiz", async () => {
    const [_quiz, _quizBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("quiz"),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(quizName)
      ],
      program.programId
    );

    quiz = _quiz;
      
    await program.methods.initQuiz(quizName, "https://quizweb3.com", new anchor.BN(5))
      .accounts({
        quiz: quiz,
        authority: provider.wallet.publicKey,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([])
      .rpc();
      
    const createdQuiz = await program.account.quiz.fetch(quiz);
    console.log(createdQuiz);
  });

  return;

  let participation = null;
    
  it("Can initialize participation", async () => {
    const [_participation, _participationBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("participation"),
        quiz.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const answers = [
      {questionNo: 1, answer: "a"},
      {questionNo: 2, answer: "c"},
      {questionNo: 3, answer: "b"},
      {questionNo: 4, answer: "d"},
      {questionNo: 5, answer: "c"},
    ]

    participation = _participation;

    await program.methods.initParticipation(new anchor.BN(20), answers)
      .accounts({
        participation: participation,
        quiz: quiz,
        authority: provider.wallet.publicKey,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([])
      .rpc()

    const createdParticipation = await program.account.participation.fetch(participation);
    console.log(createdParticipation);
  })
});
