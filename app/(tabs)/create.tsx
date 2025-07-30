import { useCreateBounty } from '@/components/data/bonthun-data-access';
import { BN } from '@coral-xyz/anchor';
import { Clock, DollarSign, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function parseTimeLimit(input: string): number {
    const regex = /(\d+)\s*(second|minute|hour|day|week)s?/i;
    const match = input.match(regex);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    const multipliers: Record<string, number> = {
        second: 1,
        minute: 60,
        hour: 3600,
        day: 86400,
        week: 604800,
    };

    return Math.floor(Date.now() / 1000) + value * (multipliers[unit] || 0);
}


export default function CreateBounty() {
    const createBounty = useCreateBounty();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reward: '',
        location: '',
        timeLimit: '',
    });


    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.reward || !formData.timeLimit) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }
        const parsedReward = Number(formData.reward);
        if (isNaN(parsedReward) || parsedReward <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid reward in lamports.");
            return;
        }

        const parsedTime = parseTimeLimit(formData.timeLimit);
        if (parsedTime <= Math.floor(Date.now() / 1000)) {
            Alert.alert("Invalid Input", "Please enter a valid future time limit (e.g., '3 days').");
            return;
        }

        try {

            await createBounty.mutateAsync({
                title: formData.title,
                description: formData.description,
                reward: new BN(parsedReward),
                location: formData.location,
                time_limit: new BN(parsedTime),
            });
            Alert.alert(
                'Success',
                'Your bounty has been created and posted!',
                [{
                    text: 'OK', onPress: () => {
                        setFormData({
                            title: '',
                            description: '',
                            reward: '',
                            location: '',
                            timeLimit: '',
                        });
                    }
                }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Create New Bounty</Text>
                    <Text style={styles.headerSubtitle}>Post a bounty for hunters to complete</Text>
                </View>

                <View style={styles.form}>
                    {/* Title */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Title *</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter bounty title..."
                            value={formData.title}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Description *</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="Describe what needs to be done..."
                            value={formData.description}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Reward */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Reward *</Text>
                        <View style={styles.inputWithIcon}>
                            <DollarSign size={20} color="#6B7280" />
                            <TextInput
                                style={styles.inputWithIconText}
                                placeholder="0"
                                value={formData.reward}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, reward: text }))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Location</Text>
                        <View style={styles.inputWithIcon}>
                            <MapPin size={20} color="#6B7280" />
                            <TextInput
                                style={styles.inputWithIconText}
                                placeholder="Enter location or 'Remote'"
                                value={formData.location}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                            />
                        </View>
                    </View>

                    {/* Time Limit */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Time Limit</Text>
                        <View style={styles.inputWithIcon}>
                            <Clock size={20} color="#6B7280" />
                            <TextInput
                                style={styles.inputWithIconText}
                                placeholder="e.g., 3 days, 1 week"
                                value={formData.timeLimit}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, timeLimit: text }))}
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={createBounty.isPending}>
                        <Text style={styles.submitButtonText}>{createBounty.isPending ? 'Creating...' : 'Post Bounty'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    },
    headerSubtitle: {
        color: '#6B7280',
        marginTop: 4,
    },
    form: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    fieldContainer: {
        marginBottom: 24,
    },
    fieldLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#111827',
    },
    textArea: {
        height: 100,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputWithIconText: {
        flex: 1,
        marginLeft: 8,
        color: '#111827',
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    optionButtonActive: {
        backgroundColor: '#3B82F6',
    },
    optionButtonInactive: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    optionButtonText: {
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    optionButtonTextActive: {
        color: 'white',
    },
    optionButtonTextInactive: {
        color: '#374151',
    },
    difficultyButtonActive: {
        backgroundColor: '#7C3AED',
    },
    difficultyButtonTextActive: {
        color: 'white',
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requirementInput: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 8,
        color: '#111827',
    },
    removeButton: {
        backgroundColor: '#FEE2E2',
        padding: 8,
        borderRadius: 8,
    },
    removeButtonText: {
        color: '#DC2626',
        fontWeight: '500',
    },
    addRequirementButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    addRequirementText: {
        color: '#6B7280',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 32,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});