import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EventDetailsScreen({ route }) {
  const { event } = route.params || {};
  if (!event) return <View style={styles.container}><Text>No event data.</Text></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.label}>Date: {event.event_date}</Text>
      <Text style={styles.label}>Mandatory: {event.is_mandatory ? "Yes" : "No"}</Text>
      <Text style={styles.label}>Audience: {event.audience_type}</Text>
      {event.sessions && event.sessions.map((s, i) => (
        <View key={i} style={styles.session}>
          <Text style={styles.sessionTitle}>{s.title}</Text>
          <Text>Speaker: {s.speaker}</Text>
          <Text>Start: {s.start_time}</Text>
          <Text>End: {s.end_time}</Text>
          <Text>{s.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 10 },
  label: { fontSize: 14, marginBottom: 5 },
  session: { marginTop: 15, padding: 10, backgroundColor: "#f2f2f2", borderRadius: 8 },
  sessionTitle: { fontWeight: "bold", marginBottom: 3 },
});
