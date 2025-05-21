import React, { useMemo, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Calendar as BigCalendar } from "react-native-big-calendar";
import axiosBackendInstance from "../../../api/axios";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from '@/store/index';
import { useWindowDimensions } from "react-native";


function lecturesToCalendarEvents(lectures) {
  return lectures.map((l) => ({
    id: `lecture-${l.id}`,
    title: l.title + (l.is_online ? " (Online)" : ""),
    start: new Date(l.start),
    end: new Date(l.end),
    color: "#1976d2",
    isLecture: true,
    data: l,
  }));
}

function eventsToCalendarEvents(events) {
  const result = [];
  events.forEach((ev, idx) => {
    if (!ev.sessions || ev.sessions.length === 0) return;
    // Find earliest start and latest end
    const sorted = [...ev.sessions].sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );
    const start = sorted[0].start_time;
    const end = sorted[sorted.length - 1].end_time;
    // Add wrapper event
    result.push({
      id: `event-${idx}`,
      title: ev.title + " (Event)",
      start: new Date(start),
      end: new Date(end),
      color: "#c62828",
      isLecture: false,
      data: ev,
    });
    // Add each session as its own event
    ev.sessions.forEach((session, sidx) => {
      result.push({
        id: `event-${idx}-session-${sidx}`,
        title: `${session.title} (${ev.title})`,
        start: new Date(session.start_time),
        end: new Date(session.end_time),
        color: "#ad1457",
        isLecture: false,
        data: { ...ev, session },
      });
    });
  });
  return result;
}

function GeneralScheduleScreen() {
  const { role } = useAuthStore((state) => ({ role: state.role }));
  const navigation = useNavigation();
  const showLectures = role === "student";
  const showEvents = role === "student" || role === "guest";

  const [lecturesRaw, setLecturesRaw] = useState([]);
  const [eventsRaw, setEventsRaw] = useState([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

 const { width, height } = useWindowDimensions();

  useEffect(() => {
    let ignore = false;
    if (showLectures) {
      setLoadingLectures(true);
      axiosBackendInstance.get("attendance/sessions/calendar-data/")
        .then(({ data }) => { if (!ignore) setLecturesRaw(data); })
        .catch(() => { if (!ignore) setLecturesRaw([]); })
        .finally(() => { if (!ignore) setLoadingLectures(false); });
    } else {
      setLecturesRaw([]);
    }
    return () => { ignore = true; };
  }, [showLectures]);

  useEffect(() => {
    let ignore = false;
    if (showEvents) {
      setLoadingEvents(true);
      // Mock data for now
      setTimeout(() => {
        if (!ignore) {
          setEventsRaw([
            {
              title: "Python Workshop",
              description: "Learn Python basics",
              event_date: "2025-05-20",
              audience_type: "both",
              is_mandatory: true,
              target_track_ids: [1],
              sessions: [
                {
                  title: "Introduction to Python",
                  speaker: "John Doe",
                  start_time: "2025-05-20T09:00:00Z",
                  end_time: "2025-05-20T10:30:00Z",
                  description: "Basic Python syntax and concepts",
                },
                {
                  title: "Advanced Python Features",
                  speaker: "Jane Smith",
                  start_time: "2025-05-20T11:00:00Z",
                  end_time: "2025-05-20T12:30:00Z",
                  description: "Decorators, generators, and context managers",
                },
              ],
            },
          ]);
          setLoadingEvents(false);
        }
      }, 200);
    } else {
      setEventsRaw([]);
    }
    return () => { ignore = true; };
  }, [showEvents]);

  const events = useMemo(() => {
    let items = [];
    if (showLectures && lecturesRaw) {
      items = items.concat(lecturesToCalendarEvents(lecturesRaw));
    }
    if (showEvents && eventsRaw) {
      items = items.concat(eventsToCalendarEvents(eventsRaw));
    }
    return items;
  }, [lecturesRaw, eventsRaw, showLectures, showEvents]);

  if (loadingLectures || loadingEvents) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#1976d2" /></View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <BigCalendar
        events={events}
        height={height - 100}
        mode="3days"
        eventCellStyle={(event) => ({ backgroundColor: event.color })}
        onPressEvent={(event) => {
          if (!event.isLecture) {
            navigation.navigate("EventDetails", { event: event.data });
          }
        }}
        minHour={8}
        maxHour={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default GeneralScheduleScreen;