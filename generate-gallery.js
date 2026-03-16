const fs = require('fs');
const path = require('path');

const photosDir = './images';
const outputFile = './photos-data.js';

if (!fs.existsSync(photosDir)) {
    console.error(`❌ Dossier ${photosDir} non trouvé`);
    process.exit(1);
}

const files = fs.readdirSync(photosDir);

const photos = files
    .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
    .map(file => {
        const cleanName = path.parse(file).name;
        
        const categories = {
            'archives': 'Archives & Documentation',
            'archivistique': 'Archives & Documentation',
            'communication': 'Communication',
            'com': 'Communication',
            'event': 'Événement',
            'evenement': 'Événement',
            'mission': 'Mission terrain',
            'benin': 'Mission Bénin',
            'canada': 'Mission Canada',
            'formation': 'Formation',
            'atelier': 'Atelier & Formation',
            'exposition': 'Exposition',
            'vernissage': 'Vernissage',
            'conference': 'Conférence',
            'reportage': 'Reportage'
        };
        
        let category = 'Documentation';
        let title = cleanName;
        
        const firstPart = cleanName.split(/[_-]/)[0].toLowerCase();
        if (categories[firstPart]) {
            category = categories[firstPart];
            title = cleanName.substring(firstPart.length + 1);
        }
        
        title = title.replace(/[_-]/g, ' ');
        title = title.replace(/([A-Z])/g, ' $1').trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
        
        if (!title || title.length < 2) {
            title = 'Documentation professionnelle';
        }
        
        return {
            src: `${photosDir}/${file}`,
            title: title,
            category: category
        };
    });

photos.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.title.localeCompare(b.title);
});

const output = `// Auto-généré le ${new Date().toLocaleString('fr-FR')}
const portfolioPhotos = ${JSON.stringify(photos, null, 2)};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initPhotoGallery === 'function') {
        initPhotoGallery(portfolioPhotos);
    }
});
`;

fs.writeFileSync(outputFile, output);
console.log(`✅ ${photos.length} documents indexés`);
