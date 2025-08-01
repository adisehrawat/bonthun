use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_lang::system_program::Transfer;

declare_id!("ASDBLcyRSj8bWcQNFiPBJMtDLkWmWytsbYrC7B6RJ81M");


#[program]
pub mod bonthunanchor {
    use super::*;

    pub fn init_user_profile(
        ctx: Context<InitUserProfile>,
        username: String,
        email: String,
        is_hunter: bool,
        is_client: bool
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.profile;

        require!(username.len() <= 50, ErrorCode::TooLong);
        require!(email.len() <= 100, ErrorCode::TooLong);

        user_profile.authority = *ctx.accounts.authority.key;
        user_profile.username = username.clone();
        user_profile.email = email;
        user_profile.avatar = process_avatar(&username);
        user_profile.is_hunter = is_hunter;
        user_profile.is_client = is_client;
        user_profile.bump = ctx.bumps.profile;

        if is_hunter {
            user_profile.bounties_completed = 0;
            user_profile.bounties_applied = 0;
            user_profile.total_sol_earned = 0;
            user_profile.success_rate = 0.0;
        }

        if is_client {
            user_profile.bounties_posted = 0;
            user_profile.total_sol_spent = 0;
            user_profile.bounties_completed_as_client = 0;
            user_profile.bounties_rewarded = 0;
        }
        Ok(())
    }

    pub fn edit_profile(ctx: Context<EditProfile>, name: String, email: String) -> Result<()> {
        require!(name.len() <= 50, ErrorCode::TooLong);
        require!(email.len() <= 100, ErrorCode::TooLong);

        let profile = &mut ctx.accounts.profile;
        require_keys_eq!(profile.authority, ctx.accounts.authority.key(), BountyError::Unauthorized);

        profile.username = name.clone();
        profile.email = email;
        profile.avatar = process_avatar(&name);
        Ok(())
    }

    pub fn delete_profile(ctx: Context<DeleteProfile>) -> Result<()> {
        Ok(())
    }
    pub fn create_bounty(
        ctx: Context<CreateBounty>,
        title: String,
        description: String,
        reward: u64,
        location: String,
        time_limit: i64
    ) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        bounty.creator = *ctx.accounts.creator.key;
        bounty.title = title;
        bounty.description = description;
        bounty.reward = reward;
        bounty.location = location;
        bounty.time_limit = time_limit;
        bounty.status = BountyStatus::Open;
        bounty.bump = ctx.bumps.bounty;
        bounty.hunter = None;
        bounty.created_at = Clock::get()?.unix_timestamp;


        let client_profile = &mut ctx.accounts.profile;
        client_profile.bounties_posted = client_profile.bounties_posted.checked_add(1).unwrap();

        Ok(())
    }

    pub fn claim_bounty(ctx: Context<ClaimBounty>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(bounty.status == BountyStatus::Open, BountyError::BountyNotOpen);

        bounty.status = BountyStatus::Claimed;
        bounty.hunter = Some(*ctx.accounts.hunter.key);

        let hunter_profile = &mut ctx.accounts.hunter_profile;
        hunter_profile.bounties_applied = hunter_profile.bounties_applied.checked_add(1).unwrap();

        Ok(())
    }

    pub fn submit_work(ctx: Context<SubmitWork>, submission_link: String) -> Result<()> {
        require!(submission_link.len() <= 200, ErrorCode::TooLong);

        let bounty = &mut ctx.accounts.bounty;
        require!(bounty.status == BountyStatus::Claimed, ErrorCode::InvalidState);
        require!(Clock::get()?.unix_timestamp < bounty.time_limit, ErrorCode::BountyExpired);
        require!(bounty.hunter.unwrap() == *ctx.accounts.hunter.key, ErrorCode::Unauthorized);

        let submission = &mut ctx.accounts.submission;
        submission.bounty = ctx.accounts.bounty.key();
        submission.hunter = *ctx.accounts.hunter.key;
        submission.submission_link = submission_link;
        submission.submitted_at = Clock::get()?.unix_timestamp;
        submission.selected = false;

        Ok(())
    }

    pub fn select_winner(ctx: Context<SelectWinner>) -> Result<()> {
        let bounty = &mut ctx.accounts.bounty;
        require!(bounty.status == BountyStatus::Claimed, BountyError::BountyNotClaimed);
        require_keys_eq!(bounty.creator, ctx.accounts.creator.key(), BountyError::Unauthorized);

        let hunter_profile = &mut ctx.accounts.hunter_profile;
        let client_profile = &mut ctx.accounts.client_profile;

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.creator.to_account_info(),
                    to: ctx.accounts.winner.to_account_info(),
                },
            ),
            bounty.reward,
        )?;

        hunter_profile.bounties_completed = hunter_profile.bounties_completed.checked_add(1).unwrap();
        hunter_profile.total_sol_earned = hunter_profile.total_sol_earned.checked_add(bounty.reward).unwrap();

        if hunter_profile.bounties_applied > 0 {
            hunter_profile.success_rate =
                (hunter_profile.bounties_completed as f64 / hunter_profile.bounties_applied as f64) * 100.0;
        }

        bounty.status = BountyStatus::Completed;

        client_profile.total_sol_spent = client_profile.total_sol_spent.checked_add(bounty.reward).unwrap();
        client_profile.bounties_completed_as_client = client_profile.bounties_completed_as_client.checked_add(1).unwrap();
        client_profile.bounties_rewarded = client_profile.bounties_rewarded.checked_add(1).unwrap();

        Ok(())
    }
    
}

