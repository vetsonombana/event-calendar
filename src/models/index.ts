export interface EventModel {
    id: number;
    start: string;
    duration: number;
}


export interface findOverlappingEventsResponse {
    events: EventModel[] | null;
    occursDuringAnotherEvents: boolean;
}
