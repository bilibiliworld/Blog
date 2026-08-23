import rss from '@astrojs/rss';
import { getPublishedPosts } from '../lib/posts';
import { site } from '../config/site';

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    customData: '<language>zh-CN</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.data.slug}/`,
    })),
  });
}
