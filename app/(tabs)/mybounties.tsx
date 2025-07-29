import BountyCard from '@/components/bounty/BountyCard';
import { mockBounties } from '@/data/mockData';
import { CircleCheck as CheckCircle, Clock, Eye, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function MyBounties() {
  const [activeTab, setActiveTab] = useState<'claimed' | 'completed' | 'posted'>('claimed');

  const claimedBounties = mockBounties.filter(bounty => 
    bounty.status === 'claimed' && bounty.claimedBy === 'Alex Hunter'
  );
  
  const completedBounties = mockBounties.filter(bounty => 
    bounty.status === 'completed' && bounty.claimedBy === 'Alex Hunter'
  );

  const postedBounties = mockBounties.filter(bounty => 
    bounty.clientName === 'Alex Hunter'
  );

  const getCurrentBounties = () => {
    switch (activeTab) {
      case 'claimed':
        return claimedBounties;
      case 'completed':
        return completedBounties;
      case 'posted':
        return postedBounties;
      default:
        return [];
    }
  };

  const handleBountyPress = (bountyId: string) => {
    console.log('Selected bounty:', bountyId);
  };

  const stats = {
    claimed: claimedBounties.length,
    completed: completedBounties.length,
    totalEarned: 650,
    successRate: 94,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bounties</Text>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValueBlue}>{stats.claimed}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValueGreen}>{stats.completed}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={styles.statLabel}>Earned</Text>
            <Text style={styles.statValuePurple}>${stats.totalEarned}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('claimed')}
            style={[styles.tab, activeTab === 'claimed' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'claimed' && styles.tabTextActive]}>
              Claimed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('completed')}
            style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('posted')}
            style={[styles.tab, activeTab === 'posted' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'posted' && styles.tabTextActive]}>
              Posted
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentHeaderText}>
            {getCurrentBounties().length} bounties
          </Text>
          <View style={styles.contentHeaderIcon}>
            {activeTab === 'claimed' && <Clock size={16} color="#6B7280" />}
            {activeTab === 'completed' && <CheckCircle size={16} color="#10B981" />}
            {activeTab === 'posted' && <Eye size={16} color="#6B7280" />}
            <Text style={styles.contentHeaderIconText}>{activeTab}</Text>
          </View>
        </View>

        {getCurrentBounties().map((bounty) => (
          <BountyCard
            key={bounty.id}
            bounty={bounty}
            onPress={() => handleBountyPress(bounty.id)}
          />
        ))}

        {getCurrentBounties().length === 0 && (
          <View style={styles.emptyState}>
            <TrendingUp size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              No {activeTab} bounties
            </Text>
            <Text style={styles.emptyDescription}>
              {activeTab === 'claimed' && "Start claiming bounties to see them here"}
              {activeTab === 'completed' && "Complete some bounties to build your track record"}
              {activeTab === 'posted' && "Create your first bounty to get started"}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  statCardBlue: {
    backgroundColor: '#EFF6FF',
  },
  statCardGreen: {
    backgroundColor: '#ECFDF5',
  },
  statCardPurple: {
    backgroundColor: '#F5F3FF',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValueBlue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  statValueGreen: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  statValuePurple: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  contentHeaderText: {
    color: '#6B7280',
  },
  contentHeaderIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentHeaderIconText: {
    color: '#6B7280',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  emptyDescription: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});