import { EventModel, findOverlappingEventsResponse } from "../models/index";

export function findOverlappingEvents(events: EventModel[], eventId: number): findOverlappingEventsResponse {
    const eventQueue = [events.find(event => event.id === eventId)];

    if (!eventQueue[0]) {
        //console.log("Event not found.");
        return {
            events: null, occursDuringAnotherEvents: false,
        };
    }

    let overlappingEvents: EventModel[] = [];

    let isOccuringDuringAnotherEvents = false;

    for (let i = 0; i < eventQueue.length; i++) {
        const currentEvent = eventQueue[i]; // Get and remove the first event from the queue    
        if (!currentEvent) continue;
        
        if (overlappingEvents.some(e => e.id === currentEvent.id)) {
            // Skip if this event is already in the overlappingEvents array
            continue;
        }

        // Add to overlapping events
        isOccuringDuringAnotherEvents = occursDuringAnotherEvent(currentEvent, events)
        overlappingEvents.push(currentEvent);

        // Check currentEvent against all other events for overlaps
        events.forEach((event) => {

            if (event.id !== currentEvent.id && doEventsOverlap(currentEvent, event)) {
            
                if (!overlappingEvents.some(e => e.id === event.id) && !eventQueue.some(e => e?.id === event.id)) {
                    eventQueue.push(event); // Add new overlapping events to the queue
                }
            }

        });
        
    }
    
    // Sort the final list first by start time, then by ID
    return {
        events: overlappingEvents.sort((a, b) => {
            // Compare by start time first
            const startComparison = a.start.localeCompare(b.start);
        
            if (startComparison !== 0) {
                return startComparison;
            }

            // If start times are equal, compare by id
            return a.id - b.id;
        }),

        occursDuringAnotherEvents: isOccuringDuringAnotherEvents,
    };
}

function doEventsOverlap(event1: EventModel, event2: EventModel): boolean {
    
    const event1Start = new Date("1970-01-01T" + event1.start).getTime();
    const event2Start = new Date("1970-01-01T" + event2.start).getTime();

    const event1End = event1Start + (event1.duration * 60 * 1000);
    const event2End = event2Start + (event2.duration * 60 * 1000);
    
    return (

        (event1.start === event2.start) ||
        (
            (event1.start <= event2.start && event1End > event2Start) &&        
            (event1End <= event2End || event1Start >= event2End)
        ) ||
        (
            (event2.start <= event1.start && event2End > event1Start) &&
            (event2End <= event1End || event2Start >= event1End)
        )
    );
}

function occursDuringAnotherEvent(event: EventModel, events: EventModel[]): boolean {
    const eventStart = new Date("1970-01-01T" + event.start).getTime();
    const eventEnd = eventStart + (event.duration * 60 * 1000);

    for (const otherEvent of events) {
        if (otherEvent.id === event.id) continue;

        const otherEventStart = new Date("1970-01-01T" + otherEvent.start).getTime();
        const otherEventEnd = otherEventStart + (otherEvent.duration * 60 * 1000);

        if ((eventStart >= otherEventStart && eventStart < otherEventEnd) ||
            (otherEventStart >= eventStart && otherEventStart < eventEnd)) {
            return true;
        }

    }

    return false;
}

