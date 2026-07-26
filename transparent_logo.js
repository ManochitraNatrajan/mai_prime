const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function makeTransparent() {
  try {
    const inPath = path.resolve(__dirname, 'frontend/public/logo.jpeg');
    const outPath = path.resolve(__dirname, 'frontend/public/logo.png');
    const buffer = fs.readFileSync(inPath);
    const image = await Jimp.read(buffer);
    // Assuming the top-left pixel is the background color (likely white)
    const targetColor = image.getPixelColor(0, 0); 
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const thisColor = image.getPixelColor(x, y);
      // If the color is very close to the target color (white), make it transparent
      if (thisColor === targetColor) {
        this.bitmap.data[idx + 3] = 0; // alpha channel
      } else {
        // Simple tolerance for near-white
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        if (r > 240 && g > 240 && b > 240) {
          this.bitmap.data[idx + 3] = 0;
        }
      }
    });

    image.write(outPath, () => {
      console.log('Logo background made transparent.');
    });
    console.log('Logo background made transparent.');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

makeTransparent();
