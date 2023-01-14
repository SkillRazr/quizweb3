import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { QuizPrograms } from "../target/types/quiz_programs";

describe("quiz-programs", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.QuizPrograms as Program<QuizPrograms>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
