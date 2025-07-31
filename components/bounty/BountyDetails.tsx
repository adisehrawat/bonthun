import { PublicKey } from '@solana/web3.js';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Bounty } from '../../types/bounty';
import { ellipsify } from '../../utils/ellipsify';
import { PDA } from '../data/bonthun-data-access';
import { useAuthorization } from '../solana/use-authorization';
import { Avatar } from '../ui/Avatar';

interface BountyDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    bounty: Bounty | null;
    onClaim: (bounty: Bounty) => void;
    isClaimed: boolean;
    onSubmit: (bounty: Bounty, githubLink: string) => void;
    hasSubmitted: boolean;
    claimedBounties: Record<string, string | null>;
    isMyPost?: boolean;
    onAward: (bounty: Bounty, hunterId: string) => void;
}

export default function BountyDetailsModal({ visible,
    onClose,
    bounty,
    isClaimed,
    onClaim,
    onSubmit,
    hasSubmitted,
        isMyPost,
    onAward,
    claimedBounties, }: BountyDetailsModalProps) {
        const { selectedAccount } = useAuthorization();
    const [githubLink, setGithubLink] = useState('');
    if (!bounty) return null;

    const getTimeLeft = (timeLimit: number) => {
        const timeLeft = timeLimit - Date.now() / 1000;
        const days = Math.floor(timeLeft / (3600 * 24));
        const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
        if (days > 0) {
            return `${days}d left`;
        }
        return `${hours}h left`;
    };

        const submissions = [
        { id: '1', hunter: 'Hunter 1', link: 'https://github.com/hunter1/submission' },
        { id: '2', hunter: 'Hunter 2', link: 'https://github.com/hunter2/submission' },
    ];

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
                        <Text style={styles.rewardText}>Reward: {bounty.reward/1000000000} SOL</Text>
                    </View>

                    {/* Client */}
                    <View style={styles.client}>
                        <Avatar
                            source={bounty.client.avatar}
                            name={bounty.client.name}
                            size={30}
                        />
                        <Text style={styles.clientName}>{bounty.client.name}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Client ID:</Text>
                        <Text style={styles.metaValue}>{ellipsify(PDA.userProfile(new PublicKey(bounty.client.id)).toString())}</Text>
                    </View>


                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Status:</Text>
                        <Text style={styles.metaValue}>{bounty.status.charAt(0).toUpperCase() + bounty.status.slice(1)}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Location:</Text>
                        <Text style={styles.metaValue}>{bounty.location}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Time Limit:</Text>
                        <Text style={styles.metaValue}>{getTimeLeft(bounty.timeLimit)}</Text>
                    </View>

                    {isMyPost && (
                        <View style={styles.submissionsContainer}>
                            <Text style={styles.submissionsTitle}>Submissions</Text>
                            {submissions.map(submission => (
                                <View key={submission.id} style={styles.submissionCard}>
                                    <Text style={styles.submissionHunter}>{submission.hunter}</Text>
                                    <Text style={styles.submissionLink}>{submission.link}</Text>
                                    <TouchableOpacity style={styles.awardButton} onPress={() => onAward(bounty, submission.id)}>
                                        <Text style={styles.awardButtonText}>Award Bounty</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
                {!isClaimed && bounty.client.id !== selectedAccount?.publicKey.toString() && (
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
    clientName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginLeft: 8,
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
    submissionsContainer: {
        marginTop: 20,
    },
    submissionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    submissionCard: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    submissionHunter: {
        fontWeight: 'bold',
    },
    submissionLink: {
        color: '#3B82F6',
        marginVertical: 5,
    },
    awardButton: {
        backgroundColor: '#10B981',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    awardButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});
