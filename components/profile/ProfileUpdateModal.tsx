import { useProfile } from '@/contexts/ProfileContext';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDeleteUserProfile, useEditUserProfile } from '../data/bonthun-data-access';
import { Input } from '../ui/Input';
import Toast from 'react-native-toast-message';



interface ProfileUpdateModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const ProfileUpdateModal = ({ isVisible, onClose }: ProfileUpdateModalProps) => {
    const [name, setName] = useState('');
    const { profile, setProfile, clearProfile, refreshProfile } = useProfile();
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const deleteClient = useDeleteUserProfile();
    const editClient = useEditUserProfile();
    const onDelete = async () => {
        setSubmitting(true);
        try {
            await deleteClient.mutateAsync();
            await refreshProfile();
            clearProfile();
            Toast.show({
                type: 'success',
                text1: 'User profile deleted successfully',
            });
            onClose();
        } catch (e: any) {
            console.error(e);
            Toast.show({
                type: 'error',
                text1: 'Error deleting profile',
                text2: e.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSave = async () => {
        setSubmitting(true);
        try {
            await editClient.mutateAsync({ username: name, email: email });
            await refreshProfile();
            Toast.show({
                type: 'success',
                text1: 'User profile edited successfully',
            });
            onClose();
        } catch (e: any) {
            console.error(e);
            Toast.show({
                type: 'error',
                text1: 'Error editing profile',
                text2: e.message,
            });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal visible={isVisible} animationType="slide" transparent={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Edit Profile</Text>

                    <Input
                        label="username"
                        value={name}
                        onChangeText={setName}
                        containerStyle={styles.input}
                    />
                    <Input
                        label="email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"   
                        containerStyle={styles.input}
                    />

                    <TouchableOpacity
                        style={[styles.button, submitting && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={submitting}
                    >
                        <Text style={styles.buttonText}>
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                        <Text style={styles.deleteButtonText}>Delete Profile</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'android' ? 32 : 60,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
    },
    deleteButton: {
        marginTop: 20,
        backgroundColor: '#EF4444',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ProfileUpdateModal;
