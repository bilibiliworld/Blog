import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categories } from './config/taxonomy';
import { isoDateTimePattern, slugPattern } from './lib/content-model';

function isCalendarDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const [, hour, minute, second] = value.match(/T(\d{2}):(\d{2}):(\d{2})/) ?? [];
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && Number(hour) < 24 && Number(minute) < 60 && Number(second) < 60;
}

const dateTime = z.string().regex(isoDateTimePattern, '必须为带时区的 ISO 8601 时间。').refine(isCalendarDate, '日期不存在。').transform((value) => new Date(value));

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: dateTime,
    updatedDate: dateTime.optional(),
    slug: z.string().regex(slugPattern, 'slug 必须为小写 kebab-case。'),
    category: z.enum(Object.keys(categories) as [keyof typeof categories, ...(keyof typeof categories)[]]),
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
    cover: z.object({
      image: image(),
      alt: z.string(),
    }).optional(),
  }).superRefine((post, context) => {
    if (post.updatedDate && post.updatedDate < post.pubDate) {
      context.addIssue({ code: 'custom', message: 'updatedDate 不能早于 pubDate。', path: ['updatedDate'] });
    }
    const normalizedTags = post.tags.map((tag) => tag.trim().normalize('NFC').toLowerCase());
    if (normalizedTags.some((tag) => !tag) || new Set(normalizedTags).size !== normalizedTags.length) {
      context.addIssue({ code: 'custom', message: '标签必须非空且在单篇文章内唯一。', path: ['tags'] });
    }
  }),
});

export const collections = { blog };
