
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AvailabilityFiltersProps {
  onFilterChange: (filters: {
    availableToday: boolean;
    availableThisWeek: boolean;
    selectedDate: Date | undefined;
  }) => void;
}

const AvailabilityFilters = ({ onFilterChange }: AvailabilityFiltersProps) => {
  const [availableToday, setAvailableToday] = useState(false);
  const [availableThisWeek, setAvailableThisWeek] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleTodayToggle = () => {
    const newValue = !availableToday;
    setAvailableToday(newValue);
    
    // If toggling today on, turn off this week
    if (newValue) {
      setAvailableThisWeek(false);
    }
    
    onFilterChange({
      availableToday: newValue,
      availableThisWeek: availableThisWeek && !newValue,
      selectedDate: date
    });
  };

  const handleThisWeekToggle = () => {
    const newValue = !availableThisWeek;
    setAvailableThisWeek(newValue);
    
    // If toggling this week on, turn off today
    if (newValue) {
      setAvailableToday(false);
    }
    
    onFilterChange({
      availableToday: availableToday && !newValue,
      availableThisWeek: newValue,
      selectedDate: date
    });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    
    // If selecting a date, turn off other filters
    if (newDate) {
      setAvailableToday(false);
      setAvailableThisWeek(false);
    }
    
    onFilterChange({
      availableToday: false,
      availableThisWeek: false,
      selectedDate: newDate
    });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      <span className="text-sm text-gray-500 mr-2">Disponibilité:</span>
      
      <Button
        variant={availableToday ? "default" : "outline"}
        size="sm"
        onClick={handleTodayToggle}
        className={availableToday ? "bg-tbibdaba-teal hover:bg-tbibdaba-teal/90" : ""}
      >
        Aujourd'hui
      </Button>
      
      <Button
        variant={availableThisWeek ? "default" : "outline"}
        size="sm"
        onClick={handleThisWeekToggle}
        className={availableThisWeek ? "bg-tbibdaba-teal hover:bg-tbibdaba-teal/90" : ""}
      >
        Cette semaine
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={date ? "default" : "outline"}
            size="sm"
            className={cn(
              "justify-start text-left font-normal",
              date ? "bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 text-white" : ""
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP', { locale: fr }) : "Date spécifique"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto bg-popover z-50">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            disabled={(date) => {
              // Disable past dates
              return date < new Date(new Date().setHours(0, 0, 0, 0));
            }}
          />
        </PopoverContent>
      </Popover>
      
      {(availableToday || availableThisWeek || date) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setAvailableToday(false);
            setAvailableThisWeek(false);
            setDate(undefined);
            onFilterChange({
              availableToday: false,
              availableThisWeek: false,
              selectedDate: undefined
            });
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Réinitialiser
        </Button>
      )}
    </div>
  );
};

export default AvailabilityFilters;
