const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/content/blog');
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.md')) {
    let p = path.join(dir, file);
    let c = fs.readFileSync(p, 'utf-8');
    c = c.replace(/([^\n])---/, '$1\n---'); // first closing ---
    fs.writeFileSync(p, c);
  }
});
console.log('Fixed newlines');
