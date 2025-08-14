const fs = require("fs");
const path = require("path");

const picgoDir = "D:\\Blog\\picgo\\pixpin"; // 图片源目录
const galleryDir = path.join(__dirname, "source", "gallery"); // 目标相册集生成目录
const outputFilePath = path.join(galleryDir, "index.md");
const imageHostPrefix =
  "https://cdn.jsdmirror.com/gh/bilibiliworld/picgo@main/pixpin/"; // 图床前缀

// 检查 picgo 目录是否存在
if (!fs.existsSync(picgoDir)) {
  console.error(`图片源目录不存在：${picgoDir}`);
  process.exit(1);
}

// 读取 picgo 文件夹下的所有子文件夹
const folders = fs.readdirSync(picgoDir).filter((file) => {
  const fullPath = path.join(picgoDir, file);
  return fs.statSync(fullPath).isDirectory();
});

// 生成相册集页面内容
let galleryContent = `---
title: 相册集
date: ${new Date().toISOString()}
comments: false
aside: false
sitemap: false
---

<div class="gallery-group-main">
`;

folders.forEach((folder) => {
  const folderPath = path.join(picgoDir, folder);

  // 读取文件夹内的图片并排序
  const images = fs
    .readdirSync(folderPath)
    .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/.test(file))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)) || 0; // 提取数字
      const numB = parseInt(b.match(/\d+/)) || 0; // 提取数字
      return numA - numB; // 按数字排序
    });

  console.log(`Processing folder: ${folder}, found images: ${images.length}`);

  if (images.length > 0) {
    const coverImage = images[0]; // 使用第一个图片作为封面
    const relativeFolder = path
      .relative(picgoDir, folderPath)
      .replace(/\\/g, "/"); // 获取相对路径
    const coverImagePath = `${imageHostPrefix}${relativeFolder}/${coverImage}`;
    const title = folder.charAt(0).toUpperCase() + folder.slice(1); // 将文件夹名作为标题，首字母大写

    // 添加到相册集页面内容
    galleryContent += `{% galleryGroup '${title}' '点击查看 ${title} 相册' '/gallery/${folder}' '${coverImagePath}' %}\n`;

    // 初始化 indexContent
    let indexContent = `---
title: ${title}
date: ${new Date().toISOString()}
comments: false
aside: false
sitemap: false
---

{% gallery true, 220, 10 %}
`;

    images.forEach((image) => {
      const imageURL = `${imageHostPrefix}${relativeFolder}/${image}`;
      indexContent += `![${image}](${imageURL})\n`;
    });

    indexContent += `{% endgallery %}\n`;

    const targetFolder = path.join(galleryDir, folder); // 生成的目标文件夹
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const indexFilePath = path.join(targetFolder, "index.md");
    fs.writeFileSync(indexFilePath, indexContent, "utf8");
    console.log(`生成相册页面：${indexFilePath}`);
  }
});

galleryContent += "</div>";

// 写入相册集页面
fs.writeFileSync(outputFilePath, galleryContent, "utf8");
console.log(`相册集页面已生成：${outputFilePath}`);
