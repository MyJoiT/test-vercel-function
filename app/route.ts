import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const defaultHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/bg.jpg" />
        <meta property="fc:frame:button:1" content="View Result" />
        <meta property="fc:frame:post_url" content="${ host }?frame=result" />
      </head>

      <!--
      <body>
        <h1>Test Frame from vercel Function</h1>
        <figure>
          <img width="600" src="${ host }/bg.jpg" />
        </figure>
      </body>
      -->
    </html>
  `

const resultHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/bg1.jpg" />
        <meta property="fc:frame:button:1" content="Return" />
        <meta property="fc:frame:post_url" content="${ host }?frame=default" />
      </head>

      <!--
      <body>
      </body>
      -->
    </html>
  `

export function GET(request: NextRequest) {
  const html = defaultHtml(request.nextUrl.host)

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
  let html = null

  const searchParams = request.nextUrl.searchParams
  if(searchParams && searchParams.get('frame') === 'result') {
    html = resultHtml(request.nextUrl.origin)
  } else {
    html = defaultHtml(request.nextUrl.origin)
  }

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
