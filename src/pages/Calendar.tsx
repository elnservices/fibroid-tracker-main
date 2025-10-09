import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/UserMenu';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Link } from 'react-router-dom';

interface LogEntry {
  id: string;
  log_date: string;
  total_score: number | null;
  pain: number;
  bleeding: number;
  fatigue: number;
  pressure: number;
}

const Calendar = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  useEffect(() => {
    if (user) {
      loadMonthLogs();
    }
  }, [user, currentMonth]);

  const loadMonthLogs = async () => {
    if (!user) return;

    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('log_date', start)
      .lte('log_date', end)
      .order('log_date', { ascending: true });

    if (!error && data) {
      setLogEntries(data);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getLogForDate = (date: Date) => {
    return logEntries.find(log => isSameDay(new Date(log.log_date), date));
  };

  const getSeverityColor = (score: number) => {
    if (score <= 5) return 'bg-green-500';
    if (score <= 10) return 'bg-yellow-500';
    if (score <= 15) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const log = getLogForDate(date);
    setSelectedLog(log || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Symptom Calendar</h1>
          </div>
          <UserMenu />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                {daysInMonth.map((date, idx) => {
                  const log = getLogForDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(date)}
                      className={`
                        aspect-square p-2 rounded-lg border transition-all
                        ${isSameMonth(date, currentMonth) ? 'text-foreground' : 'text-muted-foreground'}
                        ${isSelected ? 'ring-2 ring-primary' : ''}
                        hover:bg-accent
                      `}
                    >
                      <div className="text-sm">{format(date, 'd')}</div>
                      {log && (
                        <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${getSeverityColor(log.total_score || 0)}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Date</CardTitle>
              <CardDescription>
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedLog ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Score</p>
                    <p className="text-2xl font-bold">{selectedLog.total_score || 0}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Symptoms Logged:</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Pain:</span>
                        <span className="font-medium">{selectedLog.pain}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bleeding:</span>
                        <span className="font-medium">{selectedLog.bleeding}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fatigue:</span>
                        <span className="font-medium">{selectedLog.fatigue}/3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pressure:</span>
                        <span className="font-medium">{selectedLog.pressure}/3</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No symptoms logged for this date</p>
                  <Link to="/dashboard">
                    <Button className="mt-4" size="sm">
                      Log Symptoms
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Click on a date to view details
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
