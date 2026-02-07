const Jimp = require('jimp');
console.log('Type of module export:', typeof Jimp);
console.log('Keys of module export:', Object.keys(Jimp));
if (Jimp.Jimp) {
    console.log('Jimp.Jimp exists');
}
if (Jimp.read) {
    console.log('Jimp.read exists');
}
try {
    const { Jimp: JimpClass } = require('jimp');
    console.log('Destructured Jimp type:', typeof JimpClass);
    if (JimpClass && JimpClass.read) console.log('JimpClass.read exists');
} catch (e) {
    console.log('Destructure failed');
}
