import { Bounty } from '@/types/bounty';
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
                console.log('[fetchBounties] bounties fetched', rawBounties.length);

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

                console.log('clientProfiles:', clientProfiles);
                console.log('hunterProfiles:', hunterProfiles);

                const profileMap = Object.fromEntries(
                    clientProfiles.map(p => [p.pubkey, { username: p.username, avatar: p.avatar }])
                );

                const hunterMap = Object.fromEntries(
                    hunterProfiles.map(p => [p.pubkey, { username: p.username, avatar: p.avatar }])
                );

                console.log('profileMap:', profileMap);
                console.log('hunterMap:', hunterMap);



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
