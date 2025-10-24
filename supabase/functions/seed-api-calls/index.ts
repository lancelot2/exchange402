import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Seeding API calls for user: ${user.id}`);

    // Get or create an endpoint
    const { data: endpoints } = await supabase
      .from('endpoints')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    let endpointId: string;

    if (!endpoints || endpoints.length === 0) {
      // Create a sample endpoint
      const { data: newEndpoint, error: endpointError } = await supabase
        .from('endpoints')
        .insert({
          user_id: user.id,
          endpoint_path: '/api/demo',
          price_per_call: 0.001,
          currency: 'USD',
          network: 'base',
          description: 'Demo endpoint for testing',
          is_active: true,
        })
        .select('id')
        .single();

      if (endpointError) throw endpointError;
      endpointId = newEndpoint.id;
      console.log(`Created demo endpoint: ${endpointId}`);
    } else {
      endpointId = endpoints[0].id;
      console.log(`Using existing endpoint: ${endpointId}`);
    }

    // Create 20 fake API calls
    const fakeApiCalls = [];
    const statuses = ['success', 'success', 'success', 'success', 'failed'];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - (i * 3600000)); // Each call 1 hour apart
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      fakeApiCalls.push({
        user_id: user.id,
        endpoint_id: endpointId,
        timestamp: timestamp.toISOString(),
        payment_amount: (Math.random() * 0.01).toFixed(4),
        response_time_ms: Math.floor(Math.random() * 500) + 50,
        status: status,
        request_metadata: {
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          user_agent: 'API-Client/1.0',
          method: 'GET',
        },
      });
    }

    const { error: insertError } = await supabase
      .from('api_calls')
      .insert(fakeApiCalls);

    if (insertError) throw insertError;

    console.log('Successfully seeded 20 API calls');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Seeded 20 API calls successfully',
        endpointId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error seeding API calls:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
