#!/bin/bash

# DeepracticeX 开发服务器启动脚本
# 自动关闭已运行的实例并重新启动

PORT=3001
PROJECT_DIR="$(dirname "$0")/.."

echo "🚀 DeepracticeX 开发服务器启动脚本"
echo "📍 项目目录: $PROJECT_DIR"
echo "🔗 端口: $PORT"

# 查找并关闭占用端口的进程
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 $PORT 已被占用，正在关闭..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 1
fi

# 切换到项目目录
cd "$PROJECT_DIR"

# 启动开发服务器
echo "✅ 启动开发服务器..."
npm run start -- --port $PORT