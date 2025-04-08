import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/MainNavigator'
import { AuthContext } from '../context/AuthContext'
import Icon from 'react-native-vector-icons/Ionicons'
import DatePicker from 'react-native-date-picker'
import { useContext, useEffect, useState } from 'react'
import backend from '../backend'
import { getAccessToken, refreshAccessToken } from '../utils/auth'
import { ClassGroupEntryProps } from '../components/ClassGroupEntry'

export default function GroupEditForm() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const route = useRoute()
  const { group } = route.params as { group: ClassGroupEntryProps }

  const { user } = useContext(AuthContext)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [location, setLocation] = useState('')
  const [maxStudents, setMaxStudents] = useState('10')
  const [isPrivate, setIsPrivate] = useState(false)
  const [formErrors, setFormErrors] = useState({
    title: '',
    location: '',
    maxStudents: ''
  })

  const validateForm = () => {
    let valid = true
    const errors = { title: '', location: '', maxStudents: '' }

    if (!title.trim()) {
      errors.title = 'Title is required'
      valid = false
    }

    if (!location.trim()) {
      errors.location = 'Location is required'
      valid = false
    }

    const studentsCount = parseInt(maxStudents)
    if (isNaN(studentsCount) || studentsCount < 2 || studentsCount > 10000) {
      errors.maxStudents = 'Enter a number between 2 and 10000'
      valid = false
    }

    setFormErrors(errors)
    return valid
  }

  const handleSubmit = async () => {
    // TODO
  }

  useEffect(() => {
    setTitle(group.title)
    setDate(new Date(group.timestamp))
    setLocation(group.location)
    setMaxStudents(group.maxStudents.toString())
    setIsPrivate(group.isPrivate)
  }, [group])


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.chatTitle}>Editing Group</Text>
            <Text style={styles.participantCount}>{group?.title}</Text>
          </View>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Group Title</Text>
            <TextInput
              style={[styles.input, formErrors.title ? styles.inputError : null]}
              placeholder="Enter a group title"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            {formErrors.title ? <Text style={styles.errorText}>{formErrors.title}</Text> : null}
            <Text style={styles.characterCount}>{title.length}/50</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meeting Time</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Icon name="calendar-outline" size={22} color="#007AFF" />
            </TouchableOpacity>

            {showDatePicker && <DatePicker
              modal
              open={showDatePicker}
              date={date}
              onConfirm={(date) => setDate(date)}
              onCancel={() => { }}
              mode={'datetime'}
            />}
          </View>

          {/* Location Text Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[styles.input, formErrors.location ? styles.inputError : null]}
              placeholder="Enter meeting location"
              value={location}
              onChangeText={setLocation}
              multiline={true}
              numberOfLines={2}
            />
            {formErrors.location ? <Text style={styles.errorText}>{formErrors.location}</Text> : null}
            <Text style={styles.inputHint}>Examples: Smith Hall Room 100, The Toaster, Zoom, etc.</Text>
          </View>

          {/* Max Students */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Maximum Students</Text>
            <TextInput
              style={[styles.input, formErrors.maxStudents ? styles.inputError : null]}
              placeholder="Enter max number of students (2-10000)"
              value={maxStudents}
              onChangeText={setMaxStudents}
              keyboardType="number-pad"
            />
            {formErrors.maxStudents ? <Text style={styles.errorText}>{formErrors.maxStudents}</Text> : null}
          </View>

          {/* Privacy Toggle */}
          <View style={styles.switchGroup}>
            <View>
              <Text style={styles.label}>Private Group</Text>
              <Text style={styles.switchDescription}>
                Private groups require approval to join
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#e5e5e5', true: '#b3d9ff' }}
              thumbColor={isPrivate ? '#007AFF' : '#f4f3f4'}
              ios_backgroundColor="#e5e5e5"
              onValueChange={setIsPrivate}
              value={isPrivate}
            />
          </View>
        </ScrollView>

        {/* Create Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleSubmit}
          >
            <Text style={styles.createButtonText}>Confirm Edit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  participantCount: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 46,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  inputHint: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#8e8e93',
    textAlign: 'right',
    marginTop: 4,
  },
  datePickerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  switchDescription: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 2,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
})