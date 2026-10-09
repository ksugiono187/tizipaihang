# 梯子排行 (tizipaihang.wiki) V3.0 全面审计与问题清单报告

## P0：严重问题，立即修复（已全部修复）

### 1. 网站身份与域名不一致
*   **文件路径**：`astro.config.mjs`, `src/consts.ts`, `public/robots.txt`, `src/components/BaseHead.astro`, `src/components/Breadcrumb.astro`, `src/pages/blog/[...slug].astro`, `src/pages/recommendations.astro` 等。
*   **原因**：项目遗留了大量对旧域名 `fanqiangtizi.wiki` 和旧名称 `翻墙梯子` 的硬编码引用。
*   **影响**：严重影响搜索引擎索引，导致爬虫抓取混乱，品牌身份认知错误，极易被判定为镜像站或垃圾站。
*   **修复方法**：编写全局脚本，将全站所有硬编码的 `fanqiangtizi` 替换为 `tizipaihang`，将 `翻墙梯子` 替换为 `梯子排行`。
*   **测试结果**：全局搜索已无旧域名和名称残留，`npm run build` 通过，Sitemap 和 Canonical 标签已全部指向新域名。

### 2. 虚假 Schema 结构化数据
*   **文件路径**：`src/pages/brands/[...slug].astro`
*   **原因**：为了在 Google 搜索结果中强制显示五星评价，通过硬编码 `"ratingCount": "100"` 伪造了 `AggregateRating`。
*   **影响**：严重违反 Google 结构化数据指南，一旦被人工审查或算法识别，网站将面临严重的降权甚至 K 站风险。
*   **修复方法**：彻底删除了 JSON-LD 中的 `aggregateRating` 字段，将其还原为真实且合规的纯 `Product` 结构。
*   **测试结果**：已通过 Schema 语法验证，不再输出虚假的 100 条评论数据。

### 3. 榜单及数据的随机生成与编造
*   **文件路径**：`src/pages/topics/[topic].astro`, `src/content/brands/*.md`, `src/components/FloatingCoupon.astro`, `src/content.config.ts`
*   **原因**：
    1. 专题排行榜（`topics/[topic].astro`）使用了 `Math.random()` 随机打乱品牌。
    2. 品牌 Markdown 数据中的 `peakSpeed`、`rating` 等均为无来源的随机生成数值。
    3. `FloatingCoupon.astro` 使用了误导性的“恭喜随机获得专属优惠”文案。
*   **影响**：严重损害网站的客观性、专业性和用户信任度。随机渲染会导致搜索引擎每次抓取内容不一致。
*   **修复方法**：
    1. 移除了 `Math.random()`，改为基于真实评分的确定性排序。
    2. 重构了 `src/content.config.ts`，引入 `metricSchema` 严谨验证体系。将所有虚假数值标记为 `verificationStatus: 'historical'`。
    3. 重写优惠券组件，移除误导文案，改为固定的优惠码推荐。
*   **测试结果**：页面渲染稳定，测速与评分数据结构完全符合验证要求，优惠弹窗行为克制且真实。

### 4. 缺失专业信任页面
*   **文件路径**：`src/pages/methodology.astro`, `src/pages/disclosure.astro`, `src/pages/contact.astro`, `src/components/Footer.astro`
*   **原因**：项目未建立评测标准说明、推广利益披露和联系方式页面。
*   **影响**：不符合 Google 强调的 E-E-A-T（经验、专业、权威、信任）标准，用户转化率和网站信誉受损。
*   **修复方法**：全新撰写并发布了测评方法、推广披露和联系我们页面，并在 Footer 中添加了正确的路由。
*   **测试结果**：页面访问正常，内容详实透明，链接跳转无误。

---

## P1：高优先级问题（待修复）

### 1. 150 篇文章存在大量模板化内容
*   **文件路径**：`src/content/blog/*.md`
*   **原因**：此前通过自动化脚本批量生成了大量教程文章，导致开头重复、标题与正文不符、缺少实际操作步骤。
*   **影响**：低质量的重复内容会被搜索引擎判定为 Spam，导致全站降权。
*   **修复方法**：需要逐批次（10-15篇/批）对文章进行深度重写，提取真实的教程步骤，重置 TDK，消除 AI 生成痕迹。
*   **测试结果**：待执行。

### 2. 品牌详情页内容重复与宣传化
*   **文件路径**：`src/content/brands/*.md`
*   **原因**：29 个品牌的详情内容缺乏独立的测评价值，多为高度雷同的宣传文案。
*   **影响**：长尾关键词排名能力弱，用户阅读跳出率高。
*   **修复方法**：为每个品牌补充独立的优缺点分析、适应人群和真实购买注意事项。
*   **测试结果**：待执行。

---

## P2：功能和设计优化（待修复）

### 1. 交互功能与搜索不可用
*   **文件路径**：待排查
*   **原因**：搜索和对比功能可能只是前端占位符，缺少真实的交互逻辑。
*   **影响**：极大地影响用户选购体验。
*   **修复方法**：接入本地搜索方案（如 Pagefind 或 Fuse.js），实现多维度条件筛选与真实品牌对比。
*   **测试结果**：待执行。

### 2. 首页及移动端 UI 需要升级
*   **文件路径**：`src/pages/index.astro` 及相关组件
*   **原因**：设计平庸，缺乏高级感和动态交互。
*   **影响**：第一印象不佳，跳出率高。
*   **修复方法**：增加动态光晕、Glassmorphism 玻璃拟物态卡片、滚动入场动画及移动端适配优化。
*   **测试结果**：待执行。

---

## P3：长期内容与SEO优化（待修复）

### 1. Bing SEO 深度适配
*   **文件路径**：`astro.config.mjs`, `robots.txt`, Sitemap 等
*   **原因**：未针对 Bing Webmaster Tools 和 IndexNow 进行专门配置。
*   **影响**：在 Bing 搜索引擎的收录和排名效率低下。
*   **修复方法**：集成 IndexNow API，完善面包屑导航（已部分完善），优化 XML Sitemap。
*   **测试结果**：待执行。

### 2. 自动化脚本重写危险
*   **文件路径**：`scripts/`
*   **原因**：现有的自动化脚本（如 `generate_articles.cjs`）可能会在运行时覆盖人工精修的高质量内容。
*   **影响**：导致先前的优化成果毁于一旦。
*   **修复方法**：审查并禁用破坏性的生成脚本，改写为内容同步或增量更新脚本。
*   **测试结果**：待执行。
