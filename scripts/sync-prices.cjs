const https = require('https');
const fs = require('fs');
const path = require('path');

const URL = 'https://jichang-tuijian.org/';
const BRANDS_DIR = path.join(__dirname, '../src/content/brands');

https.get(URL, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ 网页数据拉取成功，开始解析...');
    
    const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/g;
    let match;
    const extractedData = [];
    
    while ((match = articleRegex.exec(data)) !== null) {
      const articleHtml = match[1];
      const nameMatch = articleHtml.match(/<h3[^>]*>([^<]+)<\/h3>/);
      const priceMatch = articleHtml.match(/<span[^>]*>起步价格<\/span><span[^>]*title="([^"]+)"[^>]*>/);
      const trafficMatch = articleHtml.match(/<span[^>]*>基础流量<\/span><span[^>]*>([^<]+)<\/span>/);
      const couponMatch = articleHtml.match(/专属优惠码<\/span><\/div><div[^>]*>([a-zA-Z0-9_]+)</i);
      
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const priceStr = priceMatch ? priceMatch[1] : '待核实';
        const trafficStr = trafficMatch ? trafficMatch[1] : '待核实';
        const couponStr = couponMatch ? couponMatch[1] : '';
        
        extractedData.push({
          name: name,
          priceStr: priceStr,
          minPrice: priceStr,
          trafficStr: trafficStr,
          couponCode: couponStr
        });
      }
    }
    
    const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.md'));
    let updateCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(BRANDS_DIR, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      
      const nameMatch = content.match(/name:\s*['"]?([^'"\n]+)['"]?/);
      if (!nameMatch) return;
      const localName = nameMatch[1];
      
      // 模糊匹配
      const matchedData = extractedData.find(d => localName.includes(d.name) || d.name.includes(localName));
      
      if (matchedData) {
        // 更新 frontmatter
        content = content.replace(/minPrice:\s*["']?.*?["']?\n/, `minPrice: "${matchedData.minPrice}"\n`);
        content = content.replace(/trafficInfo:\s*["']?.*?["']?\n/, `trafficInfo: "${matchedData.trafficStr}"\n`);
        
        if (matchedData.couponCode) {
          // Check if couponCode exists in frontmatter
          if (content.match(/couponCode:\s*["']?.*?["']?\n/)) {
            content = content.replace(/couponCode:\s*["']?.*?["']?\n/, `couponCode: "${matchedData.couponCode}"\n`);
          } else {
            // Insert it after name
            content = content.replace(/(name:.*?)\n/, `$1\ncouponCode: "${matchedData.couponCode}"\n`);
          }
        }
        
        // 更新日期
        const today = new Date().toISOString().split('T')[0];
        content = content.replace(/updatedDate:\s*["']?.*?["']?\n/, `updatedDate: "${today}"\n`);

        fs.writeFileSync(filePath, content);
        console.log(`✅ 已同步: ${localName} -> 价格: ${matchedData.minPrice}, 流量: ${matchedData.trafficStr}, 优惠码: ${matchedData.couponCode || '无'}`);
        updateCount++;
      }
    });
    
    console.log(`🎉 任务完成！共更新了 ${updateCount} 个品牌的数据。`);
  });
}).on('error', (err) => {
  console.error('❌ 拉取失败: ', err.message);
});
