import { getBonthunProgram } from "@/bonthunanchor/src/bonthunanchor-exports";
import { AnchorProvider,BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';


export interface OnChainProfile {
    authority: PublicKey,
    username: string,
    email: string,
    avatar: string,
    is_hunter: boolean,
    is_client: boolean,
    bounties_completed: BN,
    bounties_applied: BN,
    total_sol_earned: BN,
    success_rate: number,
    bounties_posted: BN,
    total_sol_spent: BN,
    bounties_rewarded: BN,
    bounties_completed_as_client: BN,
}

export async function fetchProfile(owner: PublicKey,provider: AnchorProvider) {
    const program = getBonthunProgram(provider);
    console.log('[fetchprofile] program loaded',program.programId.toString());
    const [userProfilePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('user'), owner.toBuffer()],
        program.programId
    )
    console.log('[fetchProfile] userProfilePDA', userProfilePDA.toString());
    const userProfileAccount = await program.account.userProfile.fetchNullable(userProfilePDA).catch(e => {
        console.error('[fetchProfile] user fetch failed', e);
        return null;
    });
    console.log('[fetchProfile] userProfileAcc exists?', !!userProfileAccount);
    if(userProfileAccount) return {
        ...userProfileAccount,
    }
}