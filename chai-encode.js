// chai-encode.js
const fs = require('fs');
const crypto = require('crypto');

// base char
const base = '\u2615';

// emoji description
const description = {
    name: 'CHAI',
    "content-type": 'image/png',
    image: fs.readFileSync('chai.png').toString('base64')
};

// Write out canonical emoji description
const description_json = JSON.stringify(description);

console.log('# Writing','chai.json');
fs.writeFileSync('chai.json', description_json);

// Now, hash it
const hash = crypto.createHash('sha256')
                   .update(description_json)
                   .digest();
const hashHex = hash.toString('hex');
console.log('# SHA-256 hash:', hashHex);

const hashChars = 5;
console.log('# Going to use', hashChars,
     'CHAI chars or', (hashChars*16), 'bits.');

var outString = base;

console.log('# <U+'+base.codePointAt(0)
                        .toString(16)
                        .toUpperCase()+'> (base)');
for (var i = 0; i<hashChars; i++) {
    // get the next 16 bits
    var hashBits = (hash[(i*2)+0] << 8) | (hash[(i*2)+1]);
    // console.log('Chunk', hashBits.toString(16));
    var outPoint;
    if( hashBits >= 0xFFFE) {
        // FFFE -> EFFFC, FFFF -> EFFFD
        outPoint = (0xE0000 | hashBits) - 2; 
    } else {
        outPoint = (0xD0000 | hashBits);
    }
    console.log('# <U+'+outPoint.toString(16).toUpperCase()+'>', 
        'IMAGE HASH', hashBits.toString(16).toUpperCase());
    outString = outString + String.fromCodePoint(outPoint);
}

console.log('# Writing chai.txt');
fs.writeFileSync('chai.txt', outString);
