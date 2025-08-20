# LLM GPU VRAM 使用量计算器

一个用于估算大语言模型(LLM)在推理和训练过程中GPU VRAM使用量的Web应用程序。

![项目截图](screenshot.png)

## 功能特性

- 🚀 **精准估算**: 基于模型参数数量、序列长度、批次大小等因素计算VRAM需求
- 🎯 **多任务支持**: 支持推理和训练/微调两种场景的内存估算
- 🔧 **精度对比**: 比较不同数值精度(FP32/FP16/INT8/INT4)下的内存占用
- 💾 **GPU推荐**: 自动推荐适合的GPU型号和配置
- 📱 **响应式设计**: 支持桌面端和移动端设备
- 🌙 **深色模式**: 支持明暗主题切换
- 💡 **智能提示**: 集成工具提示系统，详细解释各参数含义
- ⚡ **现代UI**: 使用 shadcn/ui 组件库，提供优雅的用户界面
- 📊 **结果导出**: 支持将计算结果导出为JSON格式
- 🔍 **输入验证**: 智能输入验证和错误提示

## 支持的模型类型

- GPT系列 (GPT-3.5, GPT-J等)
- LLaMA系列 (7B, 13B, 30B, 65B等)
- OPT系列
- BLOOM系列
- 以及其他基于Transformer架构的模型

## 技术栈

- **前端框架**: Next.js 15, React 19, TypeScript
- **UI 组件**: shadcn/ui (基于 Radix UI 和 Tailwind CSS)
- **样式系统**: Tailwind CSS
- **组件库**: 
  - Card, Button, Input, Select 等基础组件
  - Tooltip, Alert, Badge 等交互组件
  - Tabs, Table, Separator 等布局组件
- **部署**: 支持Vercel、Netlify等平台

## 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装和运行

1. 克隆项目
```bash
git clone https://github.com/your-username/llm-gpu-usage-calculator.git
cd llm-gpu-usage-calculator
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
```

## 使用说明

### 基础计算

1. 选择预设模型或手动输入参数
2. 设置序列长度和批次大小
3. 选择数值精度和任务类型
4. 点击"计算 VRAM 使用量"获取结果

### 精度对比

1. 切换到"精度对比"标签
2. 输入模型基础参数
3. 查看不同精度下的内存占用对比
4. 分析优化建议和节省空间

## 计算原理

### 内存组成

- **模型权重**: 参数数量 × 精度字节数
- **激活值**: 基于序列长度、隐藏层维度和注意力机制估算
- **梯度内存**: 训练时与模型权重相同大小
- **优化器状态**: Adam优化器需要2倍参数内存

### 估算公式

```
总VRAM = (模型权重 + 激活值 + 梯度 + 优化器状态) × 1.2
```

*注意: 1.2倍系数为安全缓冲，实际使用中建议保留额外空间*

## 支持的GPU型号

- **消费级**: RTX 3060/3070/3080/3090, RTX 4070/4080/4090
- **专业级**: A100 (40GB/80GB), H100, V100, A6000, A4000
- **多卡方案**: 当单卡无法满足需求时自动推荐多卡配置

## 注意事项

- 此工具提供的是估算值，实际VRAM使用可能因模型架构、框架优化等因素而异
- 建议在生产环境部署前进行实际测试验证
- 不同的深度学习框架(PyTorch/TensorFlow)可能有不同的内存管理策略

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建新的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 更新日志

### v1.0.0
- 基础VRAM计算功能
- 支持推理和训练场景
- 精度对比分析
- GPU推荐系统
- 响应式用户界面
