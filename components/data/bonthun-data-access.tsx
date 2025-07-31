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
        return new AnchorProvider(connection, wallet, {
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
                console.log('[createUserProfile] profilePDA', profilePDA.toString());
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .initUserProfile(username, email, true, true)
                    .accountsStrict({
                        profile: profilePDA,
                        authority: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                console.log('[createUserProfile] instruction build', ix);

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                console.log('[createUserProfile] versioned tx built: ', tx);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                console.log('[createUserProfile] tx sent:', txid);
                console.log('[createUserProfile] Waiting for transaction confirmation...${ txid }');
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                console.log('[createUserProfile] Transaction confirmed.');
                return txid;
            }
            catch (err: any) {
                console.error('[createUserProfile] ERROR:', err);
                throw err;
            }
        },
        onSuccess: () => {
            console.log("client profile created successfully");
            return queryClient.invalidateQueries({ queryKey: ['profile', account?.publicKey?.toString()] });
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
                console.log('[editUserProfile] profilePDA', profilePDA.toString());
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .editProfile(username, email)
                    .accountsStrict({
                        profile: profilePDA,
                        authority: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                console.log('[editUserProfile] instruction build', ix);

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                console.log('[editUserProfile] versioned tx built: ', tx);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                console.log('[editUserProfile] tx sent:', txid);
                console.log('[editUserProfile] Waiting for transaction confirmation...${ txid }');
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                console.log('[editUserProfile] Transaction confirmed.');
                return txid;
            }
            catch (err: any) {
                console.error('[editUserProfile] ERROR:', err);
                throw err;
            }
        },
        onSuccess: () => {
            console.log("client profile edited successfully");
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
                console.log('[deleteUserProfile] profilePDA', profilePDA.toString());
                if (!bonthunProgram) throw new Error('Program not ready');
                const ix = await bonthunProgram.methods
                    .deleteProfile()
                    .accountsStrict({
                        profile: profilePDA,
                        authority: pubkey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                console.log('[deleteUserProfile] instruction build', ix);

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                console.log('[deleteUserProfile] versioned tx built: ', tx);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                console.log('[deleteUserProfile] tx sent:', txid);
                console.log('[deleteUserProfile] Waiting for transaction confirmation...${ txid }');
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                console.log('[deleteUserProfile] Transaction confirmed.');
                return txid;
            }
            catch (err: any) {
                console.error('[deleteUserProfile] ERROR:', err);
                throw err;
            }
        },
        onSuccess: () => {
            console.log("client profile deleted successfully");
            return queryClient.invalidateQueries({ queryKey: ['profile', walletUiAccount?.publicKey?.toString()] });
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
                console.log('[createBounty] rewardInLamports', rewardInLamports.toString());
                console.log('[createBounty] bountyPDA', bountyPDA.toString());
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
                console.log('[createBounty] instruction build', ix);

                const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
                const messageV0 = new TransactionMessage({
                    payerKey: pubkey,
                    recentBlockhash: blockhash,
                    instructions: [ix],
                }).compileToV0Message();
                const tx = new VersionedTransaction(messageV0);
                console.log('[createBounty] versioned tx built: ', tx);
                const txid = await signAndSendTransaction(tx, lastValidBlockHeight);
                console.log('[createBounty] tx sent:', txid);
                console.log('[createBounty] Waiting for transaction confirmation...${ txid }');
                const result = await connection.confirmTransaction({
                    signature: txid,
                    blockhash,
                    lastValidBlockHeight
                }, 'confirmed');

                if (result.value.err) {
                    throw new Error('Transaction failed: ' + JSON.stringify(result.value.err));
                }
                console.log('[createBounty] Transaction confirmed.');
                return txid;
            }
            catch (err: any) {
                console.error('[createBounty] ERROR:', err);
                throw err;
            }
        },
        onSuccess: () => {
            console.log("bounty created successfully");
            return queryClient.invalidateQueries({ queryKey: ['bounty', account?.publicKey?.toString()] });
        }
    });
}