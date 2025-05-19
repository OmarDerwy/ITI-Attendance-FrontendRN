import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-gesture-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import axiosBackendInstance from "@/api/axios";
import { TimePickerModal } from "react-native-paper-dates";
import { COLORS, FONT_SIZES } from "../../constants/theme";
import CustomButton from "../../components/CustomButton";

const requestTypeOptions = [
  { label: "Day Excuse", value: "day_excuse" },
  { label: "Early Leave", value: "early_leave" },
  { label: "Late Check-in", value: "late_check_in" },
];

const requestTypeMap = {
  "day_excuse": "excuse",
  "early_leave": "early_leave",
  "late_check_in": "late_check_in",
};

export default function LeaveRequestScreen() {
  const queryClient = useQueryClient();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [requestType, setRequestType] = useState("day_excuse");
  const [reason, setReason] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Fetch upcoming records
  const { data: upcomingRecords, isLoading, error, refetch } = useQuery({
    queryKey: ["upcomingRecordsgt"],
    queryFn: async () => {
      const response = await axiosBackendInstance.get(`attendance/upcoming-records-gt/`);
      return response.data;
    },
    refetchOnMount: true,
    staleTime: 0,
  });

  // Submit leave request mutation
  const submitLeaveRequest = useMutation({
    mutationFn: async (formData) => {
      return await axiosBackendInstance.post(`attendance/permission-requests/`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["upcomingRecords"]);
      Alert.alert("Success", "Leave request submitted successfully");
      resetForm();
    },
    onError: (error) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to submit leave request");
    }
  });

  const resetForm = () => {
    setSelectedSchedule(null);
    setRequestType("day_excuse");
    setReason("");
    setSelectedTime(new Date());
  };

  const handleSubmit = () => {
    if (!selectedSchedule) {
      Alert.alert("Error", "Please select a schedule");
      return;
    }

    if (!reason) {
      Alert.alert("Error", "Please provide a reason");
      return;
    }

    const payload = {
      schedule: selectedSchedule.schedule.id,
      request_type: requestTypeMap[requestType],
      reason: reason,
    };

    // Add adjusted_time only for early_leave or late_check_in
    if (requestType !== "day_excuse") {
      const scheduleDate = dayjs(selectedSchedule.schedule.created_at);
      const timeString = dayjs(selectedTime).format("HH:mm:ss");
      const adjustedDateTime = dayjs(selectedSchedule.schedule.created_at)
        .set('hour', selectedTime.getHours())
        .set('minute', selectedTime.getMinutes())
        .set('second', 0)
        .toDate()
        .toISOString();
      payload.adjusted_time = adjustedDateTime;
    }

    submitLeaveRequest.mutate(payload);
  };

  const onDismissTimePicker = () => setShowTimePicker(false);
  const onConfirmTimePicker = ({ hours, minutes }) => {
    const newDate = new Date(selectedTime);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    setSelectedTime(newDate);
    setShowTimePicker(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ac0808" />
        <Text>Loading upcoming schedules...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading schedules: {error.message}</Text>
      </View>
    );
  }
  

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={async () => {await refetch()}} colors={[COLORS.red]} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Submit Leave Request</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Select Schedule:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSchedule?.id || ""}
            onValueChange={(itemValue) => {
              const selected = upcomingRecords.data.find(record => record.id === itemValue);
              setSelectedSchedule(selected);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select a schedule" value="" />
            {upcomingRecords?.data.map((record) => (
              <Picker.Item 
                key={record.id} 
                label={`${record.schedule.name} (${record.schedule.sessions.join(", ")})`} 
                value={record.id} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Request Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={requestType}
            onValueChange={(itemValue) => setRequestType(itemValue)}
            style={styles.picker}
          >
            {requestTypeOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Reason:</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={reason}
          onChangeText={setReason}
          placeholder="Please explain your reason for this leave request"
        />

        {requestType !== "day_excuse" && (
          <View>
            <Text style={styles.label}>Adjusted Time:</Text>
            <TouchableOpacity 
              style={styles.timeButton} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{dayjs(selectedTime).format("HH:mm")}</Text>
            </TouchableOpacity>
            <TimePickerModal
              visible={showTimePicker}
              onDismiss={onDismissTimePicker}
              onConfirm={onConfirmTimePicker}
              hours={selectedTime.getHours()}
              minutes={selectedTime.getMinutes()}
              label="Pick time"
              animationType="fade"
              locale="en"
            />
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <CustomButton
            text={"Submit Request"}
            color={COLORS.red}
            fontSize={FONT_SIZES.medium}
            buttonHandler={handleSubmit}
            disabled={submitLeaveRequest.isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: "#ac0808",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  timeButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#ac0808",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
