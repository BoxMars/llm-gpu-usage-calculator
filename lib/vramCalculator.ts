interface VRAMConfig {
  parameters: number; // 模型参数数量 (B)
  sequenceLength: number; // 序列长度
  batchSize: number; // 批次大小
  precision: 'fp32' | 'fp16' | 'int8' | 'int4'; // 数值精度
  task: 'inference' | 'training'; // 任务类型
}

interface VRAMResult {
  modelWeights: number;
  activations: number;
  kvCache: number;
  gradients?: number;
  optimizer?: number;
  frameworkOverhead: number;
  totalVRAM: number;
  recommendedGPUs: string[];
}

// 精度对应的字节数
const PRECISION_BYTES = {
  fp32: 4,
  fp16: 2,
  int8: 1,
  int4: 0.5
};

// 常用GPU的VRAM容量
const GPU_VRAM = [
  { name: "RTX 3060", vram: 12 },
  { name: "RTX 3070", vram: 8 },
  { name: "RTX 3080", vram: 10 },
  { name: "RTX 3090", vram: 24 },
  { name: "RTX 4070", vram: 12 },
  { name: "RTX 4080", vram: 16 },
  { name: "RTX 4090", vram: 24 },
  { name: "A100 40GB", vram: 40 },
  { name: "A100 80GB", vram: 80 },
  { name: "H100", vram: 80 },
  { name: "V100 32GB", vram: 32 },
  { name: "A6000", vram: 48 },
  { name: "A4000", vram: 16 }
];

export function calculateVRAM(config: VRAMConfig): VRAMResult {
  const { parameters, sequenceLength, batchSize, precision, task } = config;
  
  // 参数数量转换为实际数值 (B -> 数量)
  const parameterCount = parameters * 1e9;
  
  // 模型权重所需内存 (GB)
  const modelWeights = (parameterCount * PRECISION_BYTES[precision]) / (1024 ** 3);
  
  // 估算模型的隐藏层维度 (经验公式)
  const hiddenSize = Math.sqrt(parameterCount / 12); // 基于Transformer架构的经验估算
  const numLayers = Math.sqrt(parameterCount / (hiddenSize * hiddenSize * 12));
  
  // 激活值内存计算 (包括注意力机制和前馈层的激活值)
  let activations = 0;
  
  // 注意力机制的激活值
  const attentionActivations = batchSize * sequenceLength * sequenceLength * numLayers * 4 * PRECISION_BYTES[precision];
  
  // 前馈层和其他激活值
  const feedforwardActivations = batchSize * sequenceLength * hiddenSize * numLayers * 8 * PRECISION_BYTES[precision];
  
  activations = (attentionActivations + feedforwardActivations) / (1024 ** 3);
  
  // KV Cache 计算 (Key-Value Cache for attention)
  // KV Cache = 2 (Key + Value) × batch_size × sequence_length × num_layers × hidden_size × precision_bytes
  const kvCache = (2 * batchSize * sequenceLength * numLayers * hiddenSize * PRECISION_BYTES[precision]) / (1024 ** 3);
  
  let gradients = 0;
  let optimizer = 0;
  
  // 训练时需要额外的内存
  if (task === 'training') {
    // 梯度内存 (与模型权重相同大小)
    gradients = modelWeights;
    
    // 优化器状态内存 (Adam优化器需要2倍的参数内存用于动量和方差)
    optimizer = modelWeights * 2;
  }
  
  // 计算基础内存总量 (不包含overhead)
  const baseMemory = modelWeights + activations + kvCache + gradients + optimizer;
  
  // Framework Overhead (20% 的框架开销)
  const frameworkOverhead = baseMemory * 0.2;
  
  // 总内存需求
  const totalVRAM = Math.ceil(baseMemory + frameworkOverhead);
  
  // 推荐合适的GPU
  const recommendedGPUs = GPU_VRAM
    .filter(gpu => gpu.vram >= totalVRAM)
    .sort((a, b) => a.vram - b.vram)
    .slice(0, 3)
    .map(gpu => `${gpu.name} (${gpu.vram}GB)`);
  
  // 如果没有单卡能满足需求，推荐多卡方案
  if (recommendedGPUs.length === 0) {
    const largestGPU = GPU_VRAM.reduce((max, gpu) => gpu.vram > max.vram ? gpu : max);
    const cardsNeeded = Math.ceil(totalVRAM / largestGPU.vram);
    recommendedGPUs.push(`${cardsNeeded}x ${largestGPU.name} (${largestGPU.vram}GB each)`);
  }
  
  return {
    modelWeights: parseFloat(modelWeights.toFixed(2)),
    activations: parseFloat(activations.toFixed(2)),
    kvCache: parseFloat(kvCache.toFixed(2)),
    gradients: gradients > 0 ? parseFloat(gradients.toFixed(2)) : undefined,
    optimizer: optimizer > 0 ? parseFloat(optimizer.toFixed(2)) : undefined,
    frameworkOverhead: parseFloat(frameworkOverhead.toFixed(2)),
    totalVRAM,
    recommendedGPUs
  };
}

// 预定义的模型配置
export const MODEL_PRESETS = {
  'gpt-3.5-7b': {
    parameters: 7,
    sequenceLength: 2048,
    description: 'GPT-3.5'
  },
  'llama-7b': {
    parameters: 7,
    sequenceLength: 4096,
    description: 'LLaMA 7B'
  },
  'llama-13b': {
    parameters: 13,
    sequenceLength: 4096,
    description: 'LLaMA 13B'
  },
  'llama-30b': {
    parameters: 30,
    sequenceLength: 4096,
    description: 'LLaMA 30B'
  },
  'llama-65b': {
    parameters: 65,
    sequenceLength: 4096,
    description: 'LLaMA 65B'
  },
  'gpt-j-6b': {
    parameters: 6,
    sequenceLength: 2048,
    description: 'GPT-J 6B'
  },
  'opt-66b': {
    parameters: 66,
    sequenceLength: 2048,
    description: 'OPT 66B'
  },
  'bloom-176b': {
    parameters: 176,
    sequenceLength: 2048,
    description: 'BLOOM 176B'
  }
};

// 计算不同精度下的内存占用比较
export function comparePrecisions(baseConfig: VRAMConfig) {
  const precisions: Array<VRAMConfig['precision']> = ['fp32', 'fp16', 'int8', 'int4'];
  
  return precisions.map(precision => {
    const config = { ...baseConfig, precision };
    const result = calculateVRAM(config);
    return {
      precision,
      ...result
    };
  });
}
