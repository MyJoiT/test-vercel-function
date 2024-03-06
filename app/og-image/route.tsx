import { NextRequest } from 'next/server';
import satori from "satori";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const host = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams

  const encodeMessage = searchParams.get('message') ?? ''
  const originMessage = Buffer.from(encodeMessage, 'base64').toString('binary');

  let username: string | null = 'Empty' 

  if(searchParams && searchParams.get('username')) {
      username = searchParams.get('username')
  }

  const font = {
      fileName: 'Redaction-Regular.otf',
      cssName: 'Redaction'
  };
  const fontResponse = await fetch(`${ host }/fonts/${font.fileName}`);
  const fontData = await fontResponse.arrayBuffer();

  const svg = await satori(
    <div style={{
      width: '1200px',
      height: '628px',
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      backgroundImage: `url(${ host }/bg1.jpg)`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      color: 'white',
    }}>
      <h1>Dynamic</h1>
      <h1>Hello { username }</h1>
      <h1>{ originMessage }</h1>
    </div>
    ,
    {
      width: 1200,
      height: 628,
      fonts:[
        {
          name: font.cssName,
          data: fontData,
          weight: 400,
          style: "normal",
        }
      ]
    }
  );
  const svgBuffer = Buffer.from(svg);
  const png = sharp(svgBuffer).png();
  const responseBuffer = await png.toBuffer();

  return new Response(responseBuffer,
    {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000'
      }
    }
  );
}
