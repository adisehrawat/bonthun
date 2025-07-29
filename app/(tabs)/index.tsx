import BountyCard from '@/components/bounty/BountyCard';
import BountyDetailsModal from '@/components/bounty/BountyDetails';
import { mockBounties } from '@/data/mockData';
import { Filter, MapPin, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bounty } from '@/types/bounty';
export default function BrowseBounties() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('open');
    const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [claimedBounties, setClaimedBounties] = useState<{ [key: string]: string | null }>({});
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        // Simulate a refresh (you can replace this with real data fetch later)
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handlePress = (bounty: Bounty) => {
        setSelectedBounty(bounty);
        setModalVisible(true);
    };


    const categories = ['all', 'delivery', 'research', 'task', 'mystery', 'tech'];
    const statuses = ['open', 'claimed', 'completed'];

    const filteredBounties = mockBounties.filter((bounty) => {
        const matchesSearch =
            bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bounty.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || bounty.category === selectedCategory;

        const isClaimed = claimedBounties.hasOwnProperty(bounty.id);
        const matchesStatus =
            selectedStatus === 'open' ? !isClaimed :
                selectedStatus === 'claimed' ? isClaimed && !claimedBounties[bounty.id] :
                    selectedStatus === 'completed' ? isClaimed && !!claimedBounties[bounty.id] :
                        false;

        return matchesSearch && matchesCategory && matchesStatus;
    });


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Browse Bounties</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category ? styles.categoryButtonActive : styles.categoryButtonInactive
                            ]}
                        >
                            <Text style={[
                                styles.categoryButtonText,
                                selectedCategory === category ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
                            ]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Status Filter */}
                <View style={styles.statusContainer}>
                    {statuses.map((status) => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => setSelectedStatus(status)}
                            style={[
                                styles.statusButton,
                                selectedStatus === status ? styles.statusButtonActive : styles.statusButtonInactive
                            ]}
                        >
                            <Text style={[
                                styles.statusButtonText,
                                selectedStatus === status ? styles.statusButtonTextActive : styles.statusButtonTextInactive
                            ]}>
                                {status}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Results */}
            <ScrollView style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#3B82F6']} // Android spinner color
                    />
                }
            >
                <View style={styles.resultsHeader}>
                    <Text style={styles.resultsText}>
                        {filteredBounties.length} bounties found
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
            />
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
});