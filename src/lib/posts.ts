import { getCollection, type CollectionEntry } from 'astro:content';
import { postRedirects } from '../config/redirects';
import { normalizeTag, tagSegment } from './content-model';

export type Post = CollectionEntry<'blog'>;

const buildTime = new Date(__SITE_BUILD_TIME__);

function validatePosts(posts: Post[]) {
  const slugs = new Set<string>();
  const tags = new Map<string, string>();
  for (const post of posts) {
    if (slugs.has(post.data.slug)) throw new Error(`文章 slug 重复：${post.data.slug}`);
    slugs.add(post.data.slug);
    for (const tag of post.data.tags) {
      const segment = tagSegment(tag);
      if (!segment) throw new Error(`标签无法生成安全 URL：${tag}`);
      const prior = tags.get(segment);
      if (prior && prior !== tag.trim()) throw new Error(`标签 URL 冲突：${prior} 与 ${tag}`);
      tags.set(segment, tag.trim());
    }
  }
  for (const [legacySlug, targetSlug] of Object.entries(postRedirects)) {
    if (slugs.has(legacySlug)) throw new Error(`旧 slug 不能占用现有文章路径：${legacySlug}`);
    const target = posts.find((post) => post.data.slug === targetSlug);
    if (!target) throw new Error(`重定向目标不存在：${targetSlug}`);
    if (!isPublished(target)) throw new Error(`重定向目标尚未发布：${targetSlug}`);
  }
}

async function getAllPosts() {
  const posts = await getCollection('blog');
  validatePosts(posts);
  return posts;
}

export function isPublished(post: Post, cutoff = buildTime) {
  return !post.data.draft && post.data.pubDate <= cutoff;
}

export function sortPosts(posts: Post[]) {
  return [...posts].sort((left, right) =>
    right.data.pubDate.getTime() - left.data.pubDate.getTime() ||
    left.data.slug.localeCompare(right.data.slug),
  );
}

export async function getPublishedPosts() {
  const posts = await getAllPosts();
  return sortPosts(import.meta.env.DEV ? posts : posts.filter((post) => isPublished(post)));
}

export { normalizeTag } from './content-model';
export function tagSlug(tag: string) { return tagSegment(tag); }

export async function getPublishedTags() {
  const tags = new Map<string, { label: string; posts: Post[] }>();
  for (const post of await getPublishedPosts()) {
    for (const tag of post.data.tags) {
      const normalized = normalizeTag(tag);
      const current = tags.get(normalized) ?? { label: tag.trim(), posts: [] };
      current.posts.push(post);
      tags.set(normalized, current);
    }
  }
  return [...tags.entries()];
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(date);
}
