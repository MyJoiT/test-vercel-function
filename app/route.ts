import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic' // static by default, unless reading the request

// <meta property="fc:frame:button:4" content="Mint" />
// <meta property="fc:frame:button:4:action" content="mint" />
// <meta property="fc:frame:button:4:target" content="eip155:7777777:0x060f3edd18c47f59bd23d063bbeb9aa4a8fec6df">

const defaultHtml = (host: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/bg.jpg" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:input:text" content="What is happening?" /> 
        <meta property="fc:frame:post_url" content="${ host }?frame=result" />
        <meta property="fc:frame:button:1" content="View Result" />
        <meta property="fc:frame:button:2" content="Author" />
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta property="fc:frame:button:2:target" content="${ host }/redirect" />
        <meta property="fc:frame:button:3" content="FC Doc" />
        <meta property="fc:frame:button:3:action" content="link" />
        <meta property="fc:frame:button:3:target" content="https://www.farcaster.xyz/" />
        <meta property="fc:frame:button:4" content="Rent Storage" />
        <meta property="fc:frame:button:4:action" content="tx" />
        <meta property="fc:frame:button:4:target" content="${ host }/tx" />
      </head>

      <body>
        <h1>Test Frame from vercel Function</h1>
        <figure>
          <img width="600" src="${ host }/bg.jpg" />
        </figure>
      </body>
    </html>
  `

const resultHtml = (host: string, username: string, message: string) => `
    <!DOCTYPE>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${ host }/og-image?username=${ username }&message=${ message }&t=${ new Date().valueOf() }" />
        <meta property="fc:frame:button:1" content="Return" />
        <meta property="fc:frame:post_url" content="${ host }?frame=default" />
        <meta property="fc:frame:state" content="default ${ new Date().valueOf() }" />
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
    "https://nemes.farcaster.xyz:2281/v1/validateMessage",
    {
      method: "POST",
      headers: {"Content-Type": "application/octet-stream"},
      body: binaryData
    }
  )

  return response.json()
}

const getUsernameByFid = async (fid: number) => {
  const response = await fetch(`https://nemes.farcaster.xyz:2281/v1/userDataByFid?fid=${ fid }&user_data_type=6`)
  return response.json()
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

  console.log('non-tx full data is: ', body)

  console.log('non-tx untrustedData is: ', body.untrustedData)

  const originMessage = body.untrustedData.inputText
  let encodeMessage = ''
  if(originMessage) {
    encodeMessage = Buffer.from(originMessage, 'binary').toString('base64');
  }

  const data = await getValidateMessage(body.trustedData.messageBytes)

  console.log('non-tx trustedData is: ', data)

  const fid = data.message.data.fid

  console.log('non-tx fid is: ', fid)

  console.log('non-tx frameActionBody: ', data.message.data.frameActionBody)

  const { userDataBody } = (await getUsernameByFid(fid)).data

  console.log('non-tx userDataBody is: ', userDataBody, userDataBody.value)

  let html = null

  const searchParams = request.nextUrl.searchParams
  if(searchParams && searchParams.get('frame') === 'result') {
    html = resultHtml(request.nextUrl.origin, userDataBody.value, encodeMessage)
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
