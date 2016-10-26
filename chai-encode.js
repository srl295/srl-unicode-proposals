// chai-encode.js
const fs = require('fs');
const crypto = require('crypto');

// base char
const base = '\u2615'; // hot beverage

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

const hashChars = 5*4;
console.log('# Going to use', hashChars,
     'CHAI chars or', (hashChars*4), 'bits.');

var outString = base;

console.log('# <U+'+base.codePointAt(0)
                        .toString(16)
                        .toUpperCase()+'> (base)');

const chaiMod = '\uFFF8';

console.log('# <U+'+chaiMod.codePointAt(0)
                        .toString(16)
                        .toUpperCase()+' TAG CODED HASH MODIFIER>');
for (var i = 0; i<hashChars; i++) {
    // // get the next 4 bits
    // console.log('i',i,'h',hash[i]);
    // var hashBits = (hash[(i/2)+0]);
    // console.log('Chunk0 ', hashBits.toString(8));
    // if ( (i % 2) == 0 ) {
    //     hashBits = hashBits & 0x0F;
    // } else {
    //     hashBits = (hashBits >> 4) & 0x0F;
    // }
    // // var hashBits = (hash[(i*2)+0] << 8) | (hash[(i*2)+1]);
    // console.log('Chunk', hashBits.toString(4));
    // var outPoint;
    // if( hashBits >= 0xFFFE) {
    //     // FFFE -> EFFFC, FFFF -> EFFFD
    //     outPoint = (0xE0000 | hashBits) - 2; 
    // } else {
    //     outPoint = (0xD0000 | hashBits);
    // }
    const chunk = hashHex[i];
    var xname;
    if(chunk >= '0' && chunk <= '9') {
        outPoint = 0xE0030 + (chunk-'0');
        xname = '             TAG DIGIT';
    } else {
        outpoint = 0xE0061 + (chunk-'a');
        xname = 'TAG LATIN SMALL LETTER';
    }
    console.log('# <U+'+outPoint.toString(16).toUpperCase(), 
        xname+' '+chunk+'>');
    outString = outString + String.fromCodePoint(outPoint);
}

const tagEnd = '\uE007F';

console.log('# <U+'+tagEnd.codePointAt(0)
                        .toString(16)
                        .toUpperCase()+' CANCEL TAG>');


console.log('# Writing chai.txt');
fs.writeFileSync('chai.txt', outString);
