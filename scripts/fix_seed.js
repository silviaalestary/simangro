const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed.ts');
let seedContent = fs.readFileSync(seedPath, 'utf8');

const updates = [
    { slug: 'ceriops-decandra', image: '/img/ceriops-decandra.png' },
    { slug: 'melastoma-candidum', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Melastoma_malabathricum_blossom.jpg/960px-Melastoma_malabathricum_blossom.jpg' },
    { slug: 'morinda-citrifolia', image: '/img/morinda-citrifolia.jpg' },
    { slug: 'pandanus-odorifer', image: '/img/pandanus-odorifer.JPG' },
    { slug: 'pandanus-tectorius', image: '/img/pandanus-tectorius.jpg' },
    { slug: 'passiflora-foetida', image: '/img/passiflora-foetida.jpg' },
    { slug: 'pemphis-acidula', image: '/img/pemphis-acidula.jpg' },
    { slug: 'pongamia-pinnata', image: null },
    { slug: 'rhizophora-mucronata', image: '/img/mangrove3.JPG' },
    { slug: 'scaevola-taccada', image: '/img/scaevola-taccada.jpg' },
    { slug: 'sesuvium-portulacastrum', image: '/img/sesuvium-portulacastrum.jpg' },
    { slug: 'stachytarpheta-jamaicensis', image: '/img/stachytarpheta-jamaicensis.jpg' },
    { slug: 'terminalia-catappa', image: '/img/mangrove4.JPG' },
    { slug: 'thespesia-populnea', image: '/img/thespesia-populnea.jpg' }
];

for (const { slug, image } of updates) {
    // We need to replace the images line strictly inside the block for the given slug.
    // Let's find the index of the slug:
    const slugIdx = seedContent.indexOf(`slug: '${slug}'`);
    if (slugIdx === -1) {
        console.error(`Slug not found: ${slug}`);
        continue;
    }
    const nextSlugIdx = seedContent.indexOf(`slug:`, slugIdx + 1);
    
    // The block for this slug is between slugIdx and nextSlugIdx (or end of file)
    const blockEndIdx = nextSlugIdx === -1 ? seedContent.length : nextSlugIdx;
    
    let block = seedContent.substring(slugIdx, blockEndIdx);
    
    // Find the images line in this block
    const imagesRegex = /images:\s*\{[^}]*\}/;
    const match = block.match(imagesRegex);
    
    if (match) {
        const replacement = image ? `images: { daun: '${image}', bunga: null, buah: null }` : `images: { daun: null, bunga: null, buah: null }`;
        block = block.replace(imagesRegex, replacement);
        seedContent = seedContent.substring(0, slugIdx) + block + seedContent.substring(blockEndIdx);
    } else {
        console.error(`Images block not found for slug: ${slug}`);
    }
}

fs.writeFileSync(seedPath, seedContent, 'utf8');
console.log("Successfully updated seed.ts");
