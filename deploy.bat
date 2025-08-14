@echo off
chcp 65001 2>nul >nul

call hexo cl
call hexo bangumi -u
call hexo steam -u
call hexo douban
call node link.js
call hexo ge
call gulp
call hexo de

echo 任务执行完成！