import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions, Modal, Alert, TouchableOpacity } from 'react-native'
import CustomButton from '../components/CustomButton'
import { COLORS, FONT_SIZES } from '../constants/theme'
import { useRouter } from 'expo-router'
import axiosBackendInstance from '../../api/axios'
import { useLocalSearchParams } from 'expo-router'
import { DatePickerModal } from 'react-native-paper-dates'
import { Provider as PaperProvider } from 'react-native-paper'

const { width } = Dimensions.get('window')

export default function SignUpDetails() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [dob, setDob] = useState('')
  const [graduationDate, setGraduationDate] = useState('')
  const [major, setMajor] = useState('')
  const [gpa, setGpa] = useState('')
  const [university, setUniversity] = useState('')
  const [dobPickerVisible, setDobPickerVisible] = useState(false)
  const [graduationPickerVisible, setGraduationPickerVisible] = useState(false)

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().slice(0, 10)
  }

  const onSubmit = async () => {
    if (!dob || !graduationDate || !major || !gpa || !university) {
      Alert.alert('Missing fields', 'Please fill in all fields.')
      return
    }
    try {
      // Combine params from previous screen with new details
      const payload = {
        email: params.email,
        first_name: params.first_name,
        last_name: params.last_name,
        phone_number: params.phone,
        date_of_birth: dob,
        gradyear: graduationDate,
        college_name: major,
        degree: gpa,
        university_name: university,
      }
      await axiosBackendInstance.post('accounts/guests/', payload)
      Alert.alert('Registration Complete', 'Thank you for registering!')
      router.replace('/(home)/')
    } catch (error) {
      console.error('Registration error:', error)
      Alert.alert('Registration failed', 'Please check your details and try again.')
    }
  }

  return (
    <PaperProvider>
      <View style={styles.page}>
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.modalView}>
            <Text style={styles.title}>Complete Your Registration</Text>
            <TextInput
              style={styles.input}
              value={university}
              placeholder="University Name"
              onChangeText={setUniversity}
            />
            {/* Date of Birth Picker */}
            <TouchableOpacity onPress={() => setDobPickerVisible(true)} style={styles.input}>
              <Text style={{ color: dob ? 'black' : '#888' }}>{dob ? formatDate(dob) : 'Date of Birth (YYYY-MM-DD)'}</Text>
            </TouchableOpacity>
            <DatePickerModal
              locale="en"
              mode="single"
              visible={dobPickerVisible}
              onDismiss={() => setDobPickerVisible(false)}
              date={dob ? new Date(dob) : undefined}
              onConfirm={({ date }) => {
                setDob(formatDate(date))
                setDobPickerVisible(false)
              }}
            />
            {/* Graduation Date Picker */}
            <TouchableOpacity onPress={() => setGraduationPickerVisible(true)} style={styles.input}>
              <Text style={{ color: graduationDate ? 'black' : '#888' }}>{graduationDate ? formatDate(graduationDate) : 'Date of Graduation (YYYY-MM-DD)'}</Text>
            </TouchableOpacity>
            <DatePickerModal
              locale="en"
              mode="single"
              visible={graduationPickerVisible}
              onDismiss={() => setGraduationPickerVisible(false)}
              date={graduationDate ? new Date(graduationDate) : undefined}
              onConfirm={({ date }) => {
                setGraduationDate(formatDate(date))
                setGraduationPickerVisible(false)
              }}
            />
            {/* <TextInput
              style={styles.input}
              value={dob}
              placeholder="Date of Birth (YYYY-MM-DD)"
              onChangeText={setDob}
            />
            <TextInput
              style={styles.input}
              value={graduationDate}
              placeholder="Date of Graduation (YYYY-MM-DD)"
              onChangeText={setGraduationDate}
            /> */}
            <TextInput
              style={styles.input}
              value={major}
              placeholder="Major"
              onChangeText={setMajor}
            />
            <TextInput
              style={styles.input}
              value={gpa}
              placeholder="GPA"
              keyboardType="decimal-pad"
              onChangeText={setGpa}
            />
            <View style={styles.button}>
              <CustomButton text="Submit" color={COLORS.red} fontSize={FONT_SIZES.medium} buttonHandler={onSubmit} />
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    height: '70%',
    width: width,
    backgroundColor: '#dddddd',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '80%',
  },
})
