@echo off
chcp 65001 2>nul >nul

call hexo cl
@REM call hexo bangumi -u
@REM call hexo steam -u
@REM call hexo douban
@REM call node link.js
call hexo ge
@REM call gulp
call hexo se

echo 任务执行完成！