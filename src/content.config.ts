import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const brands = defineCollection({
  loader: glob({ base: './src/content/brands', pattern: '**/*.{md,mdx}' }),
  schema: () => z.object({
    name: z.string(),
    link: z.string(), // 推广链接
    logo: z.string().optional(),
    rating: z.number().min(0).max(5).default(0),
    tags: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    targetUsers: z.string().optional(),
    
    // 价格与套餐摘要
    minPrice: z.string().optional(),
    minPriceValue: z.number().optional(), // 用于排序
    currency: z.string().default('CNY'),
    trafficInfo: z.string().optional(),
    
    // 技术参数
    nodes: z.string().optional(),
    protocols: z.array(z.string()).default([]),
    devices: z.number().optional(),
    
    // 优惠码 (可直接写字符串，如需多个可用数组)
    couponCode: z.string().optional(),
    couponDesc: z.string().optional(),
    
    // 状态
    established: z.string().optional(),
    updatedDate: z.coerce.date(),
  })
});

export const collections = { blog, brands };
