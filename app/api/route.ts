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
        <div style="color:red">Hello World</div>
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
