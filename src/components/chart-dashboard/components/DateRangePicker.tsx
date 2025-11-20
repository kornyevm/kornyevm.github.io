import {useMemo, useState} from "react";
import type {DateRange} from "react-day-picker";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";

type DateRangePickerProps = {
  className?: string;
};

function DateRangePicker({ className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  })

  const dateRangeString = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
      return `${dateRange.from.toLocaleDateString("en-US", options)} - ${dateRange.to.toLocaleDateString("en-US", options)}`;
    } else {
      return 'Select a Date';
    }
  }, [dateRange]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-between font-normal"
          >
            <CalendarIcon className='mb-0.5' />
            {dateRangeString}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            className="rounded-lg border shadow-sm w-[500px]"
          />
          {/*<Button variant='link' onClick={() => setOpen(false)}>Apply</Button>*/}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateRangePicker
