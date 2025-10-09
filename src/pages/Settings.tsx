import { Settings as SettingsIcon, Bell, Shield, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserMenu from '@/components/UserMenu';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    medicationReminder: false,
    weeklyReport: true,
  });

  const handleExportData = () => {
    toast({
      title: 'Data Exported',
      description: 'Your health data has been exported successfully.',
    });
  };

  const handleDeleteData = () => {
    toast({
      title: 'Data Deletion',
      description: 'Please contact support to delete your account data.',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10">
      <div className="container mx-auto p-4 space-y-6 max-w-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <UserMenu />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications & Reminders</CardTitle>
            </div>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-reminder">Daily Symptom Reminder</Label>
                <p className="text-sm text-muted-foreground">Get reminded to log symptoms each day</p>
              </div>
              <Switch
                id="daily-reminder"
                checked={notifications.dailyReminder}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, dailyReminder: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="medication-reminder">Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders for medication schedule</p>
              </div>
              <Switch
                id="medication-reminder"
                checked={notifications.medicationReminder}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, medicationReminder: checked }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekly-report">Weekly Summary Report</Label>
                <p className="text-sm text-muted-foreground">Receive weekly health summaries</p>
              </div>
              <Switch
                id="weekly-report"
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, weeklyReport: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Privacy & Data</CardTitle>
            </div>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Your Data</Label>
                <p className="text-sm text-muted-foreground">Download all your health data</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Delete Account Data</Label>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" onClick={handleDeleteData}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Get help or contact us</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              For questions or support, please contact us at support@fibroidtracker.com
            </p>
            <p className="text-sm text-muted-foreground">
              Version 1.0.0
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
