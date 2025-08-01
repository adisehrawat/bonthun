import BountyCard from '@/components/bounty/BountyCard';
import BountyDetailsModal from '@/components/bounty/BountyDetails';
import ProfileCreateModal from '@/components/profile/ProfileCreateModal';
import { useProfile } from '@/contexts/ProfileContext';
import { mockBounties } from '@/data/mockData';
import { Bounty } from '@/types/bounty';
import { useRouter } from 'expo-router';
import { Filter, MapPin, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { Bounty as OnChainBounty } from '@/types/bounty';

export default function BrowseBounties() {
    const { bounties, isLoading, refreshBounties } = useApp();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('open');
    const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [claimedBounties, setClaimedBounties] = useState<{ [key: string]: string | null }>({});
    const { profile, isProfileLoaded } = useProfile();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();


    const handlePress = (bounty: Bounty) => {
        setSelectedBounty(bounty);
        setModalVisible(true);
    };


    const filteredBounties = bounties.filter((bounty) => {
        if (bounty.status === 'completed' || bounty.status === 'claimed') {
            return false;
        }
        const matchesSearch =
            bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bounty.description.toLowerCase().includes(searchQuery.toLowerCase());


        const isClaimed = claimedBounties.hasOwnProperty(bounty.id);
        const matchesStatus =
            selectedStatus === 'open' ? !isClaimed :
                selectedStatus === 'claimed' ? isClaimed && !claimedBounties[bounty.id] :
                    selectedStatus === 'completed' ? isClaimed && !!claimedBounties[bounty.id] :
                        false;

        return matchesSearch && matchesStatus;
    });

    if (!isProfileLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>


            {!profile && (
                <View style={styles.centerCard}>
                    <UserPlus size={48} color="#2563EB" />
                    <Text style={styles.centerTitle}>Create your profile first</Text>
                    <Text style={styles.centerText}>
                        You need a profile to see projects.
                    </Text>
                    <View style={styles.centerButtons}>
                        <TouchableOpacity
                            style={styles.centerBtn}
                            onPress={() => setShowProfileModal(true)}
                        >
                            <Text style={styles.centerBtnText}>Create Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.centerBtn, styles.centerBtnGhost]}
                            onPress={() => router.push('/(tabs)/profile')}
                        >
                            <Text style={[styles.centerBtnText, styles.centerBtnGhostText]}>
                                Go to Profile tab
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Header */}
            {profile && (
                <>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Browse Bounties</Text>
                    </View>

                    {/* Results */}
                    <ScrollView style={styles.content}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={refreshBounties}
                                colors={['#3B82F6']} // Android spinner color
                            />
                        }
                    >
                        <View style={styles.resultsHeader}>
                            <Text style={styles.resultsText}>
                                {bounties.length} bounties found
                            </Text>
                            <TouchableOpacity style={styles.sortButton}>
                                <Filter size={16} color="#6B7280" />
                                <Text style={styles.sortText}>Sort</Text>
                            </TouchableOpacity>
                        </View>

                        {filteredBounties.map((bounty) => (
                            <BountyCard
                                key={bounty.id}
                                bounty={bounty}
                                onPress={() => handlePress(bounty)}
                                isLoading={isLoading}
                            />
                        ))}

                        {filteredBounties.length === 0 && (
                            <View style={styles.emptyState}>
                                <MapPin size={48} color="#D1D5DB" />
                                <Text style={styles.emptyTitle}>No bounties found</Text>
                                <Text style={styles.emptyDescription}>
                                    Try adjusting your search criteria or check back later
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </>
            )}
            <BountyDetailsModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                bounty={selectedBounty}
                isClaimed={!!(selectedBounty && claimedBounties[selectedBounty.id] !== undefined)}
                hasSubmitted={!!(selectedBounty && claimedBounties[selectedBounty.id])}
                claimedBounties={claimedBounties}
                onClaim={(bounty) => {
                    setClaimedBounties(prev => ({ ...prev, [bounty.id]: null }));
                    setModalVisible(false);
                }}
                onSubmit={(bounty, link) => {
                    setClaimedBounties(prev => ({ ...prev, [bounty.id]: link }));
                    setModalVisible(false);
                }}
                onAward={(bounty, hunterId) => {
                    setModalVisible(false);
                }}
            />
            <ProfileCreateModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />

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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        color: '#111827',
    },
    categoryScroll: {
        marginBottom: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    categoryButtonActive: {
        backgroundColor: '#3B82F6',
    },
    categoryButtonInactive: {
        backgroundColor: '#E5E7EB',
    },
    categoryButtonText: {
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    categoryButtonTextInactive: {
        color: '#374151',
    },
    statusContainer: {
        flexDirection: 'row',
    },
    statusButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,
    },
    statusButtonActive: {
        backgroundColor: '#DBEAFE',
        borderWidth: 1,
        borderColor: '#93C5FD',
    },
    statusButtonInactive: {
        backgroundColor: '#F3F4F6',
    },
    statusButtonText: {
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    statusButtonTextActive: {
        color: '#1D4ED8',
    },
    statusButtonTextInactive: {
        color: '#374151',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    resultsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    resultsText: {
        color: '#6B7280',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortText: {
        color: '#6B7280',
        marginLeft: 4,
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
    centerCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    centerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginTop: 16,
        textAlign: 'center',
    },
    centerText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
        lineHeight: 20,
    },
    centerButtons: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 240,
    },
    centerBtn: {
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    centerBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    centerBtnGhost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2563EB',
    },
    centerBtnGhostText: {
        color: '#2563EB',
    },
});