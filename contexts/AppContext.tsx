import { useQueryClient } from '@tanstack/react-query';
import { useGetBounties } from '@/components/utils/fetch-bounties';
import { createContext, useContext, useState } from 'react';
import { Bounty } from '@/types/bounty';

interface AppContextType {
    bounties: Bounty[];
    isLoading: boolean;
    refreshBounties: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
  };



export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const queryClient = useQueryClient();
    const { data: bounties = [] } = useGetBounties();
    const [isLoading, setIsLoading] = useState(false);

    const refreshBounties = async () => {
        setIsLoading(true);
        await queryClient.invalidateQueries({ queryKey: ['bounties'] });
        setIsLoading(false);
    };

    return (
        <AppContext.Provider value={{ bounties, isLoading, refreshBounties }}>
            {children}
        </AppContext.Provider>
    );
}