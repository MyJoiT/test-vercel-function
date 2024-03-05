import { NextRequest } from 'next/server';
import satori from "satori";
import sharp from "sharp";
import { html } from "satori-html";

export async function GET(request: NextRequest) {
  const host = request.nextUrl.origin

  const content = html`
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Dynamic Content to image</h1>
      </body>
    </html>
  `

  const font = {
      fileName: 'Redaction-Regular.otf',
      cssName: 'Redaction'
  };
  const fontResponse = await fetch(`${ host }/fonts/${font.fileName}`);
  const fontData = await fontResponse.arrayBuffer();

  const svg = await satori(
    <h1>Dynamic Content to image</h1>, 
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
