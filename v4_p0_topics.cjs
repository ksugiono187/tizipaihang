const fs = require('fs');
const path = require('path');

const content = `---
import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE } from '../../consts';

export function getStaticPaths() {
  return [
    { params: { topic: 'cheap' }, props: { name: '便宜机场', desc: '为您精选低价格、高性价比的翻墙机场。' } },
    { params: { topic: 'stable' }, props: { name: '稳定机场', desc: '以稳定性为核心指标，适合工作、学习及外贸企业。' } },
    { params: { topic: 'value' }, props: { name: '高性价比机场', desc: '价格适中且提供越级体验的服务。' } },
    { params: { topic: 'speed' }, props: { name: '高速机场', desc: '专线与优化带宽，支持 4K/8K 视频秒开。' } },
    { params: { topic: 'gaming' }, props: { name: '游戏低延迟机场', desc: '针对外服游戏优化的专线节点，极低延迟。' } },
    { params: { topic: 'streaming' }, props: { name: '流媒体机场', desc: '原生节点解锁流媒体与 AI 服务。' } },
    { params: { topic: 'newbie' }, props: { name: '新手友好机场', desc: '提供一键客户端、图文教程的新手专属机场。' } },
    { params: { topic: 'traffic' }, props: { name: '大流量机场', desc: '适合重度视频观看的超大流量机场。' } },
    { params: { topic: 'monthly' }, props: { name: '月付机场', desc: '支持短期付款、不用担心跑路的月付精品机场。' } },
  ];
}

const { name, desc } = Astro.props;
const brands = await getCollection('brands');

// 所有专题尚未建立真实细分数据，显示待评估列表
const topBrands = [...brands].slice(0, 5); // Just show a few as pending
---

<Layout title={\`\${name} 排行榜（2026）｜梯子排行\`} description={\`2026年最新\${name}推荐。\${desc} 详细对比各家优缺点。\n\`}>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold mb-6">
        2026 <span class="text-gradient">{name}</span>
      </h1>
      <p class="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
        {desc}
      </p>
      
      <div class="mt-6 inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-4 py-2 rounded-lg text-sm">
        <strong>待评估品牌</strong>：当前分类数据正在人工核实中，尚未完成正式排名。以下品牌数据未经独立验证。
      </div>
    </div>

    <div class="space-y-6">
      {topBrands.map((brand) => (
        <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 border border-white/5">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-white mb-2">{brand.data.name}</h2>
            <p class="text-gray-400 text-sm mb-4">
              标称最低价格: {brand.data.minPriceValue ? \`约 ¥\${brand.data.minPriceValue}\` : '待核实'} (未经核实)
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
               {brand.data.tags?.map((tag: string) => (
                 <span class="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">{tag}</span>
               ))}
            </div>
          </div>
          <div class="w-full md:w-auto flex flex-col gap-3 shrink-0">
             <a href={\`/brands/\${brand.id}\`} class="px-6 py-2 glass-card hover:bg-white/10 text-white font-medium rounded-lg text-center transition-colors">
               查看核实进度
             </a>
             {brand.data.link && (
               <a href={brand.data.link} target="_blank" rel="sponsored nofollow noopener noreferrer" class="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-center transition-colors">
                 直达官网
               </a>
             )}
          </div>
        </div>
      ))}
    </div>
  </div>
</Layout>
`;

fs.writeFileSync(path.join(__dirname, 'src/pages/topics/[topic].astro'), content);
console.log('✅ P0-2: Fixed topics sorting and ranking logic.');
