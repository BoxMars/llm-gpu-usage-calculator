export const translations = {
  zh: {
    // 主标题
    title: "LLM GPU VRAM 计算器",
    subtitle: "估算大语言模型推理和训练所需的GPU内存",
    
    // 标签页
    calculator: "VRAM 计算器",
    precisionComparer: "精度对比",
    
    // 模型配置
    modelConfig: "模型配置",
    modelConfigDesc: "配置您的模型参数以计算VRAM需求",
    
    // 输入字段
    presetModel: "预设模型",
    presetModelTooltip: "选择常见的大语言模型预设配置",
    parameters: "参数数量 (B)",
    parametersTooltip: "模型的总参数量，以十亿(B)为单位\n例如：7B表示70亿参数",
    sequenceLength: "序列长度 (tokens)",
    sequenceLengthShort: "序列长度",
    sequenceLengthTooltip: "输入文本的最大token数量\n较长的序列需要更多内存",
    batchSize: "批次大小",
    batchSizeShort: "批次大小",
    batchSizeTooltip: "同时处理的样本数量\n增加批次大小会显著增加内存需求",
    precision: "数值精度",
    precisionShort: "数值精度",
    precisionTooltip: "模型权重和计算的精度类型\n较低精度可以节省内存但可能影响性能",
    taskType: "任务类型",
    taskTypeShort: "任务类型",
    taskTypeTooltip: "训练/微调需要额外的内存来存储\n梯度和优化器状态",
    
    // 精度选项
    fp32: "FP32 (32位浮点)",
    fp16: "FP16 (16位浮点)",
    int8: "INT8 (8位整数)",
    int4: "INT4 (4位整数)",
    
    // 任务类型
    inference: "推理",
    training: "训练/微调",
    
    // 按钮
    calculate: "计算 VRAM 使用量",
    calculating: "计算中...",
    exportResults: "导出计算结果",
    
    // 计算结果
    results: "计算结果",
    resultsDesc: "VRAM使用量详细分析",
    totalVRAM: "总 VRAM 需求",
    modelWeights: "模型权重:",
    activations: "激活值:",
    kvCache: "KV缓存:",
    gradients: "梯度:",
    optimizerState: "优化器状态:",
    frameworkOverhead: "框架开销:",
    recommendedGPUs: "推荐 GPU",
    
    // 提示信息
    fillParameters: "请填写模型参数并点击计算按钮",
    startAnalysis: "开始分析您的模型VRAM需求",
    
    // 错误信息
    invalidParameters: "参数数量必须是大于0的数字",
    invalidSequenceLength: "序列长度必须是大于0的整数",
    invalidBatchSize: "批次大小必须是大于0的整数",
    calculationError: "计算过程中发生错误，请检查输入参数",
    
    // 预设模型
    presets: {
      "GPT-3.5 (7B)": "GPT-3.5 (7B)",
      "LLaMA-7B": "LLaMA-7B",
      "LLaMA-13B": "LLaMA-13B",
      "LLaMA-30B": "LLaMA-30B",
      "LLaMA-65B": "LLaMA-65B",
      "GPT-J-6B": "GPT-J-6B",
      "OPT-66B": "OPT-66B",
      "BLOOM-176B": "BLOOM-176B"
    },
    
    // 精度对比
    precisionComparisonTitle: "精度对比分析",
    precisionComparisonSubtitle: "比较不同数值精度下的VRAM使用量",
    configParams: "配置参数",
    configParamsDesc: "设置基础模型参数进行精度对比分析",
    comparePrecisions: "对比精度影响",
    totalMemory: "总内存",
    optimizationSuggestions: "优化建议",
    optimizationSuggestionsDesc: "分析不同精度选择的内存节省效果",
    savings: "节省",
    precisionTradeoff: "精度权衡",
    precisionTradeoffDesc: "较低精度可能影响模型性能，建议先测试INT8或FP16的效果",
    multiGPURequired: "需要多卡",
    
    // 内存分配和计算公式
    memoryAllocation: "内存分配",
    calculationFormulas: "计算公式",
    modelWeightsFormula: "参数数量 × 精度字节数",
    modelWeightsDesc: "FP16: 2字节, FP32: 4字节, INT8: 1字节, INT4: 0.5字节",
    activationsFormula: "2 × 批次大小 × 序列长度 × 隐藏层维度 × 精度字节数",
    activationsDesc: "包括注意力机制和前馈层的激活值",
    kvCacheFormula: "2 × 批次大小 × 序列长度 × 层数 × 隐藏层维度 × 精度字节数",
    kvCacheDesc: "存储键(Key)和值(Value)矩阵，用于注意力机制",
    gradientsFormula: "参数数量 × 精度字节数",
    gradientsDesc: "反向传播所需的梯度，与模型权重大小相同",
    optimizerFormula: "参数数量 × 8字节 (Adam优化器)",
    optimizerDesc: "Adam优化器的动量和方差状态",
    totalTrainingFormula: "(模型 + 激活值 + KV缓存 + 梯度 + 优化器) + 框架开销",
    totalInferenceFormula: "(模型 + 激活值 + KV缓存) + 框架开销",
    totalVRAMDesc: "框架开销为基础内存的20%，用于深度学习框架的运行时开销"
  },
  
  en: {
    // 主标题
    title: "LLM GPU VRAM Calculator",
    subtitle: "Estimate GPU memory requirements for LLM inference and training",
    
    // 标签页
    calculator: "VRAM Calculator",
    precisionComparer: "Precision Comparison",
    
    // 模型配置
    modelConfig: "Model Configuration",
    modelConfigDesc: "Configure your model parameters to calculate VRAM requirements",
    
    // 输入字段
    presetModel: "Preset Models",
    presetModelTooltip: "Select common large language model preset configurations",
    parameters: "Parameters (B)",
    parametersTooltip: "Total number of model parameters in billions\nExample: 7B means 7 billion parameters",
    sequenceLength: "Sequence Length (tokens)",
    sequenceLengthShort: "Sequence Length",
    sequenceLengthTooltip: "Maximum number of tokens in input text\nLonger sequences require more memory",
    batchSize: "Batch Size",
    batchSizeShort: "Batch Size",
    batchSizeTooltip: "Number of samples processed simultaneously\nIncreasing batch size significantly increases memory requirements",
    precision: "Numerical Precision",
    precisionShort: "Precision",
    precisionTooltip: "Precision type for model weights and computation\nLower precision can save memory but may affect performance",
    taskType: "Task Type",
    taskTypeShort: "Task Type",
    taskTypeTooltip: "Training/fine-tuning requires additional memory\nfor storing gradients and optimizer states",
    
    // 精度选项
    fp32: "FP32 (32-bit float)",
    fp16: "FP16 (16-bit float)",
    int8: "INT8 (8-bit integer)",
    int4: "INT4 (4-bit integer)",
    
    // 任务类型
    inference: "Inference",
    training: "Training/Fine-tuning",
    
    // 按钮
    calculate: "Calculate VRAM Usage",
    calculating: "Calculating...",
    exportResults: "Export Results",
    
    // 计算结果
    results: "Results",
    resultsDesc: "Detailed VRAM usage analysis",
    totalVRAM: "Total VRAM Required",
    modelWeights: "Model Weights:",
    activations: "Activations:",
    kvCache: "KV Cache:",
    gradients: "Gradients:",
    optimizerState: "Optimizer State:",
    frameworkOverhead: "Framework Overhead:",
    recommendedGPUs: "Recommended GPUs",
    
    // 提示信息
    fillParameters: "Please fill in model parameters and click calculate",
    startAnalysis: "Start analyzing your model VRAM requirements",
    
    // 错误信息
    invalidParameters: "Parameters must be a positive number",
    invalidSequenceLength: "Sequence length must be a positive integer",
    invalidBatchSize: "Batch size must be a positive integer",
    calculationError: "Error during calculation, please check input parameters",
    
    // 预设模型
    presets: {
      "GPT-3.5 (7B)": "GPT-3.5 (7B)",
      "LLaMA-7B": "LLaMA-7B",
      "LLaMA-13B": "LLaMA-13B",
      "LLaMA-30B": "LLaMA-30B",
      "LLaMA-65B": "LLaMA-65B",
      "GPT-J-6B": "GPT-J-6B",
      "OPT-66B": "OPT-66B",
      "BLOOM-176B": "BLOOM-176B"
    },
    
    // 精度对比
    precisionComparisonTitle: "Precision Comparison Analysis",
    precisionComparisonSubtitle: "Compare VRAM usage across different numerical precisions",
    configParams: "Configuration Parameters",
    configParamsDesc: "Set base model parameters for precision comparison analysis",
    comparePrecisions: "Compare Precision Impact",
    totalMemory: "Total Memory",
    optimizationSuggestions: "Optimization Suggestions",
    optimizationSuggestionsDesc: "Analyze memory savings from different precision choices",
    savings: "Saved",
    precisionTradeoff: "Precision Tradeoff",
    precisionTradeoffDesc: "Lower precision may affect model performance, recommend testing INT8 or FP16 effects first",
    multiGPURequired: "Multi-GPU Required",
    
    // 内存分配和计算公式
    memoryAllocation: "Memory Allocation",
    calculationFormulas: "Calculation Formulas",
    modelWeightsFormula: "Parameters × Precision_Bytes",
    modelWeightsDesc: "FP16: 2 bytes, FP32: 4 bytes, INT8: 1 byte, INT4: 0.5 bytes",
    activationsFormula: "2 × Batch_Size × Sequence_Length × Hidden_Size × Precision_Bytes",
    activationsDesc: "Activations for attention mechanisms and feed-forward layers",
    kvCacheFormula: "2 × Batch_Size × Sequence_Length × Num_Layers × Hidden_Size × Precision_Bytes",
    kvCacheDesc: "Storage for Key and Value matrices used in attention mechanism",
    gradientsFormula: "Parameters × Precision_Bytes",
    gradientsDesc: "Same size as model weights for backpropagation",
    optimizerFormula: "Parameters × 8 bytes (Adam optimizer)",
    optimizerDesc: "Momentum and variance states for Adam optimizer",
    totalTrainingFormula: "(Model + Activations + KV Cache + Gradients + Optimizer) + Framework Overhead",
    totalInferenceFormula: "(Model + Activations + KV Cache) + Framework Overhead",
    totalVRAMDesc: "Framework overhead is 20% of base memory for deep learning framework runtime costs"
  }
};
