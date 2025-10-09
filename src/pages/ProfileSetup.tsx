import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    age: '',
    diagnosis: '',
    goals: [] as string[],
  });

  const diagnoses = [
    { value: 'fibroids', label: 'Uterine Fibroids' },
    { value: 'endometriosis', label: 'Endometriosis' },
    { value: 'pcos', label: 'PCOS' },
    { value: 'unsure', label: 'Unsure / Not Diagnosed' },
  ];

  const goals = [
    { id: 'awareness', label: 'General Health Awareness' },
    { id: 'tracking', label: 'Symptom Tracking' },
    { id: 'doctor_report', label: 'Doctor Reports' },
    { id: 'fertility', label: 'Fertility Planning' },
  ];

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Store profile data in localStorage for now since users table may not be accessible
      localStorage.setItem('userProfile', JSON.stringify({
        age: parseInt(formData.age) || null,
        diagnosis: formData.diagnosis,
        goals: formData.goals
      }));

      const error = null;

      if (error) throw error;

      toast({
        title: 'Profile Created!',
        description: 'Your health profile has been set up successfully.',
      });

      navigate('/');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Set Up Your Health Profile</CardTitle>
          <CardDescription>
            Help us personalize your experience (all fields optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Enter your age"
              />
            </div>

            <div className="space-y-3">
              <Label>Known Diagnosis</Label>
              <RadioGroup
                value={formData.diagnosis}
                onValueChange={(value) => setFormData(prev => ({ ...prev, diagnosis: value }))}
              >
                {diagnoses.map((diagnosis) => (
                  <div key={diagnosis.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={diagnosis.value} id={diagnosis.value} />
                    <Label htmlFor={diagnosis.value} className="font-normal cursor-pointer">
                      {diagnosis.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>What are your goals? (Select all that apply)</Label>
              <div className="space-y-2">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal.id}
                      checked={formData.goals.includes(goal.id)}
                      onCheckedChange={() => handleGoalToggle(goal.id)}
                    />
                    <Label htmlFor={goal.id} className="font-normal cursor-pointer">
                      {goal.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Skip for Now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
