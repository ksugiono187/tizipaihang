const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/content/brands');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

let verificationLog = '# 品牌数据核实日志 (DATA_VERIFICATION.md)\n\n';

files.forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf-8');
  
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return;
  
  let frontmatter = match[1];
  
  // Extract name and link
  const nameMatch = frontmatter.match(/name:\s*"?([^"\n]+)"?/);
  const name = nameMatch ? nameMatch[1].trim() : file.replace('.md', '');
  const linkMatch = frontmatter.match(/link:\s*([^\n]+)/);
  const link = linkMatch ? linkMatch[1].trim() : '#';
  const couponMatch = frontmatter.match(/couponCode:\s*"?([^"\n]+)"?/);
  const coupon = couponMatch ? couponMatch[1].trim() : '';

  // Extract Price
  const priceMatch = frontmatter.match(/value:\s*"?([^"\n]+)"?/); 
  // Wait, price match using generic value is risky. Let's do string manipulation.
  let priceVal = 15; // default fallback
  let priceText = '待核实';
  const minPriceBlock = frontmatter.match(/minPrice:[\s\S]*?(?=currency|trafficInfo|nodes|protocols|devices|updatedDate|---)/);
  if (minPriceBlock) {
    const valMatch = minPriceBlock[0].match(/value:\s*"?([^"\n]+)"?/);
    if (valMatch) {
       priceText = valMatch[1].trim();
       const numMatch = priceText.match(/\d+(\.\d+)?/);
       if(numMatch) priceVal = parseFloat(numMatch[0]);
    }
  }

  // Remove fake data from frontmatter
  frontmatter = frontmatter.replace(/rating:[\s\S]*?(?=peakSpeed:|tags:)/, '');
  frontmatter = frontmatter.replace(/peakSpeed:[\s\S]*?(?=tags:)/, '');
  frontmatter = frontmatter.replace(/minPriceValue:\s*\d+/g, `minPriceValue: ${priceVal}`);
  
  verificationLog += `## ${name}\n- 价格: ${priceText} (解析为 ${priceVal})\n- 测速: 已删除虚假数据\n- 评分: 已删除虚假评分\n\n`;

  const newBody = `
## 1. 品牌简介
**${name}** 是一家提供翻墙与科学上网服务的品牌。

## 2. 品牌定位
提供基础的跨境网络接入服务，适合日常网页浏览。

## 3. 价格与套餐
目前已知的基础套餐价格为 **${priceText}** (未经独立核实，请以官网最新标价为准)。

## 4. 流量对比
尚未进行横向流量性价比对比。

## 5. 节点地区
官方声称提供常规地区节点，具体覆盖情况尚未独立验证。

## 6. 支持协议
兼容常见主流协议客户端。

## 7. 设备兼容性
支持主流操作系统，具体设备限制请参考官网说明。

## 8. 已验证的服务特点
- **待核实**：暂无经过本站独立验证的突出特点。

## 9. 测速数据
尚未独立实测。

## 10. 稳定性数据
尚未独立实测。

## 11. 优点
- 暂未评估。

## 12. 缺点
- 暂未评估。

## 13. 适合用户
适合需要基础网络访问功能的用户。

## 14. 购买注意事项
建议新用户先购买最短周期的套餐进行本地网络环境测试。

## 15. 优惠码
${coupon ? `本站专属优惠码：**${coupon}**` : '暂无专属优惠码'}。

## 16. 官网跳转
<a href="${link}" target="_blank" rel="sponsored nofollow noopener noreferrer">点击访问 ${name} 官网</a>

## 17. 相关教程
- 暂未关联针对性教程。

## 18. FAQ (常见问题)
**Q: 价格和套餐会变动吗？**
A: 会，所有服务商都可能随时调整套餐，请以官网为准。

## 19. 数据来源
数据来自历史收集，当前处于**未验证**状态。我们将尽快进行真实测速。

## 20. 最后更新时间
**2026年10月9日**
`;

  // Write file
  fs.writeFileSync(p, `---\n${frontmatter}---\n${newBody}`);
});

fs.writeFileSync(path.join(__dirname, 'DATA_VERIFICATION.md'), verificationLog);
console.log('✅ P0-1: Cleaned fake data from brand markdown files and generated DATA_VERIFICATION.md');
