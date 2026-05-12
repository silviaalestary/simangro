const fs = require('fs');
const path = require('path');

const seedContent = fs.readFileSync(path.join(__dirname, 'seed.ts'), 'utf8');
const imgDir = path.join(__dirname, '../public/img');

const regex = /\/img\/([a-zA-Z0-9\-\.]+\.(jpg|jpeg|png|JPG|PNG))/g;
let match;
const missing = [];

while ((match = regex.exec(seedContent)) !== null) {
    const filename = match[1];
    const filepath = path.join(imgDir, filename);
    if (!fs.existsSync(filepath)) {
        missing.push(filename);
    }
}

console.log("Missing images:", missing);
