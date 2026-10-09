const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/content/brands');
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.md')) {
    let p = path.join(dir, file);
    let c = fs.readFileSync(p, 'utf-8');
    const match = c.match(/link:\s*([^\n]+)/);
    if(match) {
       const link = match[1].trim();
       c = c.replace(/\[点击访问 (.*?) 官网\]\(#\)/, `<a href="${link}" target="_blank" rel="sponsored nofollow noopener noreferrer">点击访问 $1 官网</a>`);
       fs.writeFileSync(p, c);
    }
  }
});
