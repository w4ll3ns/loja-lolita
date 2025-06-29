
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export type PeriodType = 'today' | 'thisWeek' | 'last15Days' | 'thisMonth' | 'custom' | 'all';

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  customDateRange: { from?: Date; to?: Date };
  onCustomDateChange: (range: { from?: Date; to?: Date }) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
  customDateRange,
  onCustomDateChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Período:</span>
        <Select value={selectedPeriod} onValueChange={(value: PeriodType) => onPeriodChange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="thisWeek">Semana atual</SelectItem>
            <SelectItem value="last15Days">Últimos 15 dias</SelectItem>
            <SelectItem value="thisMonth">Mês atual</SelectItem>
            <SelectItem value="custom">Período personalizado</SelectItem>
            <SelectItem value="all">Todos os dados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedPeriod === 'custom' && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !customDateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange.from ? format(customDateRange.from, "dd/MM/yyyy") : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customDateRange.from}
                onSelect={(date) => onCustomDateChange({ ...customDateRange, from: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">até</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !customDateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDateRange.to ? format(customDateRange.to, "dd/MM/yyyy") : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customDateRange.to}
                onSelect={(date) => onCustomDateChange({ ...customDateRange, to: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;
