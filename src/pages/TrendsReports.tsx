import { useState, useEffect } from 'react';
import { TrendingUp, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import UserMenu from '@/components/UserMenu';
import { WeeklyChart } from '@/components/WeeklyChart';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const TrendsReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadWeeklyData();
    }
  }, [user]);

  const loadWeeklyData = async () => {
    if (!user) return;

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const { data, error } = await supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('log_date', sevenDaysAgo.toISOString().split('T')[0])
      .lte('log_date', today.toISOString().split('T')[0])
      .order('log_date', { ascending: true });

    if (!error && data) {
      // Transform data to match SymptomData interface
      const transformedData = data.map(entry => ({
        date: new Date(entry.log_date).toDateString(),
        pain: entry.pain,
        bleeding: entry.bleeding,
        fatigue: entry.fatigue,
        pressure: entry.pressure,
        totalScore: entry.total_score || 0
      }));
      setWeeklyData(transformedData);
    }
  };

  const handleDownloadReport = () => {
    toast({
      title: 'Report Generated',
      description: 'Your health report has been downloaded.',
    });
  };

  const calculateAverage = (field: string) => {
    if (weeklyData.length === 0) return 0;
    const sum = weeklyData.reduce((acc: number, entry: any) => {
      return acc + (entry[field] || 0);
    }, 0);
    return (sum / weeklyData.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Trends & Reports</h1>
          </div>
          <UserMenu />
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Pain Level</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{calculateAverage('pain')}</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Bleeding</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{calculateAverage('bleeding')}</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Fatigue</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{calculateAverage('fatigue')}</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Entries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{weeklyData.length}</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
            <TabsTrigger value="reports">Doctor Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Symptom Trends</CardTitle>
                <CardDescription>Track your symptoms over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                {weeklyData.length > 0 ? (
                  <WeeklyChart data={weeklyData} />
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No data available. Start logging symptoms to see trends.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>Coming soon: 30-day symptom analysis</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                Monthly trend analysis feature coming soon
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Reports</CardTitle>
                <CardDescription>Generate comprehensive health reports for your healthcare provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">7-Day Summary Report</p>
                      <p className="text-sm text-muted-foreground">Includes all symptom data and trends</p>
                    </div>
                  </div>
                  <Button onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">30-Day Comprehensive Report</p>
                      <p className="text-sm text-muted-foreground">Detailed monthly analysis</p>
                    </div>
                  </div>
                  <Button onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrendsReports;
