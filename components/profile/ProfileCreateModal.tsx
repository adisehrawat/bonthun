import { useProfile } from '@/contexts/ProfileContext';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCreateUserProfile } from '../data/bonthun-data-access';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import Toast from 'react-native-toast-message';



interface ProfileCreateModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileCreateModal: React.FC<ProfileCreateModalProps> = ({ visible, onClose }) => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { refreshProfile } = useProfile();
  const createUserProfile = useCreateUserProfile();

  useEffect(() => {
    if (!visible) {
      setSubmitting(false);
      setUserName('');
      setEmail('');
      setError(null);
    }
  }, [visible]);

  const handleSubmit = async () => {
    setError(null);

    if (!username.trim() || !email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
    setSubmitting(true);
    try {
        console.log('[ProfileCreateModal] Creating user profile');
        await createUserProfile.mutateAsync({username,email});
        await refreshProfile();
        setSubmitting(false);
        Toast.show({
            type: 'success',
            text1: 'User profile created successfully',
        });
        onClose();
    }
    catch (err: any){
        setError(err?.message || 'Failed to create profile.');
        setSubmitting(false);
        Toast.show({
            type: 'error',
            text1: 'Error creating profile',
            text2: err.message,
        });
    }
    
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create Your Profile</Text>
              <Input
                label="Name"
                value={username}
                onChangeText={setUserName}
                placeholder="Enter your name"
                required
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                required
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <Button
                title={submitting ? 'Saving...' : 'Create Profile'}
                onPress={handleSubmit}
                disabled={submitting}
                loading={submitting}
                style={styles.button}
              />
              <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={submitting}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 24,
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  userTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  userTypeButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  userTypeButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  userTypeButtonTextActive: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    width: '100%',
  },
  cancelButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 24,
  },
});

export default ProfileCreateModal;