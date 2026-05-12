const fs = require('fs');
const path = require('path');
const https = require('https');

const speciesList = [
    { name: 'Ceriops decandra', slug: 'ceriops-decandra' },
    { name: 'Melastoma candidum', slug: 'melastoma-candidum' },
    { name: 'Morinda citrifolia', slug: 'morinda-citrifolia' },
    { name: 'Pandanus odorifer', slug: 'pandanus-odorifer' },
    { name: 'Pandanus tectorius', slug: 'pandanus-tectorius' },
    { name: 'Passiflora foetida', slug: 'passiflora-foetida' },
    { name: 'Pemphis acidula', slug: 'pemphis-acidula' },
    { name: 'Pongamia pinnata', slug: 'pongamia-pinnata' },
    { name: 'Scaevola taccada', slug: 'scaevola-taccada' },
    { name: 'Sesuvium portulacastrum', slug: 'sesuvium-portulacastrum' },
    { name: 'Stachytarpheta jamaicensis', slug: 'stachytarpheta-jamaicensis' },
    { name: 'Thespesia populnea', slug: 'thespesia-populnea' }
];

const imgDir = path.join(__dirname, '../public/img');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: { 'User-Agent': 'SimangroBot/1.0 (https://github.com/example/simangro; contact@example.com)' }
        };
        https.get(url, options, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303) {
                downloadImage(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(`Failed to download ${url}: ${response.statusCode}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err.message);
        });
    });
}

async function fetchImageForSpecies(speciesName) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(speciesName)}&prop=pageimages&format=json&pithumbsize=800`;
        const options = {
            headers: { 'User-Agent': 'SimangroBot/1.0 (https://github.com/example/simangro; contact@example.com)' }
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
    console.log("Fetching images from Wikipedia...");
    const updates = {};
    for (const sp of speciesList) {
        console.log(`Searching for ${sp.name}...`);
        await delay(1000); // 1 second delay
        const imgUrl = await fetchImageForSpecies(sp.name);
        if (imgUrl) {
            console.log(`Found image: ${imgUrl}`);
            const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
            const filename = `${sp.slug}${ext}`;
            const dest = path.join(imgDir, filename);
            try {
                await delay(1000); // 1 second delay
                await downloadImage(imgUrl, dest);
                console.log(`Downloaded ${filename}`);
                updates[sp.slug] = `/img/${filename}`;
            } catch (e) {
                console.error(`Failed to download for ${sp.name}:`, e);
            }
        } else {
            console.log(`No image found for ${sp.name}`);
        }
    }
    
    // Now update seed.ts
    console.log("Updating seed.ts...");
    const seedPath = path.join(__dirname, 'seed.ts');
    let seedContent = fs.readFileSync(seedPath, 'utf8');
    
    for (const [slug, imgPath] of Object.entries(updates)) {
        // Regex to find the images block for this slug
        // It looks like: slug: 'ceriops-decandra', ... images: { daun: null, bunga: null, buah: null }
        const regex = new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?images:\\s*\\{\\s*daun:\\s*)null`, 'g');
        seedContent = seedContent.replace(regex, `$1'${imgPath}'`);
    }
    
    fs.writeFileSync(seedPath, seedContent, 'utf8');
    console.log("Done updating seed.ts! Please run: npx tsx scripts/seed.ts");
}

run();
