import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { COLORS, FONT_SIZES } from '../../constants/theme';

export default function GuestEventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
    //   try {
    //     const response = await axios.get('/api/guest/events/');
    //     setEvents(response.data);
    //   } catch (error) {
    //     Alert.alert('Error', 'Failed to load events.');
    //   } finally {
    //     setLoading(false);
    //   }
    };
    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    // You can navigate to a registration page or call an API here
    Alert.alert('Registered', `You have registered for ${event.name}`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventName}>{item.name}</Text>
      <Text style={styles.eventDate}>{item.date ? new Date(item.date).toLocaleString() : 'No date'}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <CustomButton
        text="Register"
        color={COLORS.red}
        fontSize={FONT_SIZES.medium}
        buttonHandler={() => handleRegister(item)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>No upcoming events found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 32,
  },
  eventCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    marginBottom: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
