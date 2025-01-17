---
abbrlink: 2013454b
categories:
- - 教程
date: '2024-10-11T00:36:47.003630+08:00'
description: null
tags:
- hexo
- 朋友圈
- fcircle
title: hexo朋友圈配置
updated: '2024-10-11T00:36:47.161+08:00'
---
使用了`hexo-circle-of-friends`这个项目，后端使用docker+sqlite，前端使用了yyyz的方案，具体的效果可以看[这里](https://002026.xyz/fcircle/)。由于官方文档其实已经很详细了，所以我这边就直接引用了。

项目地址：

{% ghcard Rock-Candy-Tea/hexo-circle-of-friends, theme=solarized-light %}

[官方文档](https://hexo-circle-of-friends-doc.vercel.app/#/)

[docker部署](https://hexo-circle-of-friends-doc.vercel.app/#/backenddeploy?id=docker%e9%83%a8%e7%bd%b2)

[前端部署](https://hexo-circle-of-friends-doc.vercel.app/#/frontenddeploy?id=%e6%96%b9%e6%a1%88%ef%bc%9ayyyz)

但是我们在博客中使用，还需要配置https，否则会出现跨域的问题。首先修改`fcircle`的`index.md`。

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-11_00-54-55.webp)

把api地址改为nginx反向代理的域名。

然后修改nginx的conf文件：

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-11_00-57-15.webp)

注意这里一定要在`location /`里添加以下代码：

```shell
proxy_set_header    X-FORWARDED-FOR $remote_addr;
proxy_set_header    X-FORWARDED-PROTO $scheme;
proxy_set_header    Host   $http_host;
```

大功告成啦，当然你还需要在`hexo`的`menu`里加上这个网页，这个就不用我教了吧~
