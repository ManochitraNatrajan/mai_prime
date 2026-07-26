const Jimp = require('jimp');

async function removeBackground() {
  try {
    const image = await Jimp.read('public/logo.jpeg');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      // If the pixel is white or very close to white
      if (r > 240 && g > 240 && b > 240) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      }
    });
    await image.writeAsync('public/logo.png');
    console.log('Successfully created transparent logo.png');
  } catch (err) {
    console.error('Error removing background:', err);
  }
}

removeBackground();
