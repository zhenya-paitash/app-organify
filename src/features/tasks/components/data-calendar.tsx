import { useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, getDay, parse, startOfWeek, addMonths, subMonths } from "date-fns";
import { enUS } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { EventCard } from "./event-card";

import { TaskStatus, TTask } from "../types";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, getDay, parse, startOfWeek, locales });

interface CalendarEvent {
  id: string;
  title: string;
  project: string;
  executor: string;
  status: string;
  start: Date;
  end: Date;
}

enum CalendarEventType {
  NEXT = "NEXT",
  PREV = "PREV",
  TODAY = "TODAY",
}

type CalendarEventAction = CalendarEventType;

interface DataCalendarProps {
  data: TTask[];
}

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: CalendarEventAction) => void;
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="w-full flex items-center justify-center gap-x-2 mb-4 lg:w-auto lg:justify-start">
      <Button variant="secondary" size="icon" onClick={() => onNavigate(CalendarEventType.PREV)}>
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="w-full flex items-center justify-center border border-input rounded-md px-3 py-2 h-8 lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button variant="secondary" size="icon" onClick={() => onNavigate(CalendarEventType.NEXT)}>
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [date, setDate] = useState(data.length ? new Date(data[0].dueDate) : new Date());
  const events: CalendarEvent[] = data.map(task => ({
    id: task.$id,
    title: task.name,
    project: task.project,
    executor: task.executor,
    status: task.status,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
  }));

  const handleNavigate = (action: CalendarEventAction) => {
    switch (action) {
      case CalendarEventType.NEXT:
        setDate(subMonths(date, 1));
        break;
      case CalendarEventType.PREV:
        setDate(addMonths(date, 1));
        break;
      case CalendarEventType.TODAY:
        setDate(new Date());
        break;
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={date}
      events={events}
      views={["month"]}
      defaultView="month"
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) => localizer?.format(date, "EEE", culture) ?? "",
      }}
      toolbar
      showAllEvents
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            project={event.project}
            executor={event.executor}
            status={event.status as TaskStatus}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={date} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
};
