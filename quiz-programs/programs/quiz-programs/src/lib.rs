use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod quiz_programs {
    use super::*;

    pub fn init_quiz(
        ctx: Context<InitQuiz>,
        name: String,
        questions_link: String,
        questions: u64,
    ) -> Result<()> {
        if name.chars().count() > 20 {
            return Err(ErrorCode::NameTooLong.into());
        }

        let quiz = &mut ctx.accounts.quiz;

        quiz.name = name;
        quiz.authority = *ctx.accounts.authority.key;
        quiz.questions_link = questions_link;
        quiz.participants = 0;
        quiz.questions = questions;
        quiz.init_ts = ctx.accounts.clock.unix_timestamp;

        Ok(())
    }

    pub fn init_participation(ctx: Context<InitParticipation>, score: u64) -> Result<()> {
        let participation = &mut ctx.accounts.participation;
        let quiz = &mut ctx.accounts.quiz;

        participation.quiz = quiz.key();
        participation.user = *ctx.accounts.authority.key;
        participation.score = score;
        participation.init_ts = ctx.accounts.clock.unix_timestamp;

        quiz.participants += 1;

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

    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct InitParticipation<'info> {
    #[account(
        init,
        seeds=[b"participation".as_ref(), quiz.key().as_ref(), authority.key().as_ref()],
        bump,
        payer=authority,
        space=100
    )]
    pub participation: Box<Account<'info, Participation>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub quiz: Box<Account<'info, Quiz>>,

    pub system_program: Program<'info, System>,

    pub clock: Sysvar<'info, Clock>,
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

    /// Number of Questions
    pub questions: u64,

    /// Time of Quiz Creation
    pub init_ts: i64,
}

#[account]
pub struct Participation {
    /// Quiz in which participation is happening
    pub quiz: Pubkey,

    /// Participating user
    pub user: Pubkey,

    /// Score
    pub score: u64,

    /// Time of Participation
    pub init_ts: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Name Too Long")]
    NameTooLong,
}
