const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/content/blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

let processed = 0;
files.forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf-8');
  
  if (content.includes('draft: true')) return;

  // Add draft: true to frontmatter
  content = content.replace(/^---/, '---\ndraft: true\nnoindex: true');
  fs.writeFileSync(p, content);
  processed++;
});

console.log(`✅ P1-1: Set ${processed} unqualified articles to draft/noindex to prevent them from polluting the site.`);
