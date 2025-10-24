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

    // Get all endpoints for the user
    let { data: endpoints } = await supabase
      .from('endpoints')
      .select('id')
      .eq('user_id', user.id);

    if (!endpoints || endpoints.length === 0) {
      // Create a sample endpoint if none exist
      const { data: newEndpoint, error: endpointError } = await supabase
        .from('endpoints')
        .insert({
          user_id: user.id,
          endpoint_path: '/api/demo',
          price_per_call: 0.01,
          currency: 'USD',
          network: 'base',
          description: 'Demo endpoint for testing',
          is_active: true,
        })
        .select('id')
        .single();

      if (endpointError) throw endpointError;
      endpoints = [newEndpoint];
      console.log(`Created demo endpoint: ${newEndpoint.id}`);
    }

    console.log(`Distributing calls across ${endpoints.length} endpoint(s)`);

    // Create 20 fake API calls distributed evenly across endpoints
    const fakeApiCalls = [];
    const statuses = ['success', 'success', 'success', 'success', 'failed'];
    const mockWallets = [
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB',
      '0x583031D1113aD414F02576BD6afaBfb302140225',
    ];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - (i * 3600000)); // Each call 1 hour apart
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      // Distribute calls evenly across all endpoints
      const endpointIndex = i % endpoints.length;
      
      fakeApiCalls.push({
        user_id: user.id,
        endpoint_id: endpoints[endpointIndex].id,
        timestamp: timestamp.toISOString(),
        payment_amount: (Math.random() * 0.09 + 0.01).toFixed(2), // Min $0.01, max $0.10
        response_time_ms: Math.floor(Math.random() * 500) + 50,
        status: status,
        wallet_address: mockWallets[Math.floor(Math.random() * mockWallets.length)],
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
        message: `Seeded 20 API calls across ${endpoints.length} endpoint(s)`,
        endpointCount: endpoints.length 
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
