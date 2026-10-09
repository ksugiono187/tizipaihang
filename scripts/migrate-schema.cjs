const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const BRANDS_DIR = path.join(__dirname, '../src/content/brands');
const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(BRANDS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return;

  const doc = yaml.parse(match[1]);
  const body = match[2];

  // Helper to migrate flat value to metricSchema
  const migrateToMetric = (val) => {
    if (val === undefined || val === null) return undefined;
    return {
      value: val,
      verificationStatus: 'historical',
      notes: '旧版数据，尚未核实'
    };
  };

  // Convert fields
  if (doc.rating) {
    doc.rating = migrateToMetric(doc.rating);
  }
  if (doc.peakSpeed) {
    doc.peakSpeed = migrateToMetric(doc.peakSpeed);
  }
  if (doc.minPrice && typeof doc.minPrice === 'string') {
    doc.minPrice = migrateToMetric(doc.minPrice);
  }
  if (doc.trafficInfo && typeof doc.trafficInfo === 'string') {
    doc.trafficInfo = migrateToMetric(doc.trafficInfo);
  }
  if (doc.nodes && typeof doc.nodes === 'string') {
    doc.nodes = migrateToMetric(doc.nodes);
  }
  if (doc.devices && typeof doc.devices === 'number') {
    doc.devices = migrateToMetric(doc.devices);
  }

  const newFrontmatter = yaml.stringify(doc);
  const newContent = `---\n${newFrontmatter}---\n${body}`;
  fs.writeFileSync(filePath, newContent);
});

console.log('✅ 迁移完成！');