fn process_avatar(input: &str) -> String {
    let trimmed = input.trim();
    if trimmed.contains(' ') {
        trimmed
            .split_whitespace()
            .filter_map(|word| word.chars().next())
            .collect()
    } else {
        trimmed.chars().take(2).collect()
    }
}

#[derive(Accounts)]
pub struct InitUserProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"user", authority.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EditProfile<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = profile.bump,
        realloc = 8 + UserProfile::INIT_SPACE,
        realloc::payer = authority,
        realloc::zero = false,
        has_one = authority
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteProfile<'info> {
    #[account(
        mut,
        seeds = [b"user", authority.key().as_ref()],
        bump = profile.bump,
        close = authority
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateBounty<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Bounty::INIT_SPACE,
        seeds = [b"bounty", creator.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub bounty: Account<'info, Bounty>,
    #[account(
        mut,
        seeds = [b"user", creator.key().as_ref()],
        bump = profile.bump
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimBounty<'info> {
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    #[account(
        mut,
        seeds = [b"user", hunter.key().as_ref()],
        bump = hunter_profile.bump
    )]
    pub hunter_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub hunter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitWork<'info> {
    #[account(
        init,
        payer = hunter,
        space = 8 + Submission::INIT_SPACE,
        seeds = [b"submission", bounty.key().as_ref(), hunter.key().as_ref()],
        bump
    )]
    pub submission: Account<'info, Submission>,
    #[account(mut)]
    pub bounty: Account<'info, Bounty>,
    #[account(mut)]
    pub hunter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SelectWinner<'info> {
    #[account(mut, has_one = creator)]
    pub bounty: Account<'info, Bounty>,
    #[account(
        mut,
        seeds = [b"user", creator.key().as_ref()],
        bump = client_profile.bump
    )]
    pub client_profile: Account<'info, UserProfile>,
    #[account(
        mut,
        seeds = [b"user", winner.key().as_ref()],
        bump = hunter_profile.bump
    )]
    pub hunter_profile: Account<'info, UserProfile>,
    /// CHECK: This is the account that will receive the SOL.
    #[account(mut)]
    pub winner: AccountInfo<'info>,
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub authority: Pubkey,
    #[max_len(50)]
    pub username: String,
    #[max_len(100)]
    pub email: String,
    #[max_len(50)]
    pub avatar: String,
    pub is_hunter: bool,
    pub is_client: bool,
    pub bounties_completed: u64,
    pub bounties_applied: u64,
    pub total_sol_earned: u64,
    pub success_rate: f64,
    pub bounties_posted: u64,
    pub total_sol_spent: u64,
    pub bounties_completed_as_client: u64,
    pub bounties_rewarded: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Bounty {
    pub creator: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(500)]
    pub description: String,
    pub reward: u64,
    #[max_len(100)]
    pub location: String,
    pub time_limit: i64,
    pub status: BountyStatus,
    pub hunter: Option<Pubkey>,
    pub created_at: i64,
    pub bump: u8,
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum BountyStatus {
    Open,
    Claimed,
    Completed,
}

#[account]
#[derive(InitSpace)]
pub struct Submission {
    pub bounty: Pubkey,
    pub hunter: Pubkey,
    #[max_len(200)]
    pub submission_link: String,
    pub submitted_at: i64,
    pub selected: bool,
    pub bump: u8,
}

// Errors
#[error_code]
pub enum ErrorCode {
    #[msg("String too long")]
    TooLong,
    #[msg("Invalid bounty state")]
    InvalidState,
    #[msg("Bounty expired")]
    BountyExpired,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid amount")]
    InvalidAmount,
}

#[error_code]
pub enum BountyError {
    #[msg("String too long for allocated space")]
    StringTooLong,
    #[msg("Invalid time limit")]
    InvalidTimeLimit,
    #[msg("Invalid reward amount")]
    InvalidReward,
    #[msg("Only client role can perform this action")]
    NotAClient,
    #[msg("Only hunter role can perform this action")]
    NotAHunter,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid status transition or status")]
    InvalidStatus,
    #[msg("Submission does not belong to bounty or hunter mismatch")]
    SubmissionMismatch,
    #[msg("Submission past the deadline")]
    PastDeadline,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Escrow does not have enough lamports")]
    InsufficientEscrow,
    #[msg("Invalid index for PDA seeds")]
    InvalidIndex,
    #[msg("Seed index unavailable (store it in the Bounty account)")]
    SeedIndexUnavailable,
    #[msg("bounty open opened")]
    BountyNotOpen,
    #[msg("Bounty has not been claimed.")]
    BountyNotClaimed,
}