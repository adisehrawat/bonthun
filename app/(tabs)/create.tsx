import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { DollarSign, MapPin, Clock, FileText } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function CreateBounty() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    category: 'delivery',
    difficulty: 'easy',
    location: '',
    timeLimit: '',
  });

  const categories = ['delivery', 'research', 'task', 'mystery', 'tech'];
  const difficulties = ['easy', 'medium', 'hard', 'expert'];


  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.reward) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert(
      'Success',
      'Your bounty has been created and posted!',
      [{ text: 'OK', onPress: () => {
        setFormData({
          title: '',
          description: '',
          reward: '',
          category: 'delivery',
          difficulty: 'easy',
          location: '',
          timeLimit: '',
        });
      }}]
    );
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

          {/* Category */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setFormData(prev => ({ ...prev, category }))}
                  style={[
                    styles.optionButton,
                    formData.category === category ? styles.optionButtonActive : styles.optionButtonInactive
                  ]}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.category === category ? styles.optionButtonTextActive : styles.optionButtonTextInactive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Difficulty */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Difficulty</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  onPress={() => setFormData(prev => ({ ...prev, difficulty }))}
                  style={[
                    styles.optionButton,
                    formData.difficulty === difficulty ? styles.difficultyButtonActive : styles.optionButtonInactive
                  ]}
                >
                  <Text style={[
                    styles.optionButtonText,
                    formData.difficulty === difficulty ? styles.difficultyButtonTextActive : styles.optionButtonTextInactive
                  ]}>
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Post Bounty</Text>
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