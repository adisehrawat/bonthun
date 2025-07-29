import { Clock, DollarSign, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bounty } from '../../types/bounty';

interface BountyCardProps {
    bounty: Bounty;
    onPress: () => void;
}

const categoryColors = {
    delivery: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
    research: { backgroundColor: '#F3E8FF', color: '#7C3AED' },
    task: { backgroundColor: '#D1FAE5', color: '#059669' },
    mystery: { backgroundColor: '#FED7AA', color: '#EA580C' },
    tech: { backgroundColor: '#FEE2E2', color: '#DC2626' },
};

const difficultyColors = {
    easy: { backgroundColor: '#D1FAE5', color: '#059669' },
    medium: { backgroundColor: '#FEF3C7', color: '#D97706' },
    hard: { backgroundColor: '#FEE2E2', color: '#DC2626' },
    expert: { backgroundColor: '#F3E8FF', color: '#7C3AED' },
};

const statusColors = {
    open: { backgroundColor: '#D1FAE5', color: '#059669' },
    claimed: { backgroundColor: '#DBEAFE', color: '#1E40AF' },
    completed: { backgroundColor: '#F3F4F6', color: '#374151' },
    verified: { backgroundColor: '#F3E8FF', color: '#7C3AED' },
};

export default function BountyCard({ bounty, onPress }: BountyCardProps) {
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
                        <Text style={styles.rewardText}>${bounty.reward}</Text>
                    </View>
                </View>
            </View>

            {/* Client Info */}
            <View style={styles.clientInfo}>
                <Image source={{ uri: bounty.clientAvatar }} style={styles.avatar} />
                <Text style={styles.clientName}>{bounty.clientName}</Text>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
                <View style={[styles.tag, categoryColors[bounty.category]]}>
                    <Text style={[styles.tagText, { color: categoryColors[bounty.category].color }]}>
                        {bounty.category}
                    </Text>
                </View>
                <View style={[styles.tag, difficultyColors[bounty.difficulty]]}>
                    <Text style={[styles.tagText, { color: difficultyColors[bounty.difficulty].color }]}>
                        {bounty.difficulty}
                    </Text>
                </View>
                <View style={[styles.tag, statusColors[bounty.status]]}>
                    <Text style={[styles.tagText, { color: statusColors[bounty.status].color }]}>
                        {bounty.status}
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
                    <Text style={styles.footerText}>{bounty.timeLimit}</Text>
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