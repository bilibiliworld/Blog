import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

const requiredFiles = [
  'dist/index.html',
  'dist/archive/index.html',
  'dist/about/index.html',
  'dist/posts/welcome-to-my-notes/index.html',
  'dist/posts/writing-with-mdx/index.html',
  'dist/posts/hello-tech-notes/index.html',
  'dist/categories/notes/index.html',
  'dist/tags/astro/index.html',
  'dist/rss.xml',
  'dist/sitemap-index.xml',
  'dist/CNAME',
];
const forbiddenFiles = [
  'dist/posts/private-draft-note/index.html',
  'dist/posts/scheduled-future-note/index.html',
];

for (const file of requiredFiles) await access(file, constants.R_OK);
for (const file of forbiddenFiles) {
  try {
    await access(file, constants.F_OK);
    throw new Error(`不应生成 ${file}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const [home, rss, archive, sitemap, article, redirect, cname] = await Promise.all([
  readFile('dist/index.html', 'utf8'), readFile('dist/rss.xml', 'utf8'), readFile('dist/archive/index.html', 'utf8'),
  readFile('dist/sitemap-0.xml', 'utf8'), readFile('dist/posts/welcome-to-my-notes/index.html', 'utf8'), readFile('dist/posts/hello-tech-notes/index.html', 'utf8'),
  readFile('dist/CNAME', 'utf8'),
]);
for (const artifact of [home, rss, archive, sitemap]) {
  if (artifact.includes('尚未完成的草稿') || artifact.includes('未来发布的文章') || artifact.includes('private-draft-note') || artifact.includes('scheduled-future-note')) throw new Error('公开产物泄露了未发布文章。');
}
if (!rss.includes('欢迎来到我的技术笔记')) throw new Error('RSS 缺少已发布文章。');
if (!article.includes('alt="一张带有暖色纸纹的抽象便签"')) throw new Error('封面缺少替代文本。');
if (!home.includes('aria-pressed="false"')) throw new Error('主题控件缺少可访问状态。');
if (!redirect.includes('welcome-to-my-notes')) throw new Error('旧链接没有指向新文章。');
const canonicalOrigin = 'https://blog.loliking.com';
if (cname.trim() !== 'blog.loliking.com') throw new Error('发布产物的 CNAME 不匹配站点域名。');
if (!home.includes(`rel="canonical" href="${canonicalOrigin}/"`)) throw new Error('首页 canonical URL 不匹配站点域名。');
if (!rss.includes(`<link>${canonicalOrigin}/</link>`)) throw new Error('RSS URL 不匹配站点域名。');
if (!sitemap.includes(`${canonicalOrigin}/`)) throw new Error('站点地图 URL 不匹配站点域名。');
