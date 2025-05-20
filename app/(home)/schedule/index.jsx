import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import { useQuery } from "@tanstack/react-query";
import axiosBackendInstance from "../../../api/axios";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useAuthStore } from '@/store/index';

function useLectureSessions(enabled) {
  return useQuery({
    queryKey: ["lecture-sessions"],
    queryFn: async () => {
      const { data } = await axiosBackendInstance.get(
        "attendance/sessions/calendar-data/"
      );
      return data;
    },
    enabled,
  });
}

function useEventSessions(enabled) {
  // Mock data for now
  return useQuery({
    queryKey: ["event-sessions"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((res) => setTimeout(res, 200));
      return [
        {
          title: "Python Workshop",
          description: "Learn Python basics",
          event_date: "2024-05-20",
          audience_type: "both",
          is_mandatory: true,
          target_track_ids: [1],
          sessions: [
            {
              title: "Introduction to Python",
              speaker: "John Doe",
              start_time: "2024-05-20T09:00:00Z",
              end_time: "2024-05-20T10:30:00Z",
              description: "Basic Python syntax and concepts",
            },
            {
              title: "Advanced Python Features",
              speaker: "Jane Smith",
              start_time: "2024-05-20T11:00:00Z",
              end_time: "2024-05-20T12:30:00Z",
              description: "Decorators, generators, and context managers",
            },
          ],
        },
      ];
    },
    enabled,
  });
}

function transformLecturesToAgenda(lectures) {
  const agenda = {};
  lectures.forEach((l) => {
    const date = l.schedule_date;
    if (!agenda[date]) agenda[date] = [];
    agenda[date].push({
      id: `lecture-${l.id}`,
      type: "lecture",
      title: l.title,
      instructor: l.instructor,
      is_online: l.is_online,
      start: l.start,
      end: l.end,
      branch: l.branch,
      schedule_id: l.schedule_id,
      schedule_date: l.schedule_date,
    });
  });
  return agenda;
}

function transformEventsToAgenda(events) {
  const agenda = {};
  events.forEach((ev) => {
    if (!ev.sessions || ev.sessions.length === 0) return;
    // Find earliest start and latest end
    const sorted = [...ev.sessions].sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );
    const start = sorted[0].start_time;
    const end = sorted[sorted.length - 1].end_time;
    const date = ev.event_date;
    if (!agenda[date]) agenda[date] = [];
    agenda[date].push({
      id: `event-${date}-${ev.title}`,
      type: "event",
      title: ev.title,
      description: ev.description,
      start,
      end,
      sessions: ev.sessions,
      is_mandatory: ev.is_mandatory,
      audience_type: ev.audience_type,
    });
  });
  return agenda;
}

export default function ScheduleScreen() {
  const { role } = useAuthStore((state) => ({ role: state.role }));
  const navigation = useNavigation();
  const showLectures = role === "student";
  const showEvents = role === "student" || role === "guest";

  const { data: lecturesRaw = [], isLoading: loadingLectures } = useLectureSessions(showLectures);
  const { data: eventsRaw = [], isLoading: loadingEvents } = useEventSessions(showEvents);

  const agendaItems = useMemo(() => {
    let items = {};
    if (showLectures && lecturesRaw) {
      items = { ...items, ...transformLecturesToAgenda(lecturesRaw) };
    }
    if (showEvents && eventsRaw) {
      const eventAgenda = transformEventsToAgenda(eventsRaw);
      Object.keys(eventAgenda).forEach((date) => {
        if (!items[date]) items[date] = [];
        items[date] = [...items[date], ...eventAgenda[date]];
      });
    }
    return items;
  }, [lecturesRaw, eventsRaw, showLectures, showEvents]);

  return (
    <View style={styles.container}>
      <Agenda
        items={agendaItems}
        renderItem={(item) => (
          <TouchableOpacity
            style={styles.item}
            // onPress={() => {
            //   if (item.type === "event")
            //     navigation.navigate("EventDetails", { event: item });
            // }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            {item.type === "lecture" ? (
              <Text>Instructor: {item.instructor}</Text>
            ) : null}
            {item.type === "event" ? (
              <Text>{item.description}</Text>
            ) : null}
            <Text>
              {new Date(item.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {new Date(item.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        )}
        renderEmptyDate={() => (
          <View style={styles.emptyDate}>
            <Text>No events</Text>
          </View>
        )}
        refreshing={loadingLectures || loadingEvents}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  item: {
    backgroundColor: "#f2f2f2",
    margin: 10,
    borderRadius: 8,
    padding: 15,
  },
  emptyDate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
});
