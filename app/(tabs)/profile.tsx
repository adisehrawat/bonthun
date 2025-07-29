import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Settings, CircleHelp as HelpCircle, LogOut, User, Wallet } from 'lucide-react-native';
import { mockUser } from '@/data/mockData';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCreateModal from '@/components/profile/ProfileCreateModal';
import AccountModal from '@/components/profile/account';
import ProfileUpdateModal from '@/components/profile/ProfileUpdateModal';
import { useWalletUi } from '@/components/solana/use-wallet-ui'

export default function Profile() {
    const [isHunter, setIsHunter] = useState(mockUser.role === 'hunter');
    const [showProfileModal, setShowProfileModal] = React.useState(false);
    const [isAccountModalVisible, setAccountModalVisible] = useState(false);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const { disconnect } = useWalletUi()

    const openModal = () => setAccountModalVisible(true);
    const closeModal = () => setAccountModalVisible(false);

    const openUModal = () => setUpdateModalVisible(true);
    const closeUModal = () => setUpdateModalVisible(false);

    const currentUser = {
        ...mockUser,
        role: isHunter ? 'hunter' : 'client',
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => {
                            setShowProfileModal(true);
                        }}>
                    <Text style={{ color: '#2563EB', fontWeight: '600' }}>Create Profile</Text>
                </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userCard}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
                    <Text style={styles.userName}>{currentUser.name}</Text>
                    <Text style={styles.userEmail}>{currentUser.email}</Text>

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
                            {isHunter ? currentUser.completedBounties : 5}
                        </Text>
                        <Text style={styles.statLabel}>
                            {isHunter ? 'Completed' : 'Posted'}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, styles.statValueGreen]}>
                            ${isHunter ? currentUser.totalEarned : currentUser.totalSpent}
                        </Text>
                        <Text style={styles.statLabel}>
                            {isHunter ? 'Earned' : 'Spent'}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, styles.statValueBlue]}>{currentUser.successRate}%</Text>
                        <Text style={styles.statLabel}>Success</Text>
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
        <ProfileCreateModal visible={showProfileModal} onClose={() => setShowProfileModal(false)} />
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
});