#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
 
# 生成静态文件 
# yarn build
 
# 进入生成的文件夹
cd .vitepress/dist 
 
git init
git add -A
git commit -m 'deploy'
 
# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/Moking1997/Moking1997.github.io.git master
 
cd -
