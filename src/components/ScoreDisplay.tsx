interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  severity: {
    label: string;
    severity: 'none' | 'mild' | 'moderate' | 'severe';
  };
}

export const ScoreDisplay = ({ score, maxScore, severity }: ScoreDisplayProps) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getSeverityGradient = (severityLevel: string) => {
    switch (severityLevel) {
      case 'none':
        return 'from-severity-none to-severity-none';
      case 'mild':
        return 'from-severity-mild to-severity-mild';
      case 'moderate':
        return 'from-severity-moderate to-severity-moderate';
      case 'severe':
        return 'from-severity-severe to-severity-severe';
      default:
        return 'from-primary to-primary';
    }
  };

  const getSeverityColor = (severityLevel: string) => {
    switch (severityLevel) {
      case 'none':
        return 'text-severity-none';
      case 'mild':
        return 'text-severity-mild';
      case 'moderate':
        return 'text-severity-moderate';
      case 'severe':
        return 'text-severity-severe';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="flex items-center justify-between bg-muted/30 rounded-xl p-4">
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1">Symptom Score</h3>
        <p className={`text-sm ${getSeverityColor(severity.severity)} font-medium`}>
          {severity.label}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-2xl font-bold ${getSeverityColor(severity.severity)}`}>
            {score}
          </span>
          <span className="text-lg text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
      
      <div className="relative w-20 h-20">
        {/* Background circle */}
        <svg 
          className="w-20 h-20 transform -rotate-90" 
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            fill="transparent"
            className="opacity-30"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={severity.severity === 'none' ? 'hsl(var(--severity-none))' : 
                   severity.severity === 'mild' ? 'hsl(var(--severity-mild))' :
                   severity.severity === 'moderate' ? 'hsl(var(--severity-moderate))' :
                   'hsl(var(--severity-severe))'}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out drop-shadow-sm"
          />
        </svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${getSeverityColor(severity.severity)}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};