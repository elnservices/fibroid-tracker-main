import { Settings as SettingsIcon, Bell, Shield, Download, Trash2, MessageCircle, Mail, Phone, Watch, Check, X, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserMenu from '@/components/UserMenu';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    medicationReminder: false,
    weeklyReport: true,
  });

  const [connectedDevices, setConnectedDevices] = useState({
    appleWatch: false,
    fitbit: false,
    garmin: false,
    samsungWatch: false,
  });

  const smartwatches = [
    { 
      id: 'appleWatch',
      name: 'Apple Watch', 
      description: 'Sync health and activity data',
      icon: '⌚',
      color: 'text-slate-600'
    },
    { 
      id: 'fitbit',
      name: 'Fitbit', 
      description: 'Track activity, sleep, and heart rate',
      icon: '🏃',
      color: 'text-teal-600'
    },
    { 
      id: 'garmin',
      name: 'Garmin', 
      description: 'Monitor fitness and wellness metrics',
      icon: '🎯',
      color: 'text-blue-600'
    },
    { 
      id: 'samsungWatch',
      name: 'Samsung Galaxy Watch', 
      description: 'Connect health and fitness tracking',
      icon: '⚡',
      color: 'text-indigo-600'
    },
  ];

  const handleDeviceToggle = (deviceId: string) => {
    const isCurrentlyConnected = connectedDevices[deviceId as keyof typeof connectedDevices];
    
    setConnectedDevices(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId as keyof typeof prev]
    }));

    toast({
      title: isCurrentlyConnected ? 'Device Disconnected' : 'Device Connected',
      description: isCurrentlyConnected 
        ? 'Your device has been disconnected successfully'
        : 'Your device has been connected successfully',
    });
  };

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

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/auth');
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
              <Watch className="h-5 w-5" />
              <CardTitle>Smartwatch Integration</CardTitle>
            </div>
            <CardDescription>Connect your smartwatch to sync health data automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground">
                <strong>Sync Data:</strong> Activity levels, heart rate, sleep patterns, and step count can be automatically tracked and correlated with your symptoms.
              </p>
            </div>

            {smartwatches.map((device, idx) => (
              <div key={device.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`text-3xl ${device.color}`}>
                      {device.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-semibold">{device.name}</Label>
                        {connectedDevices[device.id as keyof typeof connectedDevices] && (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <Check className="h-3 w-3" />
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{device.description}</p>
                    </div>
                  </div>
                  <Button
                    variant={connectedDevices[device.id as keyof typeof connectedDevices] ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleDeviceToggle(device.id)}
                  >
                    {connectedDevices[device.id as keyof typeof connectedDevices] ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Disconnect
                      </>
                    ) : (
                      'Connect'
                    )}
                  </Button>
                </div>
                {idx < smartwatches.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
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
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Log Out</Label>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support & Help</CardTitle>
            <CardDescription>Get assistance when you need it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Live Chat Support</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Chat with our support team in real-time
              </p>
              <Button className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Other Support Options</h3>
              
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-muted-foreground">support@fibroidtracker.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-muted-foreground">1-800-FIBROID (Mon-Fri, 9am-5pm)</p>
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Version 1.0.0</span>
              <Button variant="link" size="sm">
                Help Center
              </Button>
            </div>
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
