//chai-decode.js
const fs = require('fs');
console.log('# Reading', 'chai.txt');
var str = fs.readFileSync('chai.txt').toString();
var hash = "";
function isCHAI(x) {
    return ( ((x>=0xD0000) && (x<=0xDFFFD)) 
            || (x===0xEFFFC) || (x===0xEFFFD) );
}
function add(ch) {
    // If the end of a CHAI sequence, emit hash.
    if(!isCHAI(ch)) {
        if(hash !== "") console.log('# CHAI Hash: ' + hash);
        hash = "";
        return;
    }
    // Else, accumulate
    // Fixup our two exceptions
    if (ch === 0xEFFFC) ch = 0xDFFFE;
    if (ch === 0xEFFFD) ch = 0xDFFFF;
    var hashBits = ch & 0xFFFF;
    console.log(' hash bits:',hashBits.toString(16).toUpperCase());
    // accumulate as a string
    hash = hash + hashBits.toString(16).toUpperCase();
}
for(var i = 0; i < str.length; i++) {
    var ch = str.codePointAt(i);
    if(ch > 0xFFFF) {
        i++;
    }
    console.log('U+'+ch.toString(16).toUpperCase());
    add(ch);
}
add(0); // print out trailing hash