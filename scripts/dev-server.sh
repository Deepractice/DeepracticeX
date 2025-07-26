#!/bin/bash

# DeepracticeX 开发服务器管理脚本
# 支持启动、停止、重启、状态查看等操作

PORT=3001
PROJECT_DIR="$(dirname "$0")/.."
LOG_FILE="$PROJECT_DIR/.dev-server.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示使用说明
show_usage() {
    echo -e "${BLUE}DeepracticeX 开发服务器管理脚本${NC}"
    echo
    echo "用法:"
    echo "  $0 start       - 前台启动开发服务器"
    echo "  $0 start-bg    - 后台启动开发服务器"
    echo "  $0 stop        - 停止开发服务器"
    echo "  $0 restart     - 重启开发服务器（前台模式）"
    echo "  $0 restart-bg  - 重启开发服务器（后台模式）"
    echo "  $0 status      - 查看服务器状态"
    echo "  $0 logs        - 查看服务器日志（后台模式）"
    echo
    echo "配置:"
    echo "  端口: $PORT"
    echo "  项目目录: $PROJECT_DIR"
    echo "  日志文件: $LOG_FILE"
    echo
    exit 1
}

# 检查服务器状态
check_status() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        PID=$(lsof -ti:$PORT)
        echo -e "${GREEN}✅ 服务器正在运行${NC}"
        echo -e "   PID: $PID"
        echo -e "   端口: $PORT"
        echo -e "   访问地址: http://localhost:$PORT"
        return 0
    else
        echo -e "${YELLOW}⚠️  服务器未运行${NC}"
        return 1
    fi
}

# 停止服务器
stop_server() {
    echo -e "${BLUE}🛑 停止 DeepracticeX 开发服务器...${NC}"
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        PID=$(lsof -ti:$PORT)
        echo -e "${YELLOW}⚠️  找到运行中的服务器 (PID: $PID)，正在停止...${NC}"
        kill $PID 2>/dev/null
        
        # 等待进程结束
        for i in {1..5}; do
            if ! lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
                echo -e "${GREEN}✅ 服务器已停止${NC}"
                return 0
            fi
            sleep 1
        done
        
        # 如果还在运行，强制结束
        echo -e "${YELLOW}⚠️  进程未响应，强制结束...${NC}"
        kill -9 $PID 2>/dev/null
        sleep 1
        echo -e "${GREEN}✅ 服务器已强制停止${NC}"
    else
        echo -e "${YELLOW}⚠️  服务器未运行${NC}"
    fi
}

# 前台启动服务器
start_server() {
    echo -e "${BLUE}🚀 DeepracticeX 开发服务器启动（前台模式）${NC}"
    echo -e "📍 项目目录: $PROJECT_DIR"
    echo -e "🔗 端口: $PORT"
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 $PORT 已被占用${NC}"
        echo -e "${YELLOW}   请先执行 '$0 stop' 停止服务器${NC}"
        exit 1
    fi
    
    # 切换到项目目录
    cd "$PROJECT_DIR"
    
    # 启动开发服务器
    echo -e "${GREEN}✅ 启动开发服务器...${NC}"
    npm run start -- --port $PORT
}

# 后台启动服务器
start_server_bg() {
    echo -e "${BLUE}🚀 DeepracticeX 开发服务器启动（后台模式）${NC}"
    echo -e "📍 项目目录: $PROJECT_DIR"
    echo -e "🔗 端口: $PORT"
    echo -e "📝 日志文件: $LOG_FILE"
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 $PORT 已被占用${NC}"
        echo -e "${YELLOW}   请先执行 '$0 stop' 停止服务器${NC}"
        exit 1
    fi
    
    # 切换到项目目录
    cd "$PROJECT_DIR"
    
    # 后台启动开发服务器
    echo -e "${GREEN}✅ 在后台启动开发服务器...${NC}"
    nohup npm run start -- --port $PORT > "$LOG_FILE" 2>&1 &
    
    # 等待服务器启动
    echo -e "⏳ 等待服务器启动..."
    for i in {1..10}; do
        if curl -s http://localhost:$PORT > /dev/null 2>&1; then
            echo -e "${GREEN}✅ 服务器已成功启动！${NC}"
            echo -e "🌐 访问地址: http://localhost:$PORT"
            echo -e "📝 查看日志: tail -f $LOG_FILE"
            return 0
        fi
        sleep 1
    done
    
    echo -e "${RED}❌ 服务器启动失败，请查看日志文件${NC}"
    tail -20 "$LOG_FILE"
    exit 1
}

# 查看日志
show_logs() {
    if [[ -f "$LOG_FILE" ]]; then
        echo -e "${BLUE}📝 DeepracticeX 开发服务器日志${NC}"
        echo -e "日志文件: $LOG_FILE"
        echo
        tail -f "$LOG_FILE"
    else
        echo -e "${YELLOW}⚠️  日志文件不存在${NC}"
        echo -e "   后台模式启动服务器后才会生成日志文件"
    fi
}

# 主程序
case "$1" in
    start)
        start_server
        ;;
    start-bg)
        start_server_bg
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        echo
        sleep 2
        start_server
        ;;
    restart-bg)
        stop_server
        echo
        sleep 2
        start_server_bg
        ;;
    status)
        check_status
        ;;
    logs)
        show_logs
        ;;
    *)
        show_usage
        ;;
esac