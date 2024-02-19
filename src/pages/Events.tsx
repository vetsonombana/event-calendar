import { useMemo } from "react";
import Event from "../components/event/Event";
import Time from "../components/time/Time";
import { EventModel } from "../models/index";
import "./Events.css";
import { findOverlappingEvents } from "../utils/events";

const events: EventModel[] = [
  {
    id: 1,
    start: "17:00",
    duration: 40,
  },
  {
    id: 2,
    start: "17:10",
    duration: 30,
  },
  {
    id: 3,
    start: "19:40",
    duration: 30,
  },
  {
    id: 4,
    start: "15:00",
    duration: 60,
  },
  {
    id: 5,
    start: "18:15",
    duration: 20,
  },
  {
    id: 6,
    start: "10:25",
    duration: 35,
  },
  {
    id: 7,
    start: "10:45",
    duration: 30,
  },
  {
    id: 8,
    start: "17:05",
    duration: 100,
  },
  {
    id: 9,
    start: "10:00",
    duration: 30,
  },
  {
    id: 10,
    start: "11:50",
    duration: 20,
  },
  {
    id: 11,
    start: "19:00",
    duration: 60,
  },
  {
    id: 12,
    start: "09:00",
    duration: 45,
  },
  {
    id: 13,
    start: "14:45",
    duration: 60,
  },
  {
    id: 14,
    start: "11:50",
    duration: 30,
  },
  {
    id: 15,
    start: "11:40",
    duration: 40,
  },
  {
    id: 16,
    start: "14:00",
    duration: 30,
  },
  {
    id: 17,
    start: "09:15",
    duration: 30,
  },
  {
    id: 18,
    start: "10:55",
    duration: 10,
  },
];

const pixelsPerHour = 100;
const startTime = 9;

const Events = () => {
  const overlappingEventsMemoized = useMemo(() => {
    return events.map((event) => findOverlappingEvents(events, event.id));
  }, []);

  const maxLength = overlappingEventsMemoized
    .map((event) => event?.events?.length ?? 0)
    .reduce((max, length) => Math.max(max, length), 0);

  return (
    <div className="container">
      <Time />
      <div className="event-panel">
        {events.map((event, index) => {
          const startTimeArray = event.start.split(":");
          const startHour = parseInt(startTimeArray[0]);
          const startMinute = parseInt(startTimeArray[1]);
          const totalStartMinutes = startHour * 60 + startMinute;
          const eventTop =
            (totalStartMinutes - startTime * 60) * (pixelsPerHour / 60);

          return (
            <Event
              key={index}
              eventTop={eventTop}
              event={event}
              overlappingEvents={overlappingEventsMemoized[index]}
              maxLength={maxLength}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Events;
