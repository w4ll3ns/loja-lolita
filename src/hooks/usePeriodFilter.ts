
import { useState, useMemo } from 'react';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, isAfter, isBefore, isEqual } from 'date-fns';

export type PeriodType = 'today' | 'thisWeek' | 'last15Days' | 'thisMonth' | 'custom' | 'all';

export const usePeriodFilter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('all');
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({});

  const getDateRange = useMemo(() => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        return {
          from: startOfDay(now),
          to: endOfDay(now)
        };
      case 'thisWeek':
        return {
          from: startOfWeek(now, { weekStartsOn: 1 }), // Segunda-feira
          to: endOfWeek(now, { weekStartsOn: 1 })
        };
      case 'last15Days':
        return {
          from: startOfDay(subDays(now, 14)),
          to: endOfDay(now)
        };
      case 'thisMonth':
        return {
          from: startOfMonth(now),
          to: endOfMonth(now)
        };
      case 'custom':
        return customDateRange;
      case 'all':
      default:
        return { from: undefined, to: undefined };
    }
  }, [selectedPeriod, customDateRange]);

  const filterByPeriod = <T extends { date: Date }>(items: T[]): T[] => {
    if (selectedPeriod === 'all' || (!getDateRange.from && !getDateRange.to)) {
      return items;
    }

    return items.filter(item => {
      const itemDate = item.date;
      
      if (getDateRange.from && getDateRange.to) {
        return (isAfter(itemDate, getDateRange.from) || isEqual(itemDate, getDateRange.from)) &&
               (isBefore(itemDate, getDateRange.to) || isEqual(itemDate, getDateRange.to));
      } else if (getDateRange.from) {
        return isAfter(itemDate, getDateRange.from) || isEqual(itemDate, getDateRange.from);
      } else if (getDateRange.to) {
        return isBefore(itemDate, getDateRange.to) || isEqual(itemDate, getDateRange.to);
      }
      
      return true;
    });
  };

  return {
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
    getDateRange,
    filterByPeriod
  };
};
