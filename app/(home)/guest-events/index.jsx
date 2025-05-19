import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { COLORS, FONT_SIZES } from '../../constants/theme';
import { RefreshControl } from 'react-native-gesture-handler';

export default function GuestEventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Mock data for development/demo
    const mockEvents = [
      {
        id: 1,
        name: 'Welcome Mixer',
        description: 'Meet other guests and enjoy refreshments.',
        date: '2025-06-01T18:00:00Z',
      },
      {
        id: 2,
        name: 'Tech Talk: The Future of AI',
        description: 'A talk on AI trends and applications.',
        date: '2025-06-05T14:00:00Z',
      },
      {
        id: 3,
        name: 'Community Picnic',
        description: 'Join us for food, games, and fun in the park.',
        date: '2025-06-10T12:00:00Z',
      },
    ];
    setEvents(mockEvents);
    setLoading(false);
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              // Simulate a network request
              setTimeout(() => {
                setRefreshing(false);
              }, 2000);
            }}
            colors={[COLORS.red]}
          />
        }
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
