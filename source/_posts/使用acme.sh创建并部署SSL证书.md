---
abbrlink: 6341d4dd
categories:
- - 教程
date: '2024-10-10T16:28:13.448122+08:00'
description: null
tags:
- SSL
- 证书
- acme.sh
title: 使用acme.sh创建并部署SSL证书
updated: '2024-10-10T16:28:12.284+08:00'
---
> 本文参考了[使用 acme.sh 申请泛域名证书](https://mucen.cn/blog/acme/)，大佬写的很好，一学就会~

# 1. 安装 acme.sh

```shell
curl https://get.acme.sh | sh -s email=my@example.com
```

# 2.生成证书

先注册一个`ZeroSSL`账号

```shell
acme.sh --register-account -m [邮箱名]
```

然后进行dns验证，这里以腾讯云为例，登录 [DNSPod 后台](https://console.dnspod.cn/)：

* 点击页面右上角头像、点击 `API 密钥` 菜单、选择 `DNSPod Token`
* 点击 `创建密钥` 取一个名称如 `acme.sh`，就能生成一个随机的 `ID`、`Token`。

然后在命令行里输入：

```shell
export DP_Id=""; # 这边输入你的ID
export DP_Key=""; # 这边输入你的Token
```

输入以下指令申请泛域名证书：

```shell
acme.sh --issue --dns dns_dp -d 002026.xyz -d *.002026.xyz # 这里的002026.xyz要换成自己的域名
```

这样就算申请成功啦！

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_17-03-25.webp)

# 3.证书安装


生成的证书位置如上图所示，我们可以手动copy文件到对应的目录，也可以使用acme.sh提供的安装命令。

以下是安装到Nginx的命令。

````shell
acme.sh --install-cert -d 002026.xyz -d *.002026.xyz \
        --key-file       /usr/local/nginx/key.pem  \
        --fullchain-file /usr/local/nginx/fullchain.cer \
        --reloadcmd     "service nginx force-reload"
````

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_17-13-28.webp)

在nginx的conf文件里增加几行代码：

```shell
ssl_certificate /usr/local/nginx/fullchain.cer;
ssl_certificate_key /usr/local/nginx/key.pem;
ssl_trusted_certificate /usr/local/nginx/fullchain.cer;
```

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_17-18-09.webp)

# 4.证书更新

acme.sh会自动创建一个cron job，用于自动更新证书。

我们可以使用`crontab  -l`来进行查看，这里的意思是每天下午1:30检查证书是否需要更新：

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_17-23-55.webp)

可以使用以下命令查看已安装的证书：

```shell
acme.sh --info -d 002026.xyz # 这里换成你的域名
```

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_17-26-19.webp)
