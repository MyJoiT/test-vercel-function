import { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE>
    <html>
      <script>
        location.href='https://warpcast.com/joit'
      </script>
      <body>
        <h1>Redirecting...</h1>
      </body>
    </html>
  `

  return new Response(
    html,
    {
      status: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8' 
      },
    }
  );
}

export function POST(request: NextRequest) {
  const host = request.nextUrl.origin

  return new Response(
    null,
    {
      status: 302,
      headers: { 
        'Location': `${ host }/redirect`
      },
    }
  );
}
