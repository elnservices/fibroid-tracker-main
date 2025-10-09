import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Shield, MapPin, Calendar, Target, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    location: '',
    age: '',
    diagnosis: '',
    goals: [] as string[],
  });

  const locations = [
    { value: 'us', label: 'United States', compliance: 'HIPAA' },
    { value: 'canada', label: 'Canada', compliance: 'HIPAA' },
    { value: 'uk', label: 'United Kingdom', compliance: 'GDPR' },
    { value: 'eu', label: 'European Union', compliance: 'GDPR' },
    { value: 'other', label: 'Other Region', compliance: 'GDPR' },
  ];

  const diagnoses = [
    { value: 'fibroids', label: 'Uterine Fibroids' },
    { value: 'endometriosis', label: 'Endometriosis' },
    { value: 'pcos', label: 'PCOS' },
    { value: 'multiple', label: 'Multiple Conditions' },
    { value: 'unsure', label: 'Unsure / Not Diagnosed' },
  ];

  const goals = [
    { id: 'awareness', label: 'Awareness - Understanding my symptoms', icon: '🎯' },
    { id: 'tracking', label: 'Symptom tracking - Daily monitoring', icon: '📊' },
    { id: 'doctor_report', label: 'Doctor report - Medical appointment preparation', icon: '📋' },
    { id: 'treatment', label: 'Treatment monitoring - Track effectiveness', icon: '💊' },
    { id: 'fertility', label: 'Fertility planning - Reproductive health', icon: '👶' },
  ];

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const getComplianceRegion = () => {
    const location = locations.find(l => l.value === formData.location);
    return location?.compliance || 'GDPR';
  };

  const canProceed = () => {
    if (step === 1) return formData.location !== '';
    if (step === 2) return formData.diagnosis !== '';
    if (step === 3) return formData.goals.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const profileData = {
        age: parseInt(formData.age) || null,
        location: formData.location,
        diagnosis: formData.diagnosis,
        goals: formData.goals,
        complianceRegion: getComplianceRegion(),
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      localStorage.setItem('profileCompleted', 'true');

      toast({
        title: 'Profile Complete! 🎉',
        description: 'Your health profile has been set up successfully.',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && '🌍 Location & Privacy'}
              {step === 2 && '🏥 Health Information'}
              {step === 3 && '🎯 Your Goals'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Select your location for compliance and data protection'}
              {step === 2 && 'Help us understand your health journey'}
              {step === 3 && 'What would you like to achieve with this app?'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Location */}
            {step === 1 && (
              <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Privacy & Compliance</p>
                        <p className="text-xs text-muted-foreground">
                          We comply with HIPAA (US & Canada) and GDPR (other regions) to keep your health data private and secure.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Select Your Location
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Choose your location..." />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label} ({location.compliance})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      Protected under {getComplianceRegion()} regulations
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age">Age (Optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    min="18"
                    max="120"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Health Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>What brings you here?</Label>
                  <RadioGroup
                    value={formData.diagnosis}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, diagnosis: value }))}
                    className="space-y-3"
                  >
                    {diagnoses.map((diagnosis) => (
                      <div key={diagnosis.value} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent transition-colors">
                        <RadioGroupItem value={diagnosis.value} id={diagnosis.value} />
                        <Label htmlFor={diagnosis.value} className="font-normal cursor-pointer flex-1">
                          {diagnosis.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="reproductive-history">Reproductive Health History (Optional)</Label>
                  <textarea
                    id="reproductive-history"
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Share any relevant reproductive health history, previous diagnoses, treatments, surgeries, or medications..."
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    This information helps provide more personalized tracking and insights
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {step === 3 && (
              <div className="space-y-4">
                <Label>Select your goals (choose all that apply)</Label>
                <div className="grid gap-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`flex items-center space-x-3 border rounded-lg p-4 transition-colors cursor-pointer ${
                        formData.goals.includes(goal.id) ? 'bg-primary/5 border-primary' : 'hover:bg-accent'
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <Checkbox
                        id={goal.id}
                        checked={formData.goals.includes(goal.id)}
                        onCheckedChange={() => handleGoalToggle(goal.id)}
                      />
                      <Label htmlFor={goal.id} className="font-normal cursor-pointer flex-1 flex items-center gap-2">
                        <span className="text-xl">{goal.icon}</span>
                        {goal.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : step === 3 ? (
                  'Complete Setup'
                ) : (
                  'Next'
                )}
              </Button>
            </div>

            {step === 1 && (
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Skip for Now
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
