import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { COLORS, FONT_SIZES } from '../../constants/theme';
import { RefreshControl } from 'react-native-gesture-handler';
import axiosBackendInstance from '@/api/axios';

export default function GuestEventsScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosBackendInstance.get('attendance/events/events-for-registration/');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRegister = async (event) => {
    setRegisteringId(event.id);
    try {
      await axiosBackendInstance.post(`attendance/events/${event.id}/register/`);
      Alert.alert('Registered', `You have registered for ${event.title}`);
      await fetchEvents();
    } catch (err) {
      Alert.alert('Error', 'Failed to register for this event.');
    } finally {
      setRegisteringId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventName}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.event_date ? new Date(item.event_date).toLocaleString() : 'No date'}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <TouchableOpacity
        style={{ opacity: registeringId === item.id ? 0.7 : 1 }}
        onPress={() => handleRegister(item)}
        disabled={registeringId === item.id}
      >
        {registeringId === item.id ? (
          <ActivityIndicator color={COLORS.red} />
        ) : (
          <CustomButton
            text="Register"
            color={COLORS.red}
            fontSize={FONT_SIZES.medium}
            buttonHandler={() => handleRegister(item)}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: COLORS.red }}>{error}</Text>
        <CustomButton text="Retry" color={COLORS.red} buttonHandler={fetchEvents} />
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
              fetchEvents();
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
