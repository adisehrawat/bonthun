import { BONTHUN_PROGRAM_ID, getBonthunProgram } from "@/bonthunanchor/src/bonthunanchor-exports";
import { useMobileWallet } from '@/components/solana/use-mobile-wallet';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import {
    PublicKey,
    SystemProgram,
    TransactionMessage,
    VersionedTransaction
} from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import Toast from 'react-native-toast-message';
import { useConnection } from "../solana/solana-provider";
import { useAuthorization } from "../solana/use-authorization";

const program_id = BONTHUN_PROGRAM_ID;

const createMobileAnchorWallet = (selectedAccount: any): any => {
    return {
        publicKey: selectedAccount.publicKey,
        signTransaction: async () => {
            throw new Error("signTransaction is not implemented by mobile wallet");
        },
        signAllTransactions: async () => {
            throw new Error("signAllTransactions is not implemented by mobile wallet");
        },
    };
};

export function useGetProgram() {
    const connection = useConnection();
    const { selectedAccount } = useAuthorization();
    const provider = useMemo(() => {
        if (!selectedAccount) return null;
        const wallet = createMobileAnchorWallet(selectedAccount);
        return new AnchorProvider(connection as any, wallet, {
            preflightCommitment: "confirmed",
            commitment: "processed",
        });
    }, [selectedAccount, connection]);

    const bonthunProgram = useMemo(() => {
        if (!provider) return null;
        return getBonthunProgram(provider);
    }, [provider]);
    return bonthunProgram;
}


export const PDA = {
    userProfile: (owner: PublicKey) =>
        PublicKey.findProgramAddressSync([Buffer.from('user'), owner.toBuffer()], program_id)[0],
    bounty: (owner: PublicKey, title: string) =>
        PublicKey.findProgramAddressSync([Buffer.from('bounty'), owner.toBuffer(), Buffer.from(title)], program_id)[0],
    submission: (bounty: PublicKey, hunter: PublicKey) =>
        PublicKey.findProgramAddressSync([Buffer.from('submission'), bounty.toBuffer(), hunter.toBuffer()], program_id)[0],
}
// user profile
interface createUserProfile {
    username: string,
    email: string,
}

interface createBounty {
    title: string,
    description: string,
    reward: BN,
    location: string,
    time_limit: BN,
}

export function useCreateUserProfile() {
    const connection = useConnection();
    const bonthunProgram = useGetProgram();
    const { account } = useWalletUi();
    const { signAndSendTransaction } = useMobileWallet();
    const queryClient = useQueryClient();

    return useMutation<string, Error, createUserProfile>({
        mutationKey: ['create-user-profile'],
        mutationFn: async ({ username, email }) => {
            try {
                let pubkey = account?.publicKey;
                if (!pubkey) throw new Error("No public key");

                const profilePDA = PDA.userProfile(pubkey);
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .initUserProfile(username, email, true, true)
                    .accountsStrict({
                        profile: profilePDA,
                        authority: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                return txid;
            }
            catch (err: any) {
                console.error('[createUserProfile] ERROR:', err);
                throw err;
            }
        },
        onSuccess: (txid) => {
            Toast.show({
                type: 'success',
                text1: 'User profile created successfully',
            });
            return queryClient.invalidateQueries({ queryKey: ['profile', account?.publicKey?.toString()] });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Error creating profile',
                text2: error.message,
            });
        }
    });
}

export function useEditUserProfile() {
    const connection = useConnection();
    const bonthunProgram = useGetProgram();
    const { account: walletUiAccount } = useWalletUi();
    const { signAndSendTransaction } = useMobileWallet();

    return useMutation<string, Error, createUserProfile>({
        mutationKey: ['edit-user-profile'],
        mutationFn: async ({ username, email }) => {
            try {
                let pubkey = walletUiAccount?.publicKey;
                if (!pubkey) throw new Error("No public key");

                const profilePDA = PDA.userProfile(pubkey);
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .editProfile(username, email)
                    .accountsStrict({
                        profile: profilePDA,
                        authority: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                return txid;
            }
            catch (err: any) {
                console.error('[editUserProfile] ERROR:', err);
                throw err;
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'User profile edited successfully',
            });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Error editing profile',
                text2: error.message,
            });
        }
    });
}

export function useDeleteUserProfile() {
    const connection = useConnection();
    const bonthunProgram = useGetProgram();
    const { account: walletUiAccount } = useWalletUi();
    const { signAndSendTransaction } = useMobileWallet();
    const queryClient = useQueryClient();

    return useMutation<string, Error>({
        mutationKey: ['delete-user-profile'],
        mutationFn: async () => {
            try {
                let pubkey = walletUiAccount?.publicKey;
                if (!pubkey) throw new Error("No public key");

                const profilePDA = PDA.userProfile(pubkey);
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .deleteProfile()
                    .accountsStrict({
                        profile: profilePDA,
                        authority: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                return txid;
            }
            catch (err: any) {
                throw err;
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'User profile deleted successfully',
            });
            return queryClient.invalidateQueries({ queryKey: ['profile', walletUiAccount?.publicKey?.toString()] });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Error deleting profile',
                text2: error.message,
            });
        }
    });
}

