import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ExpandableCalendar, Timeline, CalendarProvider } from "react-native-calendars";
import axiosBackendInstance from "../../../api/axios";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useAuthStore } from '@/store/index';
import { useQuery } from "@tanstack/react-query";


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

  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today in YYYY-MM-DD
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  // Combine and flatten all events for Timeline
  const allEvents = useMemo(() => {
    let items = [];
    if (showLectures && lecturesRaw) {
      items = items.concat(
        lecturesRaw.map((l) => ({
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
          description: l.title,
        }))
      );
    }
    if (showEvents && eventsRaw) {
      eventsRaw.forEach((ev, idx) => {
        // Add wrapper event
        if (ev.sessions && ev.sessions.length > 0) {
          const sorted = [...ev.sessions].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
          items.push({
            id: `event-${idx}`,
            type: "event",
            title: ev.title,
            description: ev.description,
            start: sorted[0].start_time,
            end: sorted[sorted.length - 1].end_time,
            event_date: ev.event_date,
            is_mandatory: ev.is_mandatory,
            audience_type: ev.audience_type,
          });
          // Add each session as its own event
          ev.sessions.forEach((session, sidx) => {
            items.push({
              id: `event-${idx}-session-${sidx}`,
              type: "event-session",
              title: session.title + ` (${ev.title})`,
              description: session.description,
              start: session.start_time,
              end: session.end_time,
              event_date: ev.event_date,
              speaker: session.speaker,
            });
          });
        }
      });
    }
    return items;
  }, [lecturesRaw, eventsRaw, showLectures, showEvents]);

  // Filter events for selected date
  const eventsForSelectedDate = useMemo(() => {
    return allEvents.filter(ev => {
      const dateStr = (ev.schedule_date || ev.event_date || ev.start || "").slice(0, 10);
      return dateStr === selectedDate;
    }).map(ev => ({
      ...ev,
      start: new Date(ev.start),
      end: new Date(ev.end),
      title: ev.title,
      summary: ev.description,
    }));
  }, [allEvents, selectedDate]);

  return (
    <View style={styles.container}>
      <CalendarProvider date={selectedDate}>
        <ExpandableCalendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{ [selectedDate]: { selected: true } }}
          initialPosition="open"
        />
        <ScrollView >
          {/* DEBUG: Show raw events for the selected date */}
          {eventsForSelectedDate.length === 0 ? (
            <View style={styles.emptyDate}>
              <Text>No events</Text>
            </View>
          ) : null}
          {/* DEBUG: Show event titles for verification */}
          {eventsForSelectedDate.length > 0 && (
            <View style={{ padding: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Events for {selectedDate}:</Text>
              {eventsForSelectedDate.map(ev => (
                <Text key={ev.id}>{ev.title} ({ev.start.toLocaleTimeString()} - {ev.end.toLocaleTimeString()})</Text>
              ))}
            </View>
          )}
          <Timeline
            events={eventsForSelectedDate}
            showNowIndicator
            style={{ minHeight: 400 }}
            renderEvent={event => (
              <TouchableOpacity
                style={styles.item}
              >
                <Text style={{ fontWeight: "bold" }}>{event.title}</Text>
                {event.type === "lecture" && event.instructor ? (
                  <Text>Instructor: {event.instructor}</Text>
                ) : null}
                {event.speaker ? <Text>Speaker: {event.speaker}</Text> : null}
                <Text>
                  {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" - "}
                  {event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
                {event.summary ? <Text>{event.summary}</Text> : null}
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </CalendarProvider>
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
