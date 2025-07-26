#!/bin/bash

# DeepracticeX 开发服务器后台启动脚本
# 自动关闭已运行的实例并在后台重新启动

PORT=3001
PROJECT_DIR="$(dirname "$0")/.."
LOG_FILE="$PROJECT_DIR/.dev-server.log"

echo "🚀 DeepracticeX 开发服务器后台启动脚本"
echo "📍 项目目录: $PROJECT_DIR"
echo "🔗 端口: $PORT"
echo "📝 日志文件: $LOG_FILE"

# 查找并关闭占用端口的进程
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 $PORT 已被占用，正在关闭..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 1
fi

# 切换到项目目录
cd "$PROJECT_DIR"

# 后台启动开发服务器
echo "✅ 在后台启动开发服务器..."
nohup npm run start -- --port $PORT > "$LOG_FILE" 2>&1 &

# 等待服务器启动
echo "⏳ 等待服务器启动..."
for i in {1..10}; do
    if curl -s http://localhost:$PORT > /dev/null; then
        echo "✅ 服务器已成功启动！"
        echo "🌐 访问地址: http://localhost:$PORT"
        echo "📝 查看日志: tail -f $LOG_FILE"
        exit 0
    fi
    sleep 1
done

echo "❌ 服务器启动失败，请查看日志文件"
tail -20 "$LOG_FILE"
exit 1