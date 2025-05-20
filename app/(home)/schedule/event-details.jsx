import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function EventDetailsScreen({ route }) {
  const { event } = route.params;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>{event.description}</Text>
      <Text style={styles.label}>Start:</Text>
      <Text style={styles.text}>{new Date(event.start).toLocaleString()}</Text>
      <Text style={styles.label}>End:</Text>
      <Text style={styles.text}>{new Date(event.end).toLocaleString()}</Text>
      {event.sessions && (
        <>
          <Text style={styles.label}>Sessions:</Text>
          {event.sessions.map((s, idx) => (
            <View key={idx} style={styles.sessionBox}>
              <Text style={styles.sessionTitle}>{s.title}</Text>
              <Text>Speaker: {s.speaker}</Text>
              <Text>Time: {new Date(s.start_time).toLocaleTimeString()} - {new Date(s.end_time).toLocaleTimeString()}</Text>
              <Text>{s.description}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#ac0808" },
  label: { fontWeight: "bold", marginTop: 10 },
  text: { marginBottom: 5 },
  sessionBox: { backgroundColor: "#f2f2f2", borderRadius: 8, padding: 10, marginVertical: 5 },
  sessionTitle: { fontWeight: "bold" },
});
