import { NextRequest } from 'next/server';
import satori from "satori";
import sharp from "sharp";
import { html } from "satori-html";

export async function GET(request: NextRequest) {
  const content = `
  <!DOCTYPE>
  <html>
    <body>
      <h1>Dynamic Content to image</h1>
    </body>
  </html>
  `
  const svg = await satori(
    html(content), 
    {
      width: 1200,
      height: 628,
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
