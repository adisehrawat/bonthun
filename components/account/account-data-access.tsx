import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    TransactionMessage,
    TransactionSignature,
    VersionedTransaction,
} from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useConnection } from '../solana/solana-provider'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

const ellipsify = (str: string, length = 10) => {
    if (str.length <= length) return str;
    return `${str.slice(0, 8)}...${str.slice(-8)}`;
};

export const ExplorerLink = ({ address }: { address: string }) => {
    const handlePress = () => {
      const url = `https://explorer.solana.com/account/${address}`;
      Linking.openURL(url);
    };
  
    return (
      <View style={styles.container}>
        <Pressable onPress={handlePress} style={({ pressed }) => [
          styles.linkBox,
          pressed && styles.pressed,
        ]}>
          <Text style={styles.label}>Solana Explorer</Text>
          <Text style={styles.address}>{ellipsify(address)}</Text>
        </Pressable>
      </View>
    );
  };

export function useGetBalance({ address }: { address: PublicKey }) {
    const connection = useConnection()

    return useQuery({
        queryKey: ['get-balance', { endpoint: connection.rpcEndpoint, address }],
        queryFn: () => connection.getBalance(address),
    })
}

export function useGetSignatures({ address }: { address: PublicKey }) {
    const connection = useConnection()
  
    return useQuery({
      queryKey: ['get-signatures', { endpoint: connection.rpcEndpoint, address }],
      queryFn: () => connection.getSignaturesForAddress(address),
    })
  }


  const styles = StyleSheet.create({
    container: {
      marginVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'center',
      width: '100%',
      justifyContent: 'center',
    },
    linkBox: {
      backgroundColor: '#f9f9f9',
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    pressed: {
      backgroundColor: '#eee',
    },
    label: {
      color: '#666',
      fontSize: 12,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    address: {
      color: '#000',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  