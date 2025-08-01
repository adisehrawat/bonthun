import { useWalletUi } from '@/components/solana/use-wallet-ui'
import { AppText } from '@/components/app-text'
import { ellipsify } from '@/utils/ellipsify'
import { AppView } from '@/components/app-view'
import { AppPage } from '@/components/app-page'
import { AccountUiButtons } from './account-ui-buttons'
import { AccountUiBalance } from '@/components/account/account-ui-balance'
import { AccountUiTokenAccounts } from '@/components/account/account-ui-token-accounts'
import { RefreshControl, ScrollView, View } from 'react-native'
import { useCallback, useState } from 'react'
import { useGetBalanceInvalidate } from '@/components/account/use-get-balance'
import { PublicKey } from '@solana/web3.js'
import { useGetTokenAccountsInvalidate } from '@/components/account/use-get-token-accounts'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { ExplorerLink } from './account-data-access'
import { AccountTransactions } from './transaction'

export function AccountFeature() {
    const { account } = useWalletUi();
    const [refreshing, setRefreshing] = useState(false);

    const invalidateBalance = useGetBalanceInvalidate({ address: account?.publicKey as PublicKey });
    const invalidateTokenAccounts = useGetTokenAccountsInvalidate({ address: account?.publicKey as PublicKey });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([invalidateBalance(), invalidateTokenAccounts()]);
        setRefreshing(false);
    }, [invalidateBalance, invalidateTokenAccounts]);

    return (
        <AppPage>
            {account ? (
                <>

                    <AccountUiBalance address={account.publicKey} />
                    <ExplorerLink address={account.publicKey.toString()} />

                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />
                    <AccountTransactions address={account.publicKey} />
                </>
            ) : (
                <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText>Connect your wallet.</AppText>
                    <WalletUiButtonConnect />
                </AppView>
            )}
        </AppPage>
    );
}
