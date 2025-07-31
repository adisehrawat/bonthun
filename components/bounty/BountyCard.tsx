import { Clock, DollarSign, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bounty } from '../../types/bounty';
import { Avatar } from '../ui/Avatar';

interface BountyCardProps {
    bounty: Bounty;
    onPress: () => void;
    isLoading: boolean;
}


    const getTimeLeft = (timeLimit: number) => {
        const timeLeft = timeLimit - Date.now() / 1000;
        const days = Math.floor(timeLeft / (3600 * 24));
        const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
        if (days > 0) {
            return `${days}d left`;
        }
        return `${hours}h left`;
    };

export default function BountyCard({ bounty, onPress, isLoading }: BountyCardProps) {
    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{bounty.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {bounty.description}
                    </Text>
                </View>
                <View style={styles.rewardContainer}>
                    <View style={styles.rewardBadge}>
                        <DollarSign size={16} color="#059669" />
                        <Text style={styles.rewardText}>{bounty.reward/1000000000} SOL</Text>
                    </View>
                </View>
            </View>

            {/* Client Info */}
            <View style={styles.clientInfo}>
            <Avatar
                            source={bounty.client.avatar}
                            name={bounty.client.name}
                            size={30}
                        />
                <Text style={styles.clientName}>{bounty.client.name}</Text>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
                
                <View style={[styles.tag, { backgroundColor: bounty.status === 'open' ? '#D1FAE5' : bounty.status === 'claimed' ? '#DBEAFE' : '#F3F4F6' }]}>
                    <Text style={[styles.tagText, { color: bounty.status === 'open' ? '#059669' : bounty.status === 'claimed' ? '#1E40AF' : '#374151' }]}>
                        {bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.footerText}>{bounty.location}</Text>
                </View>
                <View style={styles.footerItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.footerText}>{getTimeLeft(bounty.timeLimit)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    description: {
        color: '#6B7280',
        fontSize: 14,
    },
    rewardContainer: {
        alignItems: 'flex-end',
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    rewardText: {
        color: '#059669',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    clientInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    clientName: {
        color: '#374151',
        fontWeight: '500',
        marginLeft: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
        marginLeft: 4,
    },
});