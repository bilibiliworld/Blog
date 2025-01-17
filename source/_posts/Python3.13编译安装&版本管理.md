---
abbrlink: e917dddd
categories:
- - 教程
date: '2024-10-10T13:06:52.463934+08:00'
description: null
tags:
- Python
- 版本管理
title: Python3.13编译安装&版本管理
updated: '2024-10-10T16:15:01.679+08:00'
---
## python3.13编译安装

进入[python官网](https://www.python.org/downloads/)下载对应的安装包。

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_13-13-33.webp)

选择tgz版本，右键复制链接，然后wget [链接]

```shell
wget https://www.python.org/ftp/python/3.13.0/Python-3.13.0.tgz
```

解压并进入文件夹：

```shell
tar -zvxf Python-3.13.0.tgz
cd Python-3.13.0
```

可能会遇到sqlite和openssl的问题，所以这里先未雨绸缪一下：

```shell
yum -y install sqlite-devel # ubuntu请自行切换成apt-get
```

```shell
vim Modules/Setup
```

找到ssl的相关配置，如下所示：

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_13-27-56.webp)

修改成这样：

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_13-30-43.webp)

其实就是直接加了两行代码：

```shell
_ssl _ssl.c -I/usr/include/openssl -L/usr/local/lib -lssl -lcrypto
_hashlib _hashopenssl.c -I/usr/include/openssl -L/usr/local/lib -lcrypto
```

这里-I后面加的是你的openssl`头文件`路径，-L后面加的是`库文件`路径，需要替换成你自己的，openssl安装可参考此[教程](https://www.cnblogs.com/herewang/p/17296874.html)。

{% kbd esc %} + {% kbd :wq %} 保存退出，然后进行编译，这里的`--enable-optimizations`可以不加，是性能优化用的；`--with-openssl=`后面是你的openssl安装位置；`-j2`指的是2个进程同时编译，一般你有几个核心就可以同时编译几个，我这里是一台阿里云2c1g的服务器，所以`-j2`。

```shell
./configure --enable-optimizations --with-openssl=/usr/local/bin/openssl
make -j2
make install
```

如果有报错的话一般是依赖没有装全，直接把报错复制给GPT，它会告诉你需要安装哪些依赖，都比较简单，这里就不赘述了。

检测是否安装成功{% psw 注意是python3不是python %}：

```shell
python3 -V
pip3 -V
```

## python版本管理

使用alternatives进行版本管理，其实本质上就是进行了软链接。首先检查一下python3的位置：

```shell
which python3
```

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_14-50-31.webp)

将它和/usr/bin/python3进行软链接：

```shell
rm -rf /usr/bin/python3
ln -s /usr/bin/python3 /usr/local/bin/python3 # 这边第二个路径写你的python位置
ll /usr/local/bin/python3
```

如下图所示即为成功：

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_15-09-23.webp)

然后配置开始配置`alternatives`:

```shell
alternatives --install /usr/bin/python3 python3 /usr/local/bin/python3.10 1
```

这边`--install`后面有四个参数：

1.`/usr/bin/python3`不用动。

2.`python3`是命令的名字。

3.`/usr/local/bin/python3.10`是你的python可执行文件的真路径，一般来说就是带具体版本号的，和之前`which python3`在同一个路径下。

4.`1`指优先级，不要遗漏了。

可以如法炮制多个python版本，指定不同的优先级。

然后使用`alternatives --config python3`来切换python版本：

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_15-17-12.webp)

这里+所在的位置就是当前的版本，输入数字切换对应版本，比如我这边切换到了python3.6，可以验证一下是否切换成功：

```shell
python -V
```

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_15-18-50.webp)

## alternatives的运行机制

如果你对原理感兴趣的话，不妨使用`ll`命令追踪一下，看看到底发生了什么：

![](https://jsd.onmicrosoft.cn/gh/bilibiliworld/picgo@main/pic/2024-10-10_15-24-46.webp)

我们可以发现，其实它就是套了一层`/etc/alternatives/python3`,通过修改它指向的软链接位置，实现不同版本的切换。原理虽然简单，但是却十分实用~
