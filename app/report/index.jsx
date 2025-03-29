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
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

export default function ReportScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [status, setStatus] = useState("LOST"); // Default to "Lost"
  const [image, setImage] = useState(null);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleSubmit = async () => {
    if (!name || !description || !place) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (status === "FOUND" && !image) {
      Alert.alert("Error", "Please upload an image for found items.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("place", place);
    formData.append("status", status);
    if (image) {
      formData.append("image", {
        uri: image,
        name: "item-image.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const response = await fetch("https://your-backend-api.com/api/items/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Success", "Item reported successfully!");
        setName("");
        setDescription("");
        setPlace("");
        setStatus("LOST");
        setImage(null);
      } else {
        Alert.alert("Error", "Failed to report the item.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while reporting the item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Lost/Found Item</Text>

      {/* Name Field */}
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

      <View style={styles.dropdown}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Lost" value="LOST" />
          <Picker.Item label="Found" value="FOUND" />
        </Picker>
      </View>

      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imagePicker} onPress={takeImage}>
        <Text style={styles.imagePickerText}>Take an Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  dropdown: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
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
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
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