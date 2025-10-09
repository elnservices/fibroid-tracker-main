import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Welcome = () => {
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
