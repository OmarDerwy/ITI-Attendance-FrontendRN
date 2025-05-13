import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Dimensions, Modal, Alert } from 'react-native'
import CustomButton from '../components/CustomButton'
import { COLORS, FONT_SIZES } from '../constants/theme'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function SignUpDetails() {
  const router = useRouter()
  const [dob, setDob] = useState('')
  const [graduationDate, setGraduationDate] = useState('')
  const [major, setMajor] = useState('')
  const [gpa, setGpa] = useState('')
  const [city, setCity] = useState('')

  const onSubmit = () => {
    if (!dob || !graduationDate || !major || !gpa || !city) {
      Alert.alert('Missing fields', 'Please fill in all fields.')
      return
    }
    // Here you would send the data to your backend
    Alert.alert('Registration Complete', 'Thank you for registering!')
    router.replace('/(home)/')
  }

  return (
    <View style={styles.page}>
      <Modal visible={true} transparent={true} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.title}>Complete Your Registration</Text>
          <TextInput
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
          />
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
          <TextInput
            style={styles.input}
            value={city}
            placeholder="City of Residency"
            onChangeText={setCity}
          />
          <View style={styles.button}>
            <CustomButton text="Submit" color={COLORS.red} fontSize={FONT_SIZES.medium} buttonHandler={onSubmit} />
          </View>
        </View>
      </Modal>
    </View>
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
