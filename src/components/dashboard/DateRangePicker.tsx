import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  presets: Array<{ label: string; value: DateRange }>;
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  presets,
  selectedPreset,
  onPresetChange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant={selectedPreset === preset.label ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onPresetChange(preset.label);
              onDateRangeChange(preset.value);
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              onDateRangeChange(range);
              onPresetChange('custom');
            }}
            numberOfMonths={2}
            className={cn('p-3 pointer-events-auto')}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
