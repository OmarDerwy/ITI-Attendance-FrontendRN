import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosBackendInstance from '../../../api/axios'
import CustomButton from "../../components/CustomButton";
import { COLORS } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function ReportScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState("LOST");
  const [image, setImage] = useState(null);
  const [time, setTime] = useState(new Date()); 
  const [showTimePicker, setShowTimePicker] = useState(false); 
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const statusOptions = ["LOST", "FOUND"];
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted" || cameraStatus.status !== "granted") {
        Alert.alert("Error", "Permission to access media library and camera is required.");
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takeImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const reportMutation = useMutation({
    mutationFn: async ({ name, description, place, status, time, image }) => {
      let imageUrl = null;
      if (image) {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_NAME}/upload`;
        const formData = new FormData();
        formData.append("file", {
          uri: image,
          type: "image/jpeg",
          name: "item-image.jpg",
        });
        formData.append("upload_preset", process.env.EXPO_PUBLIC_CLOUDINARY_PRESET);
        formData.append("cloud_name", process.env.EXPO_PUBLIC_CLOUDINARY_NAME);
        try {
          const cloudinaryResponse = await axios.post(cloudinaryUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imageUrl = cloudinaryResponse.data.secure_url;
        } catch (error) {
          throw new Error("Failed to upload image to Cloudinary.");
        }
      }
      const payload = {
        name,
        description,
        place,
        time: time.toISOString(),
        status,
      };
      if (imageUrl) payload.image = imageUrl;
      const apiEndpoint = status === "FOUND"
        ? "lost-and-found/found-items/"
        : "lost-and-found/lost-items/";
      const response = await axiosBackendInstance.post(apiEndpoint, payload);
      return response;
    },
    onSuccess: (response) => {
      Alert.alert("Success", "Item reported successfully!");
      setName("");
      setDescription("");
      setPlace("");
      setStatus("LOST");
      setImage(null);
      // Optionally invalidate or refetch queries here
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "An error occurred");
    },
  });

  const handleSubmit = () => {
    if (!name || !description || !place) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (description.length < 30) {
      Alert.alert("Error", "Description must be at least 30 characters long.");
      return;
    }
    if (status === "FOUND" && !image) {
      Alert.alert("Error", "Please upload an image for found items.");
      return;
    }
    reportMutation.mutate({ name, description, place, status, time, image });
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Report Lost/Found Item</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput style={styles.label}>Item Name</TextInput>
        <TextInput
          style={styles.input}
          placeholder="(ex: mobile phone)"
          value={name}
          onChangeText={setName}
        />
        <TextInput style={styles.label}>Item Description</TextInput>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="(ex: Black Samsung Galaxy S22 Ultra 256 Gigabyte)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput style={styles.label}>Item Place</TextInput>
        <TextInput
          style={styles.input}
          placeholder="Where was the item lost/found? (e.g. Library, 2nd floor)"
          value={place}
          onChangeText={setPlace}
        />
        <TextInput style={styles.label}>Report Type</TextInput>
        {/* Custom Dropdown */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>{status}</Text>
        </TouchableOpacity>
        <Modal
          visible={dropdownVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={statusOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setStatus(item);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        </TouchableOpacity>
        {status === "FOUND" && (
          <TouchableOpacity style={styles.imagePicker} onPress={takeImage}>
            <Text style={styles.imagePickerText}>Take an Image</Text>
          </TouchableOpacity>
        )}
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeIcon} onPress={handleRemoveImage}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        <CustomButton text="Submit Report" buttonHandler={handleSubmit} disabled={reportMutation.isPending} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fAfAfA",
  },
  header: {
    paddingTop: 20,
    backgroundColor: "#ac0808",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalItemText: {
    fontSize: 16,
    color: "black",
  },
  timePickerButton: {
    backgroundColor: "#ac0808",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  timePickerText: {
    color: "white",
    fontWeight: "bold",
  },
  imagePicker: {
    backgroundColor: COLORS.red,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "white",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  removeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 15,
    padding: 2,
  },
  submitButton: {
    backgroundColor: "#ac0808",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});