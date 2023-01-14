use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod quiz_programs {
    use super::*;

    pub fn init_quiz(ctx: Context<InitQuiz>, name: String, questions_link: String) -> Result<()> {
        if name.chars().count() > 10 {
            return Err(ErrorCode::NameTooLong.into());
        }

        let quiz = &mut ctx.accounts.quiz;

        quiz.name = name;
        quiz.authority = *ctx.accounts.authority.key;
        quiz.questions_link = questions_link;
        quiz.participants = 0;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitQuiz<'info> {
    #[account(
        init,
        seeds=[b"quiz".as_ref(), authority.key().as_ref(), name.as_bytes()],
        bump,
        payer=authority,
        space=1000
    )]
    pub quiz: Box<Account<'info, Quiz>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Quiz {
    /// Name of the Quiz
    pub name: String,

    /// Authority
    pub authority: Pubkey,

    /// Questions URI
    pub questions_link: String,

    /// Number of Participants
    pub participants: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Name Too Long")]
    NameTooLong,
}
