const fs = require('fs');
const path = require('path');
const https = require('https');

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: { 'User-Agent': 'SimangroBot/1.0' }
        };
        https.get(url, options, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => file.close(resolve));
            } else if (response.statusCode === 301 || response.statusCode === 302) {
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

function fetchImageForSpecies(speciesName) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(speciesName)}&prop=pageimages&format=json&pithumbsize=800`;
        https.get(url, { headers: { 'User-Agent': 'SimangroBot/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                const pages = json.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pageId !== '-1' && pages[pageId].thumbnail) {
                    resolve(pages[pageId].thumbnail.source);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    const sp = { name: 'Pongamia pinnata', slug: 'pongamia-pinnata' };
    const imgUrl = await fetchImageForSpecies(sp.name);
    if (imgUrl) {
        console.log(`Found: ${imgUrl}`);
        const dest = path.join(__dirname, '../public/img', `${sp.slug}.jpg`);
        await downloadImage(imgUrl, dest);
        console.log(`Downloaded to ${dest}`);
    } else {
        console.log(`Not found for ${sp.name}`);
    }
}
run();
