# 刷题系统一键部署脚本
# 用法: 在 D:\exam1 目录下运行 .\deploy.ps1 "你的改动说明"

param([string]$message = "update")

Write-Host "=== 1. 添加改动 ===" -ForegroundColor Cyan
git add .
git status

Write-Host "`n=== 2. 提交 ===" -ForegroundColor Cyan
git commit -m $message
if ($LASTEXITCODE -ne 0) { Write-Host "没有新改动" -ForegroundColor Yellow }

Write-Host "`n=== 3. 推送源码 ===" -ForegroundColor Cyan
git push origin master

Write-Host "`n=== 4. 构建 + 部署 GitHub Pages ===" -ForegroundColor Cyan
npm run deploy

Write-Host "`n=== 完成! ===" -ForegroundColor Green
Write-Host "刷新: https://qqx16.github.io/embodied-quiz/" -ForegroundColor Green
