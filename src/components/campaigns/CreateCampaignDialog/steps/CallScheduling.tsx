import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface CallSchedulingProps {
  data: any;
  onComplete: (data: any) => void;
}

const timeSlots = [
  { start: "09:00", end: "12:00", label: "Morning" },
  { start: "12:00", end: "17:00", label: "Afternoon" },
  { start: "17:00", end: "20:00", label: "Evening" },
];

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function CallScheduling({ data, onComplete }: CallSchedulingProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: data.schedule.startDate,
    to: data.schedule.endDate,
  });
  
  const [frequency, setFrequency] = useState(data.schedule.frequency || 'daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    data.schedule.timeSlots.map((slot: any) => slot.day) || []
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(
    data.schedule.timeSlots.map((slot: any) => `${slot.startTime}-${slot.endTime}`) || []
  );

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleTimeSlotToggle = (slot: string) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const handleContinue = () => {
    if (!date?.from || !date?.to || selectedDays.length === 0 || selectedTimeSlots.length === 0) return;
    
    const timeSlots = selectedDays.flatMap(day =>
      selectedTimeSlots.map(slot => {
        const [start, end] = slot.split('-');
        return { day, startTime: start, endTime: end };
      })
    );

    onComplete({
      schedule: {
        startDate: date.from,
        endDate: date.to,
        timeSlots,
        frequency,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Campaign Duration</Label>
        <div className="flex items-start gap-4">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <div className="space-y-4">
            <div>
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {date?.from ? (
                  <>
                    {date.to ? (
                      `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                    ) : (
                      date.from.toLocaleDateString()
                    )}
                  </>
                ) : (
                  "Select date range"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Available Days</Label>
        <ScrollArea className="h-[150px] rounded-md border p-4">
          <div className="space-y-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex items-center justify-between py-2"
              >
                <Label htmlFor={day} className="flex items-center gap-2">
                  {day}
                </Label>
                <Switch
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => handleDayToggle(day)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <Label>Time Slots</Label>
        <div className="flex gap-4">
          {timeSlots.map((slot) => (
            <Button
              key={`${slot.start}-${slot.end}`}
              variant={selectedTimeSlots.includes(`${slot.start}-${slot.end}`) ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleTimeSlotToggle(`${slot.start}-${slot.end}`)}
            >
              <Clock className="mr-2 h-4 w-4" />
              {slot.label}
              <Badge variant="secondary" className="ml-2">
                {slot.start}-{slot.end}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}