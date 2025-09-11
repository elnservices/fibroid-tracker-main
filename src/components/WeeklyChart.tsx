import { SymptomData } from '@/pages/Index';

interface WeeklyChartProps {
  data: SymptomData[];
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getSeverityColor = (score: number) => {
    if (score === 0) return 'bg-severity-none';
    if (score <= 4) return 'bg-severity-mild';
    if (score <= 8) return 'bg-severity-moderate';
    return 'bg-severity-severe';
  };

  const getSeverityLabel = (score: number) => {
    if (score === 0) return 'None';
    if (score <= 4) return 'Mild';
    if (score <= 8) return 'Moderate';
    return 'Severe';
  };

  // Fill in missing days with empty data for the last 7 days
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toDateString();
    
    const dayData = data.find(d => d.date === dateString);
    last7Days.push({
      date: dateString,
      totalScore: dayData?.totalScore || 0,
      hasData: !!dayData
    });
  }

  const maxScore = 12;

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-32 bg-muted/20 rounded-lg p-3">
        {last7Days.map((day, index) => {
          const heightPercentage = day.hasData ? (day.totalScore / maxScore) * 100 : 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 flex items-end w-full">
                <div 
                  className={`w-full rounded-t transition-all duration-300 ${
                    day.hasData ? getSeverityColor(day.totalScore) : 'bg-muted/30'
                  }`}
                  style={{ 
                    height: `${Math.max(heightPercentage, 5)}%`,
                    minHeight: day.hasData ? '8px' : '4px'
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {getDayName(day.date)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-severity-none" />
            <span className="text-muted-foreground">None</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-severity-mild" />
            <span className="text-muted-foreground">Mild</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-severity-moderate" />
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-severity-severe" />
            <span className="text-muted-foreground">Severe</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-muted/30 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Avg Score</p>
            <p className="font-semibold">
              {(data.reduce((sum, d) => sum + d.totalScore, 0) / data.length).toFixed(1)}
            </p>
          </div>
          <div className="text-center bg-muted/30 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Days Logged</p>
            <p className="font-semibold">{data.length}</p>
          </div>
          <div className="text-center bg-muted/30 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Severity</p>
            <p className="font-semibold text-xs">
              {getSeverityLabel(data[data.length - 1]?.totalScore || 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};