import AccountModal from '@/components/profile/account';
import ProfileCreateModal from '@/components/profile/ProfileCreateModal';
import ProfileUpdateModal from '@/components/profile/ProfileUpdateModal';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { Avatar } from '@/components/ui/Avatar';
import { useProfile } from '@/contexts/ProfileContext';
import { lamportsToSol } from '@/utils/lamports-to-sol';
import { CircleHelp as HelpCircle, LogOut, User, UserPlus, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { profile, isProfileLoaded, refreshProfile } = useProfile();
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [isAccountModalVisible, setAccountModalVisible] = useState(false);
    const { disconnect } = useWalletUi();
    const [isHunter, setIsHunter] = useState(true);

    const handleCreateModalClose = () => {
        setCreateModalVisible(false);
        refreshProfile();
    }

    if (!isProfileLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading profile...</Text>
            </View>
        );
    }
    
    const openModal = () => setAccountModalVisible(true);
    const closeModal = () => setAccountModalVisible(false);

    const openUModal = () => setUpdateModalVisible(true);
    const closeUModal = () => setUpdateModalVisible(false);

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerCard}>
                    <UserPlus size={48} color="#2563EB" />
                    <Text style={styles.centerTitle}>Create your profile first</Text>
                    <Text style={styles.centerText}>
                        You need a profile to see projects.
                    </Text>
                    <View style={styles.centerButtons}>
                        <TouchableOpacity
                            style={styles.centerBtn}
                            onPress={() => setCreateModalVisible(true)}
                        >
                            <Text style={styles.centerBtnText}>Create Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => disconnect()}>
                        <LogOut size={20} color="#EF4444" />
                        <Text style={[styles.menuItemText, styles.menuItemTextRed]}>Disconnect</Text>
                    </TouchableOpacity>
                <ProfileCreateModal
                    visible={isCreateModalVisible}
                    onClose={handleCreateModalClose}
                />
            </SafeAreaView>
        );
    }

    console.log('progile bounties completed', profile?.bounties_completed.toString());
    console.log('progile bounties completed as client', profile?.bounties_completed_as_client.toString());
    console.log('progile bounties rewarded', profile?.bounties_rewarded.toString());
    console.log('progile bounties posted', profile?.bounties_posted.toString());
    console.log('progile total sol earned', profile?.total_sol_earned.toString());
    console.log('progile total sol spent', profile?.total_sol_spent.toString());
    console.log('progile success rate', profile?.success_rate.toString());

    

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                {/* User Info */}
                <View style={styles.userCard}>
                    <View style={styles.userInfo}>
                        <Avatar
                            source={profile.avatar}
                            name={profile.username}
                            size={80}
                        />
                        <Text style={styles.userName}>{profile.username}</Text>
                        <Text style={styles.userEmail}>{profile.email}</Text>

                        {/* Role Toggle */}
                        <View style={styles.roleToggle}>
                            <TouchableOpacity
                                onPress={() => setIsHunter(true)}
                                style={[styles.roleButton, isHunter && styles.roleButtonActive]}
                            >
                                <Text style={[styles.roleButtonText, isHunter && styles.roleButtonTextActive]}>
                                    Hunter
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setIsHunter(false)}
                                style={[styles.roleButton, !isHunter && styles.roleButtonActive]}
                            >
                                <Text style={[styles.roleButtonText, !isHunter && styles.roleButtonTextActive]}>
                                    Client
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {isHunter ? profile.bounties_completed.toString() : profile.bounties_posted.toString()}
                            </Text>
                            <Text style={styles.statLabel}>
                                {isHunter ? 'Completed' : 'Posted'}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, styles.statValueGreen]}>
                                {isHunter ? lamportsToSol(profile.total_sol_earned.toNumber()) : lamportsToSol(profile.total_sol_spent.toNumber())} SOL
                            </Text>
                            <Text style={styles.statLabel}>
                                {isHunter ? 'Earned' : 'Spent'}
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, styles.statValueBlue]}>{isHunter ? profile.success_rate.toString() : profile.bounties_completed_as_client.toNumber()}</Text>
                            <Text style={styles.statLabel}>{isHunter ? 'Success' : 'Rewarded'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.menuCard}>
                    <TouchableOpacity style={styles.menuItem} onPress={openUModal}>
                        <User size={20} color="#6B7280" />
                        <Text style={styles.menuItemText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={openModal}>
                        <Wallet size={20} color="#6B7280" />
                        <Text style={styles.menuItemText}>Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
                        <HelpCircle size={20} color="#6B7280" />
                        <Text style={styles.menuItemText}>Help & Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => disconnect()}>
                        <LogOut size={20} color="#EF4444" />
                        <Text style={[styles.menuItemText, styles.menuItemTextRed]}>Disconnect</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>
            <AccountModal
                isVisible={isAccountModalVisible}
                onClose={closeModal}
            />
            <ProfileUpdateModal
                isVisible={isUpdateModalVisible}
                onClose={closeUModal}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#000',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    userCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        marginBottom: 16,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    userEmail: {
        color: '#6B7280',
    },
    roleToggle: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        padding: 4,
        marginTop: 16,
    },
    roleButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    roleButtonActive: {
        backgroundColor: '#3B82F6',
    },
    roleButtonText: {
        fontWeight: '500',
        color: '#6B7280',
    },
    roleButtonTextActive: {
        color: 'white',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    statValueGreen: {
        color: '#059669',
    },
    statValueBlue: {
        color: '#3B82F6',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        marginLeft: 4,
    },
    statLabel: {
        color: '#6B7280',
        fontSize: 14,
    },
    achievementsCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    achievementsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    achievementsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    achievementBadge: {
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    achievementBadgeBlue: {
        backgroundColor: '#EFF6FF',
    },
    achievementBadgeGreen: {
        backgroundColor: '#ECFDF5',
    },
    achievementText: {
        color: '#92400E',
        fontWeight: '500',
        marginLeft: 8,
    },
    achievementTextBlue: {
        color: '#1E40AF',
    },
    achievementTextGreen: {
        color: '#065F46',
    },
    menuCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    menuItemBorder: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    menuItemText: {
        color: '#111827',
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
    menuItemTextRed: {
        color: '#EF4444',
    },
    bottomSpacing: {
        height: 32,
    },
    editButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#EBF8FF',
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