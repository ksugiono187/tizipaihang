const fs = require('fs');
['src/pages/blog/index.astro', 'src/pages/index.astro', 'src/pages/rss.xml.js'].forEach(file => {
  if (fs.existsSync(file)) {
    let c = fs.readFileSync(file, 'utf-8');
    c = c.replace(/const posts = \(await getCollection\('blog'\)\)/g, 'const posts = (await getCollection("blog")).filter(p => !p.data.draft)');
    
    // For rss.xml.js
    c = c.replace(/const posts = await getCollection\('blog'\);/g, 'const posts = (await getCollection("blog")).filter(p => !p.data.draft);');
    fs.writeFileSync(file, c);
  }
});
console.log('✅ Updated blog filtering');
