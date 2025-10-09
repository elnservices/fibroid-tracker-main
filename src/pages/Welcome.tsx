import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Welcome = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!loading && user) {
      const hasCompletedProfile = localStorage.getItem('profileCompleted');
      if (hasCompletedProfile) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/profile-setup', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Fibroid Tracker</h1>
          <p className="text-lg text-muted-foreground">
            Track. Understand. Take Control of Your Health.
          </p>
        </div>

        <div className="space-y-3 pt-8">
          <Link to="/auth?mode=signup" className="block">
            <Button className="w-full" size="lg">
              Sign Up
            </Button>
          </Link>
          <Link to="/auth?mode=login" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Log In
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Your privacy and data are protected with industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default Welcome;
