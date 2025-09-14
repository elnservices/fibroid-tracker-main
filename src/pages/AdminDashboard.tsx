import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  Database
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalLogs: number;
  avgSymptomScore: number;
  logsToday: number;
  activeUsers: number;
}

interface SymptomDistribution {
  symptom: string;
  total: number;
  average: number;
}

interface DailyActivity {
  date: string;
  count: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalLogs: 0,
    avgSymptomScore: 0,
    logsToday: 0,
    activeUsers: 0
  });
  const [symptomDistribution, setSymptomDistribution] = useState<SymptomDistribution[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Get total logs and calculate averages
      const { data: logs, error: logsError } = await supabase
        .from('symptom_logs')
        .select('*');
      
      if (logsError) throw logsError;

      // Get unique users
      const uniqueUsers = new Set(logs?.map(log => log.user_id) || []);
      
      // Calculate today's logs
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logs?.filter(log => log.log_date === today) || [];
      
      // Calculate active users (users with logs in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLogs = logs?.filter(log => new Date(log.log_date) >= sevenDaysAgo) || [];
      const activeUsers = new Set(recentLogs.map(log => log.user_id));

      // Calculate average total symptom score
      const totalScores = logs?.map(log => 
        (log.pain || 0) + (log.bleeding || 0) + (log.fatigue || 0) + (log.pressure || 0)
      ) || [];
      const avgScore = totalScores.length > 0 
        ? totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length 
        : 0;

      // Set basic stats
      setStats({
        totalUsers: uniqueUsers.size,
        totalLogs: logs?.length || 0,
        avgSymptomScore: Number(avgScore.toFixed(1)),
        logsToday: todayLogs.length,
        activeUsers: activeUsers.size
      });

      // Calculate symptom distribution
      const symptoms = ['pain', 'bleeding', 'fatigue', 'pressure'];
      const distribution = symptoms.map(symptom => {
        const values = logs?.map(log => log[symptom as keyof typeof log] as number || 0) || [];
        const total = values.reduce((sum, val) => sum + val, 0);
        const average = values.length > 0 ? total / values.length : 0;
        
        return {
          symptom: symptom.charAt(0).toUpperCase() + symptom.slice(1),
          total,
          average: Number(average.toFixed(1))
        };
      });
      setSymptomDistribution(distribution);

      // Calculate daily activity for last 30 days
      const last30Days = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayLogs = logs?.filter(log => log.log_date === dateStr) || [];
        
        last30Days.push({
          date: dateStr,
          count: dayLogs.length
        });
      }
      setDailyActivity(last30Days);

    } catch (error: any) {
      toast({
        title: "Error loading admin data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (score: number) => {
    if (score === 0) return 'bg-severity-none';
    if (score <= 1) return 'bg-severity-mild';
    if (score <= 2) return 'bg-severity-moderate';
    return 'bg-severity-severe';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Symptom tracking analytics and reports</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Database className="w-4 h-4 mr-2" />
          Admin Panel
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.totalLogs}</p>
            <p className="text-xs text-muted-foreground">Total Logs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.avgSymptomScore}</p>
            <p className="text-xs text-muted-foreground">Avg Severity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.logsToday}</p>
            <p className="text-xs text-muted-foreground">Today's Logs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="symptoms" className="w-full">
        <TabsList>
          <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
          <TabsTrigger value="activity">Daily Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="symptoms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Symptom Distribution
              </CardTitle>
              <CardDescription>
                Total occurrences and average severity by symptom type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {symptomDistribution.map((symptom) => (
                  <div key={symptom.symptom} className="text-center space-y-2">
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h3 className="font-semibold text-lg">{symptom.symptom}</h3>
                      <p className="text-2xl font-bold text-primary">{symptom.total}</p>
                      <p className="text-xs text-muted-foreground">Total occurrences</p>
                      <div className="mt-2">
                        <div className={`inline-block w-3 h-3 rounded-full ${getSeverityColor(symptom.average)}`}></div>
                        <span className="ml-2 text-sm">{symptom.average} avg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Daily Logging Activity (Last 30 Days)
              </CardTitle>
              <CardDescription>
                Number of symptom logs recorded each day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-1 bg-muted/20 rounded-lg p-4">
                {dailyActivity.map((day, index) => {
                  const maxCount = Math.max(...dailyActivity.map(d => d.count), 1);
                  const height = (day.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex-1 flex items-end w-full">
                        <div 
                          className="w-full bg-primary/60 rounded-t transition-all duration-300 hover:bg-primary"
                          style={{ 
                            height: `${Math.max(height, 2)}%`,
                            minHeight: day.count > 0 ? '4px' : '2px'
                          }}
                          title={`${day.date}: ${day.count} logs`}
                        />
                      </div>
                      {index % 5 === 0 && (
                        <span className="text-xs text-muted-foreground transform -rotate-45 origin-left">
                          {new Date(day.date).getDate()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Hover over bars to see daily counts
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;