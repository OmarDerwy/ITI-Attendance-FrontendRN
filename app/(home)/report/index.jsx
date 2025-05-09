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
import axiosBackendInstance from '../../../api/axios'

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

  // const handleTimeChange = (event, selectedTime) => {
  //   setShowTimePicker(false); // Hide the time picker
  //   if (selectedTime) {
  //     setTime(selectedTime); // Update the time state
  //   }
  // };

  const handleSubmit = async () => {
    if (!name || !description || !place) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (status === "FOUND" && !image) {
      Alert.alert("Error", "Please upload an image for found items.");
      return;
    }

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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = cloudinaryResponse.data.secure_url; 
        console.log("Image uploaded to Cloudinary:", imageUrl);
      } catch (error) {
        Alert.alert("Error", "Failed to upload image to Cloudinary.");
        console.error("Cloudinary upload error:", error.response?.data || error.message);
        return;
      }
    }

    const payload = {
      name,
      description,
      place,
      time: time.toISOString(),
      status,
    };

    if (imageUrl) {
      payload.image = imageUrl;
    }

    const apiEndpoint =
      status === "FOUND"
        ? "lost-and-found/found-items/"
        : "lost-and-found/lost-items/";

    // console.log("API Endpoint:", apiEndpoint);
    try {
      const response = await axiosBackendInstance.post(apiEndpoint, payload);

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Item reported successfully!");
        setName("");
        setDescription("");
        setPlace("");
        setStatus("LOST");
        setImage(null);
      } else {
        Alert.alert("Error", `Failed to report the item: ${response.statusText}`);
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report Lost/Found Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Place"
        value={place}
        onChangeText={setPlace}
      />

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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: "#ac0808",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerText: {
    color: "white",
    fontWeight: "bold",
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