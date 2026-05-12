const fs = require('fs');
const path = require('path');
const https = require('https');

const speciesList = [
    { name: 'Ceriops decandra', slug: 'ceriops-decandra' },
    { name: 'Melastoma candidum', search: 'Melastoma malabathricum', slug: 'melastoma-candidum' },
    { name: 'Morinda citrifolia', slug: 'morinda-citrifolia' },
    { name: 'Pandanus odorifer', slug: 'pandanus-odorifer' },
    { name: 'Pandanus tectorius', slug: 'pandanus-tectorius' },
    { name: 'Passiflora foetida', slug: 'passiflora-foetida' },
    { name: 'Pemphis acidula', slug: 'pemphis-acidula' },
    { name: 'Pongamia pinnata', search: 'Millettia pinnata', slug: 'pongamia-pinnata' },
    { name: 'Scaevola taccada', slug: 'scaevola-taccada' },
    { name: 'Sesuvium portulacastrum', slug: 'sesuvium-portulacastrum' },
    { name: 'Stachytarpheta jamaicensis', slug: 'stachytarpheta-jamaicensis' },
    { name: 'Thespesia populnea', slug: 'thespesia-populnea' }
];

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImageForSpecies(searchName) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(searchName)}&prop=pageimages&format=json&pithumbsize=800`;
        const options = {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        };
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pageId !== '-1' && pages[pageId].thumbnail) {
                        resolve(pages[pageId].thumbnail.source);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    console.log("Fetching image URLs from Wikipedia...");
    const updates = {};
    for (const sp of speciesList) {
        await delay(500);
        const searchName = sp.search || sp.name;
        const imgUrl = await fetchImageForSpecies(searchName);
        if (imgUrl) {
            console.log(`Found image for ${sp.name}: ${imgUrl}`);
            updates[sp.slug] = imgUrl;
        } else {
            console.log(`No image found for ${sp.name}`);
        }
    }
    
    console.log("Updating seed.ts...");
    const seedPath = path.join(__dirname, 'seed.ts');
    let seedContent = fs.readFileSync(seedPath, 'utf8');
    
    for (const [slug, imgUrl] of Object.entries(updates)) {
        // Find: slug: 'ceriops-decandra', ... images: { daun: null
        const regex = new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?images:\\s*\\{\\s*daun:\\s*)null`, 'g');
        seedContent = seedContent.replace(regex, `$1'${imgUrl}'`);
    }
    
    fs.writeFileSync(seedPath, seedContent, 'utf8');
    console.log("Done updating seed.ts! Please run: npx tsx scripts/seed.ts");
}

run();
