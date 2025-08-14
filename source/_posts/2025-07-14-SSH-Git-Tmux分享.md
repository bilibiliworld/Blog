---
title: SSH/Git/Tmux分享
tags:
  - SSH
  - Git
  - Tmux
categories:
  - 教程
abbrlink: c628dc23
date: 2025-07-14 17:10:02
description:
---

# 从零开始的异世界代码学堂

## 1. SSH/Git/Tmux分享 结合 Vscode

### SSH

在本机终端中输入：

`ssh-keygen -t rsa -b 4096 -C "xxx"`

打开github，在这里添加ssh key，在终端中使用以下命令检验：

`ssh -T git@github.com`

如果连接成功，你会看到类似以下的消息：

`Hi username! You've successfully authenticated, but GitHub does not provide shell access.`

### Git

#### 下载代码 

`git clone --recursive xxx --depth 10`

`git submodule update --init --recursive`  对于一些很久的分支，要用这个更新一下子模块

`git status` 查看状态,确定一下是否有没有track的子模块

#### 设置邮箱和用户名

`git config --global user.email "xxx"`

`git config --global user.name "xxx"`

#### 创建分支

`git checkout -b xxx/xxx`

#### 提交分支

`git add xxx.py`

`git commit -m "xxx"`

`git push --set-upstream origin xxx/xxx`

#### 回退分支并保留更改记录

`git reset --soft HEAD^`

`git push -f`

#### 增加新的远程仓库

`git remote -v`

`git remote add origin1 xxx`

`git fetch origin1 --depth 10`

#### 合并分支

git merge 用于将两个分支的历史合并。它会创建一个新的合并提交，并保留合并前两个分支的历史。

- 当你在目标分支（如 main）上运行 `git merge feature-branch` 时，Git 会将 feature-branch 分支的更改合并到当前分支。
- 如果两个分支没有冲突，Git 会自动创建一个新的合并提交，将这两个分支的历史记录结合在一起。
- 如果存在冲突，Git 会要求你手动解决冲突，然后创建合并提交。

#### 变基分支

git rebase 是另一种合并更改的方式，但它通过重新应用提交来改变历史记录，使提交历史更加线性。

- 当你在 feature-branch 上运行 `git rebase main` 时，Git 会将 main 分支上的所有提交应用到 feature-branch 之上。
- 实际上，git rebase 会将 feature-branch 上的每个提交暂时保存起来，然后将它们一一应用到 main 分支的最新提交之后，形成一个新的提交链。
- 如果遇到冲突，Git 会要求你手动解决冲突，并使用 `git rebase --continue` 继续操作。

#### 合并特定分支

要将某个特定的提交（通过其哈希值识别）引入当前分支，可以使用以下命令：

`git cherry-pick <commit_hash>`

### Tmux

#### 安装

`apt-get install tmux`

#### 基本命令

`tmux`

`tmux new -s xxx`

`tmux attach -t xx`

`tmux ls`

`tmux kill-server`

`tmux kill-session -t xx`

`exit`