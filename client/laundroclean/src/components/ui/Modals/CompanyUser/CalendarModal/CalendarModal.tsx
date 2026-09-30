import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./CalendarModal.module.css";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
}

export default function CalendarModal(props: CalendarEvent) {
    return (
        <div className={styles.calendarmodalcontainer}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev, next today",
                    center: "title",
                    right: "dayGridMonth, timeGridWeek, timeGridDay"
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                // events={events}
                // select={handleDateSelecet}
                // eventClick={handleEventClick}
                // eventChange={handleEventChange}
                height="80vh"
            />
        </div>
    )
}