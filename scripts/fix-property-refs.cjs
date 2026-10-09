const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../src/pages');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk(PAGES_DIR, (filePath) => {
  if (filePath.endsWith('.astro')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // rating
    content = content.replace(/data\.rating(?![\.\?])/g, "data.rating?.value");
    content = content.replace(/brand\.data\.rating(?![\.\?])/g, "brand.data.rating?.value");
    
    // peakSpeed
    content = content.replace(/data\.peakSpeed(?![\.\?])/g, "data.peakSpeed?.value");
    content = content.replace(/brand\.data\.peakSpeed(?![\.\?])/g, "brand.data.peakSpeed?.value");

    // minPrice
    content = content.replace(/data\.minPrice(?![\.\?])/g, "data.minPrice?.value");
    content = content.replace(/brand\.data\.minPrice(?![\.\?])/g, "brand.data.minPrice?.value");

    // trafficInfo
    content = content.replace(/data\.trafficInfo(?![\.\?])/g, "data.trafficInfo?.value");
    content = content.replace(/brand\.data\.trafficInfo(?![\.\?])/g, "brand.data.trafficInfo?.value");

    // nodes
    content = content.replace(/data\.nodes(?![\.\?])/g, "data.nodes?.value");
    content = content.replace(/brand\.data\.nodes(?![\.\?])/g, "brand.data.nodes?.value");

    // devices
    content = content.replace(/data\.devices(?![\.\?])/g, "data.devices?.value");
    content = content.replace(/brand\.data\.devices(?![\.\?])/g, "brand.data.devices?.value");

    fs.writeFileSync(filePath, content);
  }
});

console.log('✅ 组件代码中的数据引用已修正！');
