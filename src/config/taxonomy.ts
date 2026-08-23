export const categories = {
  frontend: '前端开发',
  backend: '后端开发',
  devtools: '开发工具',
  notes: '技术随笔',
} as const;

export type CategoryKey = keyof typeof categories;
