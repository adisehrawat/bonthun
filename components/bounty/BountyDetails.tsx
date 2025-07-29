import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { Bounty } from '../../types/bounty';
import { ColorProperties } from 'react-native-reanimated/lib/typescript/Colors';

interface BountyDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    bounty: Bounty | null;
    onClaim: (bounty: Bounty) => void;
    isClaimed: boolean;
    onSubmit: (bounty: Bounty, githubLink: string) => void;
    hasSubmitted: boolean;
    claimedBounties: Record<string, string | null>;
}

export default function BountyDetailsModal({ visible,
    onClose,
    bounty,
    isClaimed,
    onClaim,
    onSubmit,
    hasSubmitted,
    claimedBounties, }: BountyDetailsModalProps) {
    const [githubLink, setGithubLink] = useState('');
    if (!bounty) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Bounty Details</Text>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Title */}
                    <Text style={styles.title}>{bounty.title}</Text>
                    <Text style={styles.description}>{bounty.description}</Text>

                    {/* Reward */}
                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardText}>Reward: ${bounty.reward}</Text>
                    </View>

                    {/* Client */}
                    <View style={styles.client}>
                        <Image source={{ uri: bounty.clientAvatar }} style={styles.avatar} />
                        <Text style={styles.clientName}>{bounty.clientName}</Text>
                    </View>

                    {/* Tags */}
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Category:</Text>
                        <Text style={styles.metaValue}>{bounty.category}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Difficulty:</Text>
                        <Text style={styles.metaValue}>{bounty.difficulty}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Status:</Text>
                        <Text style={styles.metaValue}>{bounty.status}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Location:</Text>
                        <Text style={styles.metaValue}>{bounty.location}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Time Limit:</Text>
                        <Text style={styles.metaValue}>{bounty.timeLimit}</Text>
                    </View>
                </ScrollView>
                {!isClaimed && (
                    <TouchableOpacity style={styles.claimButton} onPress={() => onClaim(bounty)}>
                        <Text style={styles.claimButtonText}>Claim Bounty</Text>
                    </TouchableOpacity>
                )}
                {isClaimed && !hasSubmitted && (
                    <>
                        <TextInput
                            placeholder="Enter GitHub submission link"
                            value={githubLink}
                            onChangeText={setGithubLink}
                        />
                        <TouchableOpacity onPress={() => onSubmit(bounty, githubLink)}>
                            <Text style={styles.claimButtonText}>Submit Work</Text>
                        </TouchableOpacity>
                    </>
                )}
                {isClaimed && hasSubmitted && (
                    <Text>
                        Submitted: {claimedBounties[bounty.id]}
                    </Text>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        paddingTop: 40,
        paddingBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 16,
    },
    rewardContainer: {
        backgroundColor: '#ECFDF5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    rewardText: {
        color: '#059669',
        fontWeight: '600',
        fontSize: 16,
    },
    client: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    metaLabel: {
        fontWeight: '600',
        color: '#6B7280',
    },
    metaValue: {
        color: '#111827',
    },
    claimButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 20,
    },
    claimButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
