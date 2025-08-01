import { getBonthunProgram } from "@/bonthunanchor/src/bonthunanchor-exports";
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';


export interface OnChainProfile {
    authority: PublicKey,
    username: string,
    email: string,
    avatar: string,
    isHunter: boolean,
    isClient: boolean,
    bountiesCompleted: BN,
    bountiesApplied: BN,
    totalSolEarned: BN,
    successRate: number,
    bountiesPosted: BN,
    totalSolSpent: BN,
    bountiesRewarded: BN,
    bountiesCompletedAsClient: BN,
    bump: number,
}

export async function fetchProfile(owner: PublicKey, provider: AnchorProvider) {
    const program = getBonthunProgram(provider);
    const [userProfilePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('user'), owner.toBuffer()],
        program.programId
    )
    const userProfileAccount = await program.account.userProfile.fetchNullable(userProfilePDA).catch(e => {
        console.error('[fetchProfile] user fetch failed', e);
        return null;
    });
    if (userProfileAccount) return {
        ...userProfileAccount,
    }
}