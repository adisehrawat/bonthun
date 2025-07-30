// context/ProfileContext.tsx

import { useConnection } from '@/components/solana/solana-provider';
import { useAuthorization } from '@/components/solana/use-authorization';
import { fetchProfile, OnChainProfile } from '@/components/utils/fetch-profile';
import { AnchorProvider } from '@coral-xyz/anchor';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ProfileContextType {
    profile: OnChainProfile | null;
    setProfile: (p: OnChainProfile | null) => void;
    clearProfile: () => void;
    isProfileLoaded: boolean;
    refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
    children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    const [profile, setProfile] = useState<OnChainProfile | null>(null);
    const [isProfileLoaded, setLoaded] = useState(false);
    const { selectedAccount } = useAuthorization();
    const connection = useConnection();

    const refreshProfile = async () => {
        setLoaded(false);

        if (!selectedAccount) {
            setProfile(null);
            setLoaded(true);
            return;
        }

        console.log('[ProfileContext] fetching for', selectedAccount?.publicKey.toString());

        const provider = new AnchorProvider(
            connection,
            { publicKey: selectedAccount.publicKey } as any,
            { commitment: 'processed' }
        );

        const profileAccount = await fetchProfile(selectedAccount.publicKey, provider);
        console.log('[ProfileContext] profile fetched', profileAccount);

        if (profileAccount) {
            setProfile({
                authority: profileAccount.authority,
                username: profileAccount.username,
                email: profileAccount.email,
                avatar: profileAccount.avatar,
                is_hunter: profileAccount.isHunter,
                is_client: profileAccount.isClient,
                bounties_completed: profileAccount.bountiesCompleted,
                bounties_applied: profileAccount.bountiesApplied,
                total_sol_earned: profileAccount.totalSolEarned,
                success_rate: profileAccount.successRate,
                bounties_posted: profileAccount.bountiesPosted,
                total_sol_spent: profileAccount.totalSolSpent,
                bounties_completed_as_client: profileAccount.bountiesCompletedAsClient,
                bounties_rewarded: profileAccount.bountiesRewarded,
            });
        } else {
            setProfile(null);
        }

        setLoaded(true);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            refreshProfile();
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [selectedAccount?.publicKey?.toString()]);

    const clearProfile = () => setProfile(null);

    return (
        <ProfileContext.Provider value={{ profile, setProfile, clearProfile, isProfileLoaded, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = (): ProfileContextType => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};
