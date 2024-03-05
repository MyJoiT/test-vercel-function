import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const defaultHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/bg.jpg" />
        <meta property="fc:frame:post_url" content="${ host }?frame=result" />
        <meta property="fc:frame:button:1" content="View Result" />
        <meta property="fc:frame:button:2" content="Go to Profile" />
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta property="fc:frame:button:2:target" content="${ host }/redirect" />
        <meta property="fc:frame:button:3" content="Learn Farcaster" />
        <meta property="fc:frame:button:3:action" content="link" />
        <meta property="fc:frame:button:3:target" content="https://www.farcaster.xyz/" />
      </head>

      <body>
        <h1>Test Frame from vercel Function</h1>
        <figure>
          <img width="600" src="${ host }/bg.jpg" />
        </figure>
      </body>
    </html>
  `

const resultHtml = (host: string, castHash: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/og-image?castHash=${ castHash }" />
        <meta property="fc:frame:button:1" content="Return" />
        <meta property="fc:frame:post_url" content="${ host }?frame=default" />
      </head>

      <body>
      </body>
    </html>
  `

const getValidateMessage = async (messageBytes: string) => {
  const binaryData =  new Uint8Array(
    messageBytes.match(/.{1,2}/g)!.map(
      (byte) => parseInt(byte, 16)
    )
  )

  const response = await fetch(
    "https://nemes.farcaster.xyz:2281/v1/validateMessage", {
    method: "POST",
    headers: {"Content-Type": "application/octet-stream"},
    body: binaryData
  }).then(r => r.json())

  return response
}

export async function GET(request: NextRequest) {
  const html = defaultHtml(request.nextUrl.origin)

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

export async function POST(request: NextRequest) {
  const body = await new Response(request.body).json();

  const data = await getValidateMessage(body.trustedData.messageBytes)
  const castHash = data.message.data.frameActionBody.castId.hash

  let html = null

  const searchParams = request.nextUrl.searchParams
  if(searchParams && searchParams.get('frame') === 'result') {
    html = resultHtml(request.nextUrl.origin, castHash)
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
