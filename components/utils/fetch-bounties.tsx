import { Bounty, Submission } from '@/types/bounty';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { PDA, useGetProgram } from '../data/bonthun-data-access';
import { useAuthorization } from '../solana/use-authorization';

export enum BountyStatus {
    Open,
    Claimed,
    Completed,
}


export function useGetBounties() {
    const program = useGetProgram();
    const { selectedAccount } = useAuthorization();
    return useQuery({
        queryKey: ['bounties', program?.programId.toBase58(), selectedAccount?.publicKey.toBase58()],
        queryFn: async (): Promise<Bounty[]> => {
            if (!program) {
                return [];
            }
            try {
                const rawBounties = await program.account.bounty.all();

                const submissions = await program.account.submission.all();

                const submissionMap: { [key: string]: { hunter: string, submission: string, selected: boolean, submittedAt: number }[] } = {};

                submissions.forEach(s => {
                    const bountyId = s.account.bounty.toString();
                    if (!submissionMap[bountyId]) submissionMap[bountyId] = [];
                
                    submissionMap[bountyId].push({
                        hunter: s.account.hunter.toString(),
                        submission: s.account.submissionLink,
                        selected: s.account.selected,
                        submittedAt: s.account.submittedAt.toNumber(),
                    });
                });


                const clientSet = new Set(rawBounties.map(b => b.account.creator.toString()));
                const clients = Array.from(clientSet);

                const clientProfiles = await Promise.all(
                    clients.map(async pk => {
                        const clientPDA = PDA.userProfile(new PublicKey(pk));
                        try {
                            const acc = await program.account.userProfile.fetch(clientPDA);
                            return { pubkey: pk, username: acc.username, avatar: acc.avatar };
                        } catch {
                            return { pubkey: pk, username: 'Anonymous', avatar: '' };
                        }
                    })
                );

                const hunterSet = new Set(rawBounties.map(b => b.account.hunter?.toString()).filter(Boolean));
                const hunters = Array.from(hunterSet);

                const hunterProfiles = await Promise.all(
                    hunters.map(async pk => {
                        const hunterPDA = PDA.userProfile(new PublicKey(pk || ''));
                        try {
                            const acc = await program.account.userProfile.fetch(hunterPDA);
                            return { pubkey: pk, username: acc.username, avatar: acc.avatar };
                        } catch {
                            return { pubkey: pk, username: 'Anonymous', avatar: '' };
                        }
                    })
                );


                const profileMap = Object.fromEntries(
                    clientProfiles.map(p => [p.pubkey, { username: p.username, avatar: p.avatar }])
                );

                const hunterMap = Object.fromEntries(
                    hunterProfiles.map(p => [p.pubkey, { username: p.username, avatar: p.avatar }])
                );


                return rawBounties.map(({account, publicKey}) => {
                    const client = profileMap[account.creator.toString()] || {username: 'Anonymous', avatar: ''};
                    const hunter = hunterMap[account.hunter?.toString() || ''] || {username: 'Anonymous', avatar: ''};
                    
                    return {
                        id: publicKey.toString(),
                        title: account.title,
                        description: account.description,
                        reward: account.reward.toNumber(),
                        location: account.location,
                        timeLimit: account.timeLimit.toNumber(),
                        createdAt: account.createdAt.toNumber(),
                        status: account.status.open ? 'open' : account.status.claimed ? 'claimed' : 'completed',
                        client: {
                            id: account.creator.toString(),
                            name: client.username,
                            avatar: client.avatar,
                        },
                        hunter: account.hunter ? {
                            id: account.hunter.toString(),
                            name: hunter.username,
                            avatar: hunter.avatar,
                        } : null, 
                        submissions: submissionMap[publicKey.toString()]?.map(sub => ({
                            id: sub.submission,
                            hunter: hunterProfiles.find(p => p.pubkey === sub.hunter) || {
                                id: sub.hunter,
                                name: 'Anonymous',
                                email: '',
                                avatar: '',
                                role: 'hunter',
                                totalEarned: 0,
                                totalSpent: 0,
                                completedBounties: 0,
                                successRate: 0,
                                bountiesRewarded: 0,
                                rating: 0
                            },
                            submissionLink: sub.submission,
                            selected: sub.selected,
                            submittedAt: sub.submittedAt,
                        })) || [],
                        bump: account.bump,
                    } as Bounty;
                });
            } catch (error) {
                console.error("Failed to fetch bounties:", error);
                return [];
            }
        },
        enabled: !!program,
    });
}