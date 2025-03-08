interface Env {
  SIPSAVE_KV: KVNamespace;
}

interface CheckInRecord {
  date: string;
  time: string;
  amount: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

async function handleGetRecords(userId: string, env: Env): Promise<Response> {
  try {
    const records = await env.SIPSAVE_KV.get(`records_${userId}`);
    return new Response(records || '[]', {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch records' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

async function handlePutRecords(userId: string, request: Request, env: Env): Promise<Response> {
  try {
    const records: CheckInRecord[] = await request.json();
    await env.SIPSAVE_KV.put(`records_${userId}`, JSON.stringify(records));
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save records' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');

    if (pathParts.length >= 4 && pathParts[1] === 'users' && pathParts[3] === 'records') {
      const userId = pathParts[2];

      if (request.method === 'GET') {
        return handleGetRecords(userId, env);
      } else if (request.method === 'PUT') {
        return handlePutRecords(userId, request, env);
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};