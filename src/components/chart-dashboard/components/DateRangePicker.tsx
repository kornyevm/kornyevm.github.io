import {useMemo, useState} from "react";
import type {DateRange} from "react-day-picker";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {toStartOfDay, toEndOfDay} from "@/lib/date-utils.ts";

type DateRangePickerProps = {
  dateRange: DateRange | undefined
  updateDateRange: (dateRange: DateRange | undefined) => void
  className?: string
  minDate?: Date
  maxDate?: Date
};

// TODO: Consider making this re-usable, move to components/ui, and make the dateRange prop optional
function DateRangePicker({ className, dateRange, updateDateRange, minDate, maxDate }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      updateDateRange(range)
      return
    }

    updateDateRange({
      from: range.from ? toStartOfDay(range.from) : undefined,
      to: range.to ? toEndOfDay(range.to) : undefined,
    })
  }

  const dateRangeString = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
      const from = dateRange.from.toLocaleDateString("en-US", options)
      const to = dateRange.to.toLocaleDateString("en-US", options)
      return `${from} - ${to}`;
    } else {
      return 'Select a Date';
    }
  }, [dateRange]);

  const disabledDates = useMemo(() => {
    if (minDate && maxDate) {
      return { before: minDate, after: maxDate }
    }
    if (minDate) {
      return { before: minDate }
    }
    if (maxDate) {
      return { after: maxDate }
    }
    return undefined
  }, [minDate, maxDate])

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
        <PopoverContent className="w-screen max-w-[100vw)] sm:w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateRangeSelect}
            numberOfMonths={2}
            className="w-full sm:w-[500px]"
            disabled={disabledDates}
          />
          {/*<Button variant='link' onClick={() => setOpen(false)}>Apply</Button>*/}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateRangePicker
