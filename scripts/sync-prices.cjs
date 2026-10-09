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
    
    // 匹配 <article> 块来分割每个品牌
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
        const priceStr = priceMatch ? priceMatch[1] : null;
        const trafficStr = trafficMatch ? trafficMatch[1] : null;
        
        let minPrice = '待核实';
        if (priceStr) {
          // 提取数字
          const numMatch = priceStr.match(/\d+(\.\d+)?/);
          if (numMatch) minPrice = numMatch[0];
        }
        
        extractedData.push({
          name: name,
          priceStr: priceStr,
          minPrice: minPrice,
          trafficStr: trafficStr
        });
      }
    }
    
    console.log(`🔍 成功从目标网站提取到 ${extractedData.length} 个品牌的数据`);
    
    // 遍历本地文件并更新
    const files = fs.readdirSync(BRANDS_DIR).filter(f => f.endsWith('.md'));
    let updateCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(BRANDS_DIR, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // 提取本文件的 name
      const nameMatch = content.match(/name:\s*['"]?([^'"\n]+)['"]?/);
      if (!nameMatch) return;
      const localName = nameMatch[1];
      
      // 在提取的数据中寻找匹配项 (模糊匹配，例如 "微风网络 Breezenet" 和 "微风网络")
      const matchedData = extractedData.find(d => localName.includes(d.name) || d.name.includes(localName));
      
      if (matchedData) {
        // 更新 minPrice
        if (matchedData.minPrice !== '待核实') {
          content = content.replace(/(minPrice:\s*)\d+(\.\d+)?/, `$1${matchedData.minPrice}`);
          
          // 我们也可以更新 Markdown 正文里的流量和价格
          content = content.replace(/套餐起步价格：.*?\n/, `套餐起步价格：**¥${matchedData.minPrice}/月起**\n`);
          if (matchedData.trafficStr) {
            content = content.replace(/基础流量：.*?\n/, `基础流量：**${matchedData.trafficStr}**\n`);
          }
          
          // 记录最后核实时间
          const today = new Date().toISOString().split('T')[0];
          content = content.replace(/最后核实时间：.*?\n/, `最后核实时间：**${today}**\n`);
          content = content.replace(/(updatedDate:\s*)['"]?[^'"\n]+['"]?/, `$1"${today}"`);
          
          fs.writeFileSync(filePath, content);
          console.log(`✅ 已同步: ${localName} -> 价格: ${matchedData.minPrice}, 流量: ${matchedData.trafficStr}`);
          updateCount++;
        }
      }
    });
    
    console.log(`🎉 任务完成！共更新了 ${updateCount} 个品牌的数据。`);
  });
}).on('error', (err) => {
  console.error('❌ 拉取失败: ', err.message);
});
