import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Heart, Clock, BarChart3, FileText, CheckCircle } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    icon: Heart,
    title: "Welcome to Fibroid Tracker",
    description: "Track your fibroid symptoms easily and gain valuable insights into your health patterns.",
    features: ["Daily symptom logging", "Visual score tracking", "Weekly insights"]
  },
  {
    icon: Clock,
    title: "Daily Reminders",
    description: "Set up gentle reminders to log your symptoms consistently for the most accurate tracking.",
    features: ["Customizable notification time", "Gentle daily prompts", "Never miss a log"]
  },
  {
    icon: BarChart3,
    title: "Insights & Patterns",
    description: "Discover patterns in your symptoms and understand what factors might be affecting your health.",
    features: ["Weekly trend analysis", "Correlation insights", "Progress tracking"]
  },
  {
    icon: FileText,
    title: "Share with Your Doctor",
    description: "Export comprehensive reports to share with your healthcare provider for better treatment decisions.",
    features: ["Monthly summaries", "Exportable PDFs", "Treatment planning support"]
  }
];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [reminderTime, setReminderTime] = useState("20:00");

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding completion and reminder settings
      localStorage.setItem('fibroid-tracker-onboarded', 'true');
      localStorage.setItem('fibroid-tracker-reminder', reminderTime);
      onComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('fibroid-tracker-onboarded', 'true');
    onComplete();
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card border-0 shadow-glow">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <CardTitle className="text-xl mb-2">{currentStepData.title}</CardTitle>
          
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-4">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {currentStepData.description}
          </p>

          {/* Features List */}
          <div className="space-y-2">
            {currentStepData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Special step for reminder setup */}
          {currentStep === 1 && (
            <Card className="bg-muted/30 p-4">
              <Label className="text-sm font-medium">Daily Reminder Time</Label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full mt-2 p-2 border border-input rounded-md bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll send you a gentle reminder to log your symptoms
              </p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 bg-gradient-primary border-0"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Button>
          </div>

          {currentStep === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Your health data stays private and secure on your device
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};