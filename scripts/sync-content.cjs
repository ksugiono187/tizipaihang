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
    console.log('✅ 开始提取正文内容...');
    
    const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/g;
    let match;
    const extractedData = [];
    
    while ((match = articleRegex.exec(data)) !== null) {
      const articleHtml = match[1];
      const nameMatch = articleHtml.match(/<h3[^>]*>([^<]+)<\/h3>/);
      const reasonMatch = articleHtml.match(/<strong>推荐理由[：:]?<\/strong>\s*([^<]+)<\/p>/);
      const coreReasonMatch = articleHtml.match(/<strong>核心原因[：:]?<\/strong>\s*([^<]+)<\/p>/);
      
      const features = [];
      const featureRegex = /<li[^>]*>.*?<span>(.*?)<\/span><\/li>/g;
      let fMatch;
      while ((fMatch = featureRegex.exec(articleHtml)) !== null) {
        features.push(fMatch[1]);
      }
      
      if (nameMatch) {
        const name = nameMatch[1].trim();
        extractedData.push({
          name: name,
          reason: reasonMatch ? reasonMatch[1].trim() : '',
          coreReason: coreReasonMatch ? coreReasonMatch[1].trim() : '',
          features: features
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
      
      const matchedData = extractedData.find(d => localName.includes(d.name) || d.name.includes(localName));
      
      if (matchedData) {
        // 安全分离 frontmatter 和 body
        // frontmatter 总是以 --- 开头，以 --- 结尾
        const parts = content.split(/^---\s*$/m);
        // parts[0] 会是空字符串（或可能包含前面的空格）
        // parts[1] 是 frontmatter
        // parts[2] 及之后是正文
        if (parts.length >= 3) {
          const frontmatter = '---\n' + parts[1].trim() + '\n---\n';
          const originalBody = parts.slice(2).join('---');

          let newBody = `
## 品牌概览
${matchedData.reason || `${matchedData.name} 是一家优质的翻墙机场，提供高速、稳定的网络加速服务。`}

## 核心优势与特点
${matchedData.coreReason || '该机场在特定场景下提供出色的表现，受到众多用户的喜爱。'}

**核心亮点：**
${matchedData.features.length > 0 ? matchedData.features.map(f => `- ${f}`).join('\n') : '- 节点覆盖广泛\n- 支持多种常见协议'}

## 测速与稳定性表现
全网节点响应速度处于第一梯队，能够提供无缝的流媒体解锁与游戏加速体验。晚高峰期间，其优质的专线带宽依然能保持极高的可用率与极低的丢包率，日常使用完全可以做到秒开4K甚至8K视频。

## 综合购买建议
对于当前寻找主力梯子的用户，${matchedData.name} 提供了无可挑剔的性价比与稳定性。无论您是外贸办公、学术研究、还是重度流媒体发烧友，都可以将其作为首选。
`;

          // 提取原有的价格和流量保留在末尾
          let priceMatch = originalBody.match(/\*\*起步套餐价格：\*\*\s*(.+)/);
          let trafficMatch = originalBody.match(/\*\*基础套餐流量：\*\*\s*(.+)/);
          
          if (priceMatch || trafficMatch) {
            newBody += `\n## 套餐参数回顾\n`;
            if (priceMatch) newBody += `- **起步套餐价格：** ${priceMatch[1]}\n`;
            if (trafficMatch) newBody += `- **基础套餐流量：** ${trafficMatch[1]}\n`;
          }

          fs.writeFileSync(filePath, frontmatter + newBody);
          console.log(`✅ 已同步内容: ${localName}`);
          updateCount++;
        }
      }
    });
    
    console.log(`🎉 任务完成！共更新了 ${updateCount} 个品牌的内容。`);
  });
}).on('error', (err) => {
  console.error('❌ 拉取失败: ', err.message);
});
