const fs = require('fs');
const path = require('path');

// Fix brands/index.astro
const indexP = path.join(__dirname, 'src/pages/brands/index.astro');
let indexC = fs.readFileSync(indexP, 'utf-8');
indexC = indexC.replace(/const sortedBrands = brands.sort\(.*?\);/, 'const sortedBrands = brands.sort((a, b) => (a.data.minPriceValue || 0) - (b.data.minPriceValue || 0));');
indexC = indexC.replace(/<span class="bg-white\/10 text-yellow-400.*?<\/span>/, '');
fs.writeFileSync(indexP, indexC);

// Fix brands/[...slug].astro
const slugP = path.join(__dirname, 'src/pages/brands/[...slug].astro');
let slugC = fs.readFileSync(slugP, 'utf-8');
// Remove rating UI
slugC = slugC.replace(/<div class="text-3xl font-bold text-yellow-400 mb-1">\s*\{brand\.data\.rating\?.value\?.toFixed\(1\)\}\s*<\/div>/g, '<div class="text-3xl font-bold text-gray-400 mb-1">-</div>');
slugC = slugC.replace(/<div class="text-3xl font-bold text-white mb-1">\s*\{brand\.data\.peakSpeed\?.value\}\s*<\/div>/g, '<div class="text-3xl font-bold text-gray-400 mb-1">-</div>');
slugC = slugC.replace(/<span>综合评分<\/span>/g, '<span>独立评分(待测)</span>');
slugC = slugC.replace(/<span>晚高峰测速<\/span>/g, '<span>晚高峰测速(待测)</span>');
// Remove fake schema rating
slugC = slugC.replace(/"aggregateRating":\s*\{[^}]+\},?/g, '');
fs.writeFileSync(slugP, slugC);

console.log('✅ P0-4: Removed fake rating UI and schema');
