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

const metricSchema = z.object({
  value: z.union([z.string(), z.number()]).optional(),
  unit: z.string().optional(),
  sourceUrl: z.string().optional(),
  sourceType: z.string().optional(),
  verifiedAt: z.coerce.date().optional(),
  verificationStatus: z.enum(['verified', 'user_provided', 'historical', 'unverified', 'unavailable']).default('unverified'),
  notes: z.string().optional()
});

const brands = defineCollection({
  loader: glob({ base: './src/content/brands', pattern: '**/*.{md,mdx}' }),
  schema: () => z.object({
    name: z.string(),
    link: z.string(), // 推广链接
    logo: z.string().optional(),
    
    // 基础评分改为新的验证数据结构
    rating: metricSchema.optional(),
    peakSpeed: metricSchema.optional(),
    stability: metricSchema.optional(),

    tags: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    targetUsers: z.string().optional(),
    
    // 价格与套餐
    minPrice: metricSchema.optional(),
    minPriceValue: z.number().optional(), // 用于排序
    currency: z.string().default('CNY'),
    trafficInfo: metricSchema.optional(),
    
    // 技术参数
    nodes: metricSchema.optional(),
    protocols: z.array(z.string()).default([]),
    devices: metricSchema.optional(),
    
    // 优惠码
    couponCode: z.string().optional(),
    couponDesc: z.string().optional(),

    // 状态
    established: z.string().optional(),
    updatedDate: z.coerce.date(),
  })
});

export const collections = { blog, brands };
