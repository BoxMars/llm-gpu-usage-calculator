'use client';

import { useState } from 'react';
import { calculateVRAM, MODEL_PRESETS } from '@/lib/vramCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';

export default function ModelComparison() {
  const [precision, setPrecision] = useState<'fp32' | 'fp16' | 'int8' | 'int4'>('fp16');
  const [task, setTask] = useState<'inference' | 'training'>('inference');
  
  const modelResults = Object.entries(MODEL_PRESETS).map(([key, preset]) => {
    const config = {
      parameters: preset.parameters,
      sequenceLength: preset.sequenceLength,
      batchSize: 1,
      precision,
      task
    };
    
    const result = calculateVRAM(config);
    
    return {
      key,
      name: preset.description,
      parameters: preset.parameters,
      ...result
    };
  }).sort((a, b) => a.parameters - b.parameters);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          模型VRAM需求对比
        </h1>
        <p className="text-xl text-muted-foreground">
          比较常见大语言模型的GPU内存需求
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>配置选项</CardTitle>
          <CardDescription>
            选择计算精度和任务类型查看不同模型的VRAM需求
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>数值精度</Label>
              <Select value={precision} onValueChange={(value: any) => setPrecision(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fp32">FP32</SelectItem>
                  <SelectItem value="fp16">FP16</SelectItem>
                  <SelectItem value="int8">INT8</SelectItem>
                  <SelectItem value="int4">INT4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>任务类型</Label>
              <Select value={task} onValueChange={(value: any) => setTask(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inference">推理</SelectItem>
                  <SelectItem value="training">训练/微调</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>模型对比表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>模型</TableHead>
                  <TableHead>参数量</TableHead>
                  <TableHead className="text-right">总VRAM</TableHead>
                  <TableHead className="text-right">模型权重</TableHead>
                  <TableHead className="text-right">激活值</TableHead>
                  <TableHead>推荐GPU</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelResults.map((model, index) => (
                  <TableRow key={model.key}>
                    <TableCell className="font-medium">
                      {model.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{model.parameters}B</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default" className="font-bold">
                        {model.totalVRAM} GB
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {model.modelWeights} GB
                    </TableCell>
                    <TableCell className="text-right">
                      {model.activations} GB
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {model.recommendedGPUs[0] || '需要多卡'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            选择建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                  入门级 (≤12GB VRAM)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">GPT-J-6B (FP16)</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">LLaMA-7B (INT8)</Badge>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                  适合学习和原型开发
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                  中级 (16-24GB VRAM)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">LLaMA-7B/13B (FP16)</Badge>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                  适合小规模应用部署和有限的微调任务
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                  专业级 (40GB+ VRAM)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">LLaMA-30B+ (FP16)</Badge>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                  大规模训练微调和生产级别应用部署
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
