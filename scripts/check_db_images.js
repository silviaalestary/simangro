const fs = require('fs');
const path = require('path');

async function check() {
    const res = await fetch('http://localhost:3000/api/species');
    const species = await res.json();
    const imgDir = path.join(__dirname, '../public');
    const missing = [];
    
    species.forEach(s => {
        if (s.images && s.images.daun) {
            const filepath = path.join(imgDir, s.images.daun);
            if (!fs.existsSync(filepath)) {
                missing.push({ slug: s.slug, path: s.images.daun });
            }
        }
    });
    
    console.log("Missing images from DB:", missing);
}

check();
