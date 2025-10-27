import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const apiKey = url.searchParams.get('apiKey');

    // Validate API key parameter
    if (!apiKey) {
      console.error('Missing apiKey parameter');
      return new Response(
        JSON.stringify({ error: 'Missing apiKey parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Validate API key and get user_id
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('user_id, is_active')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (apiKeyError || !apiKeyData) {
      console.error('Invalid or inactive API key:', apiKey);
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userId = apiKeyData.user_id;

    // Update last_used_at timestamp for API key
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('api_key', apiKey);

    // Fetch user's wallet address and network
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('wallet_address, network')
      .eq('user_id', userId)
      .single();

    if (walletError || !walletData) {
      console.error('No wallet configured for user:', userId);
      return new Response(
        JSON.stringify({ error: 'No wallet configured for user' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch all active endpoints for the user
    const { data: endpointsData, error: endpointsError } = await supabase
      .from('endpoints')
      .select('endpoint_path, price_per_call, network')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (endpointsError) {
      console.error('Error fetching endpoints:', endpointsError);
      return new Response(
        JSON.stringify({ error: 'Error fetching endpoints' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format endpoints for x402 middleware
    const endpoints: Record<string, { price: string; network: string }> = {};
    
    if (endpointsData) {
      endpointsData.forEach((endpoint) => {
        const path = endpoint.endpoint_path.startsWith('/') 
          ? endpoint.endpoint_path 
          : `/${endpoint.endpoint_path}`;
        const key = `GET ${path}`;
        endpoints[key] = {
          price: `$${parseFloat(endpoint.price_per_call).toFixed(3)}`,
          network: endpoint.network,
        };
      });
    }

    // Build configuration response
    const config = {
      walletAddress: walletData.wallet_address,
      endpoints,
      network: walletData.network,
      asset: 'USDC',
    };

    console.log('Configuration fetched successfully for user:', userId);

    return new Response(
      JSON.stringify(config),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in get-config function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
