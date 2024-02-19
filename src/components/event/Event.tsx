import { useState, useEffect } from "react";
import { EventModel, findOverlappingEventsResponse } from "../../models/index";
import "./Event.css";

interface EventProps {
    event: EventModel;
    eventTop: number;
    overlappingEvents: findOverlappingEventsResponse;
    maxLength: number
}

const Event: React.FC<EventProps> = ({event, eventTop, overlappingEvents, maxLength}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [eventWidth, setEventWidth] = useState(0);

    const [left, setLeft] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
   
    
    useEffect(()=>{
        let defaultWidth, eventWidthTemp = 0;
        if (overlappingEvents.events != null) {
            const currentEventIndex = overlappingEvents.events.findIndex((evt : any) => evt.id === event.id);
    
            defaultWidth = (windowWidth - 50) / overlappingEvents.events.length;
            setLeft(defaultWidth * currentEventIndex);
    
            eventWidthTemp = (overlappingEvents.events.length === 1 && overlappingEvents.occursDuringAnotherEvents) ? ((windowWidth - 50) / (maxLength - 1)) : defaultWidth;

            setEventWidth(eventWidthTemp);
        }
    },[event.id, maxLength, overlappingEvents.events, overlappingEvents.occursDuringAnotherEvents, windowWidth]);


    return (
        <div
            style={{ top: `${eventTop}px`, height: `${(event.duration * 100) / 60}px`, width: `${eventWidth}px`, left: `${left}px` }}
            className="event"
        >
            {event.id}
        </div>
    );
};

export default Event;
