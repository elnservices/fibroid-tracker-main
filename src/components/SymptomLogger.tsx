import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface SymptomData {
  pain: number;
  bleeding: number;
  fatigue: number;
  pressure: number;
}

interface SymptomLoggerProps {
  initialValues: SymptomData;
  onSave: (symptoms: SymptomData) => void;
  onCancel: () => void;
}

const symptomCategories = [
  {
    key: 'pain' as const,
    label: 'Pain Level',
    description: 'Pelvic or back pain',
    icon: '🔥',
    levels: ['None', 'Mild', 'Moderate', 'Severe']
  },
  {
    key: 'bleeding' as const,
    label: 'Bleeding',
    description: 'Menstrual flow intensity',
    icon: '🩸',
    levels: ['None', 'Light', 'Moderate', 'Heavy']
  },
  {
    key: 'fatigue' as const,
    label: 'Fatigue/Energy',
    description: 'Overall energy level',
    icon: '💤',
    levels: ['High Energy', 'Slight Fatigue', 'Tired', 'Exhausted']
  },
  {
    key: 'pressure' as const,
    label: 'Pressure',
    description: 'Bladder/bowel pressure',
    icon: '🫧',
    levels: ['None', 'Slight', 'Noticeable', 'Severe']
  }
];

export const SymptomLogger = ({ initialValues, onSave, onCancel }: SymptomLoggerProps) => {
  const [symptoms, setSymptoms] = useState(initialValues);

  const handleSliderChange = (key: keyof typeof symptoms, value: number[]) => {
    setSymptoms(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const getSeverityColor = (value: number) => {
    if (value === 0) return 'severity-none';
    if (value === 1) return 'severity-mild';
    if (value === 2) return 'severity-moderate';
    return 'severity-severe';
  };

  const getTotalScore = () => {
    return symptoms.pain + symptoms.bleeding + symptoms.fatigue + symptoms.pressure;
  };

  return (
    <div className="space-y-6">
      {symptomCategories.map((category) => {
        const value = symptoms[category.key];
        return (
          <div key={category.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <Label className="text-sm font-medium">{category.label}</Label>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold text-${getSeverityColor(value)}`}>
                  {value}/3
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Slider
                value={[value]}
                onValueChange={(newValue) => handleSliderChange(category.key, newValue)}
                max={3}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {category.levels.map((level, index) => (
                  <span 
                    key={index}
                    className={value === index ? `font-medium text-${getSeverityColor(index)}` : ''}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <Card className="bg-muted/30 p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Total Score</p>
          <p className="text-2xl font-bold">
            <span className={`text-${getSeverityColor(Math.floor(getTotalScore() / 3))}`}>
              {getTotalScore()}
            </span>
            <span className="text-muted-foreground">/12</span>
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(symptoms)} 
          className="flex-1 bg-gradient-primary border-0"
        >
          Save Symptoms
        </Button>
      </div>
    </div>
  );
};