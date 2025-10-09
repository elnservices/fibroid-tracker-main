import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SymptomLogger } from '@/components/SymptomLogger';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { WeeklyChart } from '@/components/WeeklyChart';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import UserMenu from '@/components/UserMenu';
import { Heart, Calendar, TrendingUp, FileText, BarChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SymptomData {
  date: string;
  pain: number;
  bleeding: number;
  fatigue: number;
  pressure: number;
  totalScore: number;
}

const Index = () => {
  const [currentSymptoms, setCurrentSymptoms] = useState({
    pain: 0,
    bleeding: 0,
    fatigue: 0,
    pressure: 0
  });

  const [showLogger, setShowLogger] = useState(false);
  const [weeklyData, setWeeklyData] = useState<SymptomData[]>([]);
  const [todayLogged, setTodayLogged] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [seeding, setSeeding] = useState(false);

  // Check onboarding status and load today's data
  useEffect(() => {
    const isOnboarded = localStorage.getItem('fibroid-tracker-onboarded');
    if (!isOnboarded) {
      setShowOnboarding(true);
      return;
    }

    const today = new Date().toDateString();
    const stored = localStorage.getItem('fibroid-symptoms');
    if (stored) {
      const data: SymptomData[] = JSON.parse(stored);
      setWeeklyData(data);
      
      const todayEntry = data.find(entry => entry.date === today);
      if (todayEntry) {
        setCurrentSymptoms({
          pain: todayEntry.pain,
          bleeding: todayEntry.bleeding,
          fatigue: todayEntry.fatigue,
          pressure: todayEntry.pressure
        });
        setTodayLogged(true);
      }
    }
  }, []);

  const handleSymptomSave = (symptoms: typeof currentSymptoms) => {
    const today = new Date().toDateString();
    const totalScore = symptoms.pain + symptoms.bleeding + symptoms.fatigue + symptoms.pressure;
    
    const newEntry: SymptomData = {
      date: today,
      ...symptoms,
      totalScore
    };

    const stored = localStorage.getItem('fibroid-symptoms');
    let allData: SymptomData[] = stored ? JSON.parse(stored) : [];
    
    // Remove existing entry for today if it exists
    allData = allData.filter(entry => entry.date !== today);
    
    // Add new entry
    allData.push(newEntry);
    
    // Keep only last 30 days
    allData = allData.slice(-30);
    
    localStorage.setItem('fibroid-symptoms', JSON.stringify(allData));
    setWeeklyData(allData);
    setCurrentSymptoms(symptoms);
    setTodayLogged(true);
    setShowLogger(false);
  };

  const getTotalScore = () => {
    return currentSymptoms.pain + currentSymptoms.bleeding + currentSymptoms.fatigue + currentSymptoms.pressure;
  };

  const getScoreSeverity = (score: number) => {
    if (score === 0) return { label: 'No symptoms', severity: 'none' as const };
    if (score <= 4) return { label: 'Mild symptoms', severity: 'mild' as const };
    if (score <= 8) return { label: 'Moderate symptoms', severity: 'moderate' as const };
    return { label: 'Severe symptoms', severity: 'severe' as const };
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Load data after onboarding
    const today = new Date().toDateString();
    const stored = localStorage.getItem('fibroid-symptoms');
    if (stored) {
      const data: SymptomData[] = JSON.parse(stored);
      setWeeklyData(data);
      
      const todayEntry = data.find(entry => entry.date === today);
      if (todayEntry) {
        setCurrentSymptoms({
          pain: todayEntry.pain,
          bleeding: todayEntry.bleeding,
          fatigue: todayEntry.fatigue,
          pressure: todayEntry.pressure
        });
        setTodayLogged(true);
      }
    }
  };
  const seedSampleLogs = async () => {
    if (!user) {
      toast({ title: "Not signed in", description: "Please log in to seed sample data.", variant: "destructive" });
      return;
    }
    setSeeding(true);
    try {
      const today = new Date();
      const entries = Array.from({ length: 20 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const pain = Math.floor(Math.random() * 4);
        const bleeding = Math.floor(Math.random() * 4);
        const fatigue = Math.floor(Math.random() * 4);
        const pressure = Math.floor(Math.random() * 4);
        return {
          user_id: user.id,
          log_date: d.toISOString().slice(0, 10),
          pain,
          bleeding,
          fatigue,
          pressure,
        };
      });
      const { error } = await supabase
        .from('symptom_logs')
        .upsert(entries, { onConflict: 'user_id,log_date', ignoreDuplicates: true });
      if (error) throw error;
      toast({ title: "Seed complete", description: "Added sample logs for the last 20 days." });
    } catch (e: any) {
      toast({ title: "Seeding failed", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  // Show onboarding flow for first-time users
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6 rounded-b-3xl shadow-soft">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Fibroid Tracker
            </h1>
            <p className="text-primary-foreground/80">Monitor your symptoms with ease</p>
          </div>
          <UserMenu />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6 -mt-6">
        {/* Today's Score Card */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              Today's Status
              <Badge variant={todayLogged ? 'default' : 'secondary'} className="text-xs">
                {todayLogged ? 'Logged' : 'Not Logged'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreDisplay 
              score={getTotalScore()} 
              maxScore={12} 
              severity={getScoreSeverity(getTotalScore())} 
            />
            
            {todayLogged ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Pain Level</p>
                  <p className="text-lg font-semibold">{currentSymptoms.pain}/3</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Bleeding</p>
                  <p className="text-lg font-semibold">{currentSymptoms.bleeding}/3</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Fatigue</p>
                  <p className="text-lg font-semibold">{currentSymptoms.fatigue}/3</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Pressure</p>
                  <p className="text-lg font-semibold">{currentSymptoms.pressure}/3</p>
                </div>
              </div>
            ) : null}
            
            <Button 
              onClick={() => setShowLogger(!showLogger)} 
              className="w-full bg-gradient-primary border-0 shadow-glow"
              size="lg"
            >
              {todayLogged ? 'Update Today\'s Symptoms' : 'Log Today\'s Symptoms'}
            </Button>
          </CardContent>
        </Card>

        {/* Symptom Logger */}
        {showLogger && (
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Symptom Logger</CardTitle>
              <p className="text-sm text-muted-foreground">Rate each symptom from 0 (none) to 3 (severe)</p>
            </CardHeader>
            <CardContent>
              <SymptomLogger 
                initialValues={currentSymptoms}
                onSave={handleSymptomSave}
                onCancel={() => setShowLogger(false)}
              />
            </CardContent>
          </Card>
        )}

        {/* Weekly Overview */}
        {weeklyData.length > 0 && (
          <Card className="bg-gradient-card border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                7-Day Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyChart data={weeklyData.slice(-7)} />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/calendar" className="block">
            <Card className="bg-gradient-card border-0 shadow-soft p-4 text-center cursor-pointer hover:shadow-glow transition-all">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Calendar</p>
              <p className="text-xs text-muted-foreground">View history</p>
            </Card>
          </Link>
          
          <Link to="/trends" className="block">
            <Card className="bg-gradient-card border-0 shadow-soft p-4 text-center cursor-pointer hover:shadow-glow transition-all">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Trends</p>
              <p className="text-xs text-muted-foreground">View insights</p>
            </Card>
          </Link>

          <Link to="/education" className="block">
            <Card className="bg-gradient-card border-0 shadow-soft p-4 text-center cursor-pointer hover:shadow-glow transition-all">
              <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Education</p>
              <p className="text-xs text-muted-foreground">Learn more</p>
            </Card>
          </Link>

          <Link to="/settings" className="block">
            <Card className="bg-gradient-card border-0 shadow-soft p-4 text-center cursor-pointer hover:shadow-glow transition-all">
              <BarChart className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Settings</p>
              <p className="text-xs text-muted-foreground">Preferences</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
