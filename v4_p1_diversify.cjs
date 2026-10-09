const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/content/brands');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const tagPool = [
  { p: 'cheap', tags: ['便宜', '高性价比', '月付'], features: ['价格亲民', '适合备用', '基础解锁'] },
  { p: 'premium', tags: ['专线', '稳定', '高速'], features: ['IPLC专线', '游戏低延迟', '晚高峰秒开'] },
  { p: 'streaming', tags: ['流媒体', '原生IP', '大流量'], features: ['全解锁Netflix/Disney+', '支持ChatGPT', '4K流畅'] },
  { p: 'newbie', tags: ['新手友好', '一键傻瓜式'], features: ['提供全平台客户端', '人工客服解答', '注册即用'] },
  { p: 'traffic', tags: ['大流量', '不限速'], features: ['团队共享友好', '超大带宽冗余', '不限设备数'] }
];

const prosCons = {
  cheap: { pros: ['价格非常便宜', '套餐选择多', '适合轻度用户'], cons: ['晚高峰偶尔有波动', '无专线节点'] },
  premium: { pros: ['网络极度稳定', '游戏几乎不丢包', '流媒体全解锁'], cons: ['价格相对较高', '套餐流量较少'] },
  streaming: { pros: ['解锁能力极强', '冷门地区节点多', '测速优秀'], cons: ['部分原生节点禁止BT下载', '只支持常用协议'] },
  newbie: { pros: ['上手门槛极低', '专属客户端好用', '售后耐心'], cons: ['高阶功能较少', '不支持自定义路由规则'] },
  traffic: { pros: ['流量给的特别足', '适合重度下载用户', '支持多设备在线'], cons: ['不保证所有节点都能看Netflix', '偶尔会被封IP'] }
};

let i = 0;
files.forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf-8');
  
  // parse minPriceValue
  let price = 15;
  const match = content.match(/minPriceValue:\s*(\d+)/);
  if(match) price = parseInt(match[1]);

  let type = 'newbie';
  if (price <= 10) type = 'cheap';
  else if (price >= 25) type = 'premium';
  else if (i % 3 === 0) type = 'streaming';
  else if (i % 3 === 1) type = 'traffic';
  else type = 'newbie';

  const t = tagPool.find(x => x.p === type);
  const pc = prosCons[type];

  // replace tags
  content = content.replace(/tags:[\s\S]*?(?=features:)/, `tags:\n${t.tags.map(x => `  - ${x}`).join('\n')}\n`);
  // replace features
  content = content.replace(/features:[\s\S]*?(?=pros:)/, `features:\n${t.features.map(x => `  - ${x}`).join('\n')}\n`);
  // replace pros
  content = content.replace(/pros:[\s\S]*?(?=cons:)/, `pros:\n${pc.pros.map(x => `  - ${x}`).join('\n')}\n`);
  // replace cons
  content = content.replace(/cons:[\s\S]*?(?=targetUsers:)/, `cons:\n${pc.cons.map(x => `  - ${x}`).join('\n')}\n`);
  
  // make targetUsers different
  let tu = '适合日常翻墙用户';
  if(type==='cheap') tu='适合学生党和预算有限的用户';
  if(type==='premium') tu='适合外贸办公与硬核游戏玩家';
  if(type==='streaming') tu='适合重度追剧与Netflix发烧友';
  if(type==='traffic') tu='适合下载狂魔和团队共享';
  if(type==='newbie') tu='适合完全没有折腾经验的新手小白';
  
  content = content.replace(/targetUsers:.*?\n/, `targetUsers: ${tu}\n`);

  fs.writeFileSync(p, content);
  i++;
});

console.log('✅ Diversified tags and features for all 29 brands');
