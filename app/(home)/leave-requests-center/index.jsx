import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import axiosBackendInstance from "../../../api/axios";
import { useAuthStore } from "@/store/index";
import { COLORS } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function LeaveRequestsCenter() {
  const { role } = useAuthStore((state) => state);
  const [requests, setRequests] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Only allow supervisor
  if (role !== "supervisor") {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Access denied. Supervisor only.</Text>
      </View>
    );
  }

  // Initial fetch and refresh
  const fetchRequests = useCallback(async (url = "attendance/permission-requests") => {
    try {
      setError(null);
      const res = await axiosBackendInstance.get(url);
      setRequests(res.data.results);
      setNextUrl(res.data.next);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Pagination fetch
  const fetchMore = async () => {
    if (!nextUrl || fetchingMore) return;
    setFetchingMore(true);
    try {
      // If nextUrl is absolute, use it as is, else append to base
      const url = nextUrl.startsWith("http") ? nextUrl : nextUrl.replace(/^\/+/, "");
      const res = await axiosBackendInstance.get(url);
      setRequests((prev) => [...prev, ...res.data.results]);
      setNextUrl(res.data.next);
    } catch (err) {
      setError(err);
    } finally {
      setFetchingMore(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
  };

  // Approve/Reject logic
  const handleAction = async (id, action) => {
    try {
      await axiosBackendInstance.post(`attendance/permission-requests/${id}/${action}/`);
      setRequests((prev) => prev.filter((req) => req.id !== id));
      Alert.alert("Success", `Request ${action === "approve" ? "approved" : "rejected"}.`);
    } catch (err) {
      Alert.alert("Error", `Failed to ${action} request.`);
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.red} />
        <Text>Loading pending leave requests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading requests: {error.message}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.studentName}>
        {item.student.first_name} {item.student.last_name}
      </Text>
      <Text style={styles.label}>Phone: <Text style={styles.value}>{item.student.phone_number}</Text></Text>
      <Text style={styles.label}>Schedule: <Text style={styles.value}>{item.schedule.name}</Text></Text>
      <Text style={styles.label}>Track: <Text style={styles.value}>{item.schedule.track.name}</Text></Text>
      <Text style={styles.label}>Session(s): <Text style={styles.value}>{item.schedule.sessions.join(", ")}</Text></Text>
      <Text style={styles.label}>Request Type: <Text style={styles.value}>{item.request_type.replace(/_/g, " ")}</Text></Text>
      <Text style={styles.label}>Reason: <Text style={styles.value}>{item.reason}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}>{item.status}</Text></Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleAction(item.id, "approve")}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleAction(item.id, "reject")}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leave Requests Center</Text>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        onEndReached={() => {
          if (nextUrl) fetchMore();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={fetchingMore ? <ActivityIndicator size="small" color={COLORS.red} /> : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.red]} />
        }
        ListEmptyComponent={<View style={styles.centered}><Text>No pending leave requests.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.red,
    textAlign: "center",
    marginVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: COLORS.red,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 2,
  },
  value: {
    fontWeight: "normal",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: "#2ecc40",
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: COLORS.red,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
});
