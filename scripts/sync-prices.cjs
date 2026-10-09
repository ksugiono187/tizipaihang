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
      
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const priceStr = priceMatch ? priceMatch[1] : '待核实';
        const trafficStr = trafficMatch ? trafficMatch[1] : '待核实';
        
        extractedData.push({
          name: name,
          priceStr: priceStr,
          minPrice: priceStr, // Keep the full string like "¥8/月起" or "约 ¥7/月起" or just the number if we want
          trafficStr: trafficStr
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
        // 更新 frontmatter 中的 minPrice (处理可能是数字或 "待核实" 的情况)
        content = content.replace(/minPrice:\s*["']?.*?["']?\n/, `minPrice: "${matchedData.minPrice}"\n`);
        
        // 更新 trafficInfo
        content = content.replace(/trafficInfo:\s*["']?.*?["']?\n/, `trafficInfo: "${matchedData.trafficStr}"\n`);
        
        // 更新日期
        const today = new Date().toISOString().split('T')[0];
        content = content.replace(/updatedDate:\s*["']?.*?["']?\n/, `updatedDate: "${today}"\n`);
        
        // 正文中替换
        content = content.replace(/\*数据待核实。请前往官网查看最新价格。\*/, `**起步套餐价格：** ${matchedData.minPrice}`);
        content = content.replace(/\*数据待核实。\*/, `**基础套餐流量：** ${matchedData.trafficStr}`);

        fs.writeFileSync(filePath, content);
        console.log(`✅ 已同步: ${localName} -> 价格: ${matchedData.minPrice}, 流量: ${matchedData.trafficStr}`);
        updateCount++;
      }
    });
    
    console.log(`🎉 任务完成！共更新了 ${updateCount} 个品牌的数据。`);
  });
}).on('error', (err) => {
  console.error('❌ 拉取失败: ', err.message);
});
