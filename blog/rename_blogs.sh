#\!/bin/bash

# 定义中英文映射
declare -A slug_map=(
  ["deepractice-认知提示范式理论"]="cognitive-prompt-paradigm"
  ["deepractice-prompt设计模式"]="prompt-design-patterns"
  ["deepractice-4p理论ai工程的系统性解决方案"]="4p-theory-ai-engineering"
  ["deepractice-的-agi-之路ai组织化"]="agi-path-ai-organization"
  ["dpml-一种结构化的-prompt-标记语言设计方案"]="dpml-structured-prompt-markup-language"
  ["oes框架科普文章"]="oes-framework-introduction"
  ["ai的记忆碎片博客"]="ai-memory-fragments"
  ["跨文化术语定义法"]="cross-cultural-terminology"
  ["mcp生态的系统环境定位困境"]="mcp-ecosystem-positioning-dilemma"
  ["为什么rag不能用于ai记忆"]="why-rag-not-for-ai-memory"
  ["为什么语义无法被计算"]="why-semantics-cannot-be-computed"
)

# 处理每个文件
for file in 2025-*.md; do
  if [ -f "$file" ]; then
    # 提取日期和当前 slug
    date=$(echo "$file" | grep -oE '^[0-9]{4}-[0-9]{2}-[0-9]{2}')
    old_slug=$(echo "$file" | sed "s/^${date}-//" | sed 's/\.md$//')
    
    # 获取新的 slug
    new_slug="${slug_map[$old_slug]}"
    
    if [ -n "$new_slug" ]; then
      # 新文件名
      new_file="${date}-${new_slug}.md"
      
      # 更新文件内的 slug
      sed -i '' "s/^slug: .*/slug: $new_slug/" "$file"
      
      # 重命名文件
      mv "$file" "$new_file"
      echo "Renamed: $file -> $new_file"
    fi
  fi
done
