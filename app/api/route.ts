export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
export function GET(request: Request) {
  const html = `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ request.nextUrl.host }/bg.jpg" />
      </head>
      <body>
        <h1>Test Frame from vercel Function</h1>
          <figure>
            <img width="600" src="${ request.nextUrl.host }/bg.jpg" />
          </figure>
      </body>
    </html>
  ` 

  // console.log('request: ', request.nextUrl.host)

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