export function useCreateBounty() {
    const connection = useConnection();
    const bonthunProgram = useGetProgram();
    const { account } = useWalletUi();
    const { signAndSendTransaction } = useMobileWallet();
    const queryClient = useQueryClient();

    return useMutation<string, Error, createBounty>({
        mutationKey: ['create-bounty'],
        mutationFn: async ({ title, description, reward, location, time_limit }) => {
            try {
                let pubkey = account?.publicKey;
                if (!pubkey) throw new Error("No public key");

                const profilePDA = PDA.userProfile(pubkey);
                const bountyPDA = PDA.bounty(pubkey, title);
                const rewardInLamports = new BN(reward.toNumber() * 1_000_000_000);
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .createBounty(
                        title,
                        description,
                        rewardInLamports,
                        location,
                        time_limit
                    )
                    .accountsStrict({
                        bounty: bountyPDA,
                        profile: profilePDA,
                        creator: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                return txid;
            }
            catch (err: any) {
                throw err;
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Bounty created successfully',
            });
            return queryClient.invalidateQueries({ queryKey: ['bounty', account?.publicKey?.toString()] });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Error creating bounty',
                text2: error.message,
            });
        }
    });
}

export function useClaimBounty() {
    const connection = useConnection();
    const bonthunProgram = useGetProgram();
    const { account } = useWalletUi();
    const { signAndSendTransaction } = useMobileWallet();
    const queryClient = useQueryClient();

    return useMutation<string, Error, { bountyPDA: PublicKey }>({
        mutationKey: ['claim-bounty'],
        mutationFn: async ({ bountyPDA }) => {
            try {
                let pubkey = account?.publicKey;
                if (!pubkey) throw new Error("No public key");
                const hunterProfilePDA = PDA.userProfile(pubkey);
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .claimBounty()
                    .accountsStrict({
                        bounty: bountyPDA,
                        hunterProfile: hunterProfilePDA,
                        hunter: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                return txid;
            }
            catch (err: any) {
                throw err;
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Applied for bounty successfully',
            });
            return queryClient.invalidateQueries({ queryKey: ['bounty', account?.publicKey?.toString()] });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Error applying for bounty',
                text2: error.message,
            });
        }
    });
}

export function useSubmitToBounty() {
    const connection = useConnection();
    const bonthunProgram = useGetProgram();
    const { account } = useWalletUi();
    const { signAndSendTransaction } = useMobileWallet();
    const queryClient = useQueryClient();

    return useMutation<string, Error, { bountyPDA: PublicKey, submissionLink: string }>({
        mutationKey: ['submit-to-bounty'],
        mutationFn: async ({ bountyPDA, submissionLink }) => {
            try {
                let pubkey = account?.publicKey;
                if (!pubkey) throw new Error("No public key");
                const submissionPDA = PDA.submission(bountyPDA, pubkey);
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .submitWork(submissionLink)
                    .accountsStrict({
                        submission: submissionPDA,
                        bounty: bountyPDA,
                        hunter: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                return txid;
            }
            catch (err: any) {
                throw err;
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Submitted to bounty successfully',
            });
            return queryClient.invalidateQueries({ queryKey: ['bounty', account?.publicKey?.toString()] });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Error submitting to bounty',
                text2: error.message,
            });
        }
    });
}

export function useSelectWinner() {
    const connection = useConnection();
    const bonthunProgram = useGetProgram();
    const { account } = useWalletUi();
    const { signAndSendTransaction } = useMobileWallet();
    const queryClient = useQueryClient();

    return useMutation<string, Error, { bountyPDA: PublicKey, winner: PublicKey }>({
        mutationKey: ['select-winner'],
        mutationFn: async ({ bountyPDA, winner }) => {
            try {
                let pubkey = account?.publicKey;
                if (!pubkey) throw new Error("No public key");
                const clientProfilePDA = PDA.userProfile(pubkey);
                const hunterProfilePDA = PDA.userProfile(winner);
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .selectWinner()
                    .accountsStrict({
                        bounty: bountyPDA,
                        clientProfile: clientProfilePDA,
                        hunterProfile: hunterProfilePDA,
                        winner,
                        creator: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                return txid;
            }
            catch (err: any) {
                throw err;
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Winner selected successfully',
            });
            return queryClient.invalidateQueries({ queryKey: ['bounty', account?.publicKey?.toString()] });
        },
        onError: (error: Error) => {
            Toast.show({
                type: 'error',
                text1: 'Error selecting winner',
                text2: error.message,
            });
        }
    });
}
