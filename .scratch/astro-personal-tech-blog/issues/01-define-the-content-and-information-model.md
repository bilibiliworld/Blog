Type: grilling
Status: resolved

## Question

文章的 Markdown/MDX frontmatter、草稿规则、分类与标签约束、可选封面图、归档与 RSS 数据应采用什么内容模型，才能让中文个人技术笔记保持易写、易读、易维护？

## Answer

采用一个 Astro Content Collection 作为唯一文章来源。文章置于 `src/content/blog/`，支持 `.md` 与 `.mdx`；文章文件、文章页、首页、分类/标签页、归档与 RSS 都只消费该 collection。

### 文章契约

每篇文章的 frontmatter 必须包含：`title`、`description`、`pubDate`、`slug`、`category`。可选字段为：`updatedDate`、`draft`、`tags`、`cover`。

- `title` 使用中文；`description` 是作者人工填写的短摘要，用于首页、SEO 与 RSS。
- `slug` 为全局唯一、仅含小写 ASCII 字母、数字与连字符的 kebab-case（`^[a-z0-9]+(?:-[a-z0-9]+)*$`），且不含首尾斜杠。发布后默认不可变；确需调整时，必须在集中维护的重定向表中登记旧 URL 到新 URL。
- `pubDate` 与可选的 `updatedDate` 使用带时区的 ISO 8601 日期时间；`updatedDate` 不得早于 `pubDate`。列表按 `pubDate` 倒序、再按 `slug` 升序，确保同日文章顺序稳定。
- `draft` 默认 `false`。发布谓词统一为 `!draft && pubDate <= buildTime`：生产构建中的所有页面、聚合页与 RSS 都必须只使用该谓词过滤后的文章。`astro dev` 可展示草稿和未来文章以便作者预览；`astro preview` 与正式部署遵循生产过滤结果。

### 分类与标签契约

- 每篇文章有且仅有一个分类。分类由集中维护的 taxonomy 配置定义为稳定英文 `key` 与中文 `label`（例如 `frontend` / “前端开发”）；frontmatter 仅存 `key`，分类 URL 也只使用 `key`。
- `tags` 为零到多个自由标签。每个标签先去除首尾空格并进行 Unicode NFC 规范化；英文标签转为小写。每篇文章内按规范化值去重。标签页使用由规范化值生成的稳定 URL；若不同标签生成相同 URL，则内容校验失败并要求作者消歧。

### 图片契约

`cover` 非强制，结构为 `{ image, alt }`。本地封面和正文图片优先与文章内容相邻存放，并通过 Astro 的本地图片 schema/构建优化处理；未来使用远程图片时，必须显式加入可信域名配置。封面存在时，`alt` 必填：信息性图片提供有意义的替代文本，纯装饰图片明确使用空替代文本。

该模型保留 MDX，供文章在需要时嵌入交互组件或复杂示例，同时以共享的发布谓词和稳定身份规则避免路由、归档与 RSS 的逻辑分叉。
