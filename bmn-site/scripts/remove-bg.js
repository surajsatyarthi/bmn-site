const { Jimp } = require('jimp');

async function main() {
  if (process.argv.length < 4) {
    console.error('Usage: node remove-bg.js <input> <output>');
    process.exit(1);
  }

  const inputPath = process.argv[2];
  const outputPath = process.argv[3];

  try {
    console.log(`Reading image from ${inputPath}...`);
    const image = await Jimp.read(inputPath);
    
    console.log('Processing pixels...');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // Threshold for white (allow some variance)
      if (r >= 230 && g >= 230 && b >= 230) {
        // Set to #fafbfc (RGB: 250, 251, 252)
        this.bitmap.data[idx + 0] = 250;
        this.bitmap.data[idx + 1] = 251;
        this.bitmap.data[idx + 2] = 252;
        this.bitmap.data[idx + 3] = 255; // Ensure full opacity
      }
    });

    console.log(`Saving processed image to ${outputPath}...`);
    // Debug: Log methods to check if writeAsync exists
    // console.log('Image methods:', Object.keys(image.__proto__));
    
    // Use callback-based write if writeAsync fails or is missing
    image.write(outputPath, (err) => {
      if (err) {
        console.error('Error writing image:', err);
        process.exit(1);
      } else {
        console.log('Done.');
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    process.exit(1);
  }
}

main();
