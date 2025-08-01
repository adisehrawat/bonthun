import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Linking,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { PublicKey } from '@solana/web3.js';
import { useGetSignatures } from './account-data-access';
import { RefreshCw } from 'lucide-react-native'; 

const ellipsify = (str: string, len = 8) =>
  str.length > len ? `${str.slice(0, len)}...${str.slice(-len)}` : str;

const openExplorer = (type: string, value: string | number) => {
  const url = `https://explorer.solana.com/${type}/${value}`;
  Linking.openURL(url);
};

export function AccountTransactions({ address }: { address: PublicKey }) {
    const query = useGetSignatures({ address });
    const [showAll, setShowAll] = useState(false);
  
    const items = useMemo(() => {
      if (showAll) return query.data;
      return query.data?.slice(0, 5);
    }, [query.data, showAll]);
  
    if (!query.isSuccess && !query.isLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Transaction History</Text>
            <Pressable onPress={() => query.refetch()}>
              <RefreshCw size={20} color="#60a5fa" />
            </Pressable>
          </View>
          <Text style={styles.errorText}>Error: {query.error?.message}</Text>
        </View>
      );
    }
  
    return (
      <FlatList
        contentContainerStyle={styles.container}
        data={query.isSuccess ? items : []}
        keyExtractor={(item) => item.signature}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Transaction History</Text>
            {query.isLoading ? (
              <ActivityIndicator color="#60a5fa" />
            ) : (
              <Pressable onPress={() => query.refetch()}>
                <RefreshCw size={20} color="#60a5fa" />
              </Pressable>
            )}
          </View>
        }
        ListEmptyComponent={
          query.isLoading ? null : (
            <Text style={styles.emptyText}>No transactions found.</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable onPress={() => openExplorer('tx', item.signature)}>
              <Text style={styles.signatureText}>
                {ellipsify(item.signature)}
              </Text>
            </Pressable>
  
            <Pressable onPress={() => openExplorer('block', item.slot)}>
              <Text style={styles.slotText}>{item.slot}</Text>
            </Pressable>
  
            <Text style={styles.timeText}>
              {new Date((item.blockTime ?? 0) * 1000).toLocaleString()}
            </Text>
  
            <Text
              style={[
                styles.statusBadge,
                item.err ? styles.statusFailed : styles.statusSuccess,
              ]}
            >
              {item.err ? 'Failed' : 'Success'}
            </Text>
          </View>
        )}
        ListFooterComponent={
          query.isSuccess && query.data.length > 5 ? (
            <Pressable
              onPress={() => setShowAll(!showAll)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>
                {showAll ? 'Show Less' : 'Show All'}
              </Text>
            </Pressable>
          ) : null
        }
      />
    );
  }
  

const styles = StyleSheet.create({
    container: {
      margin: 16,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 16,
    },
    header: {
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: '#111',
      fontSize: 18,
      fontWeight: '600',
    },
    row: {
      flexDirection: 'column',
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    signatureText: {
      color: '#2563eb', // blue-600
      fontFamily: 'monospace',
      fontSize: 14,
      marginBottom: 4,
    },
    slotText: {
      color: '#333',
      fontSize: 14,
      marginBottom: 4,
    },
    timeText: {
      color: '#666',
      fontSize: 12,
      marginBottom: 6,
    },
    statusBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 'bold',
      overflow: 'hidden',
    },
    statusSuccess: {
      color: '#16a34a',
      backgroundColor: '#d1fae5',
    },
    statusFailed: {
      color: '#dc2626',
      backgroundColor: '#fee2e2',
    },
    toggleButton: {
      marginTop: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#cbd5e1',
      paddingVertical: 8,
      alignItems: 'center',
      backgroundColor: '#f1f5f9',
    },
    toggleText: {
      color: '#2563eb', 
      fontSize: 14,
      fontWeight: '500',
    },
    errorText: {
      color: '#dc2626', 
      marginBottom: 10,
    },
    emptyText: {
      color: '#666',
      fontStyle: 'italic',
    },
  });
  