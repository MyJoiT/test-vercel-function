import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
export function GET(request: NextRequest) {
  const html = `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ request.nextUrl.origin }/bg.jpg" />
      </head>
      <body>
        <h1>Test Frame from vercel Function</h1>
          <figure>
            <img width="600" src="${ request.nextUrl.origin }/bg.jpg" />
          </figure>
      </body>
    </html>
  ` 

  console.log('request: ', request.nextUrl.host)

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
