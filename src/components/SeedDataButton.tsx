import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export const SeedDataButton = () => {
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('seed-api-calls');
      
      if (error) throw error;
      
      toast.success('Successfully seeded 20 API calls! Refresh the page to see them.');
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={seedData} 
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Seed Demo Data
    </Button>
  );
};
