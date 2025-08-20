'use client';

import { useState } from 'react';
import { calculateVRAM } from '@/lib/vramCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Settings, Zap, Download, Cpu, HardDrive, Activity, Layers, Gauge, BarChart3, BookOpen } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import { translations } from '@/app/lib/translations';

interface CalculatorProps {}

export default function Calculator({}: CalculatorProps) {
  const { language } = useApp();
  const t = translations[language];
  
  const [parameters, setParameters] = useState('7');
  const [sequenceLength, setSequenceLength] = useState('2048');
  const [batchSize, setBatchSize] = useState('1');
  const [precision, setPrecision] = useState('fp16');
  const [task, setTask] = useState('inference');
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setError(null);
    
    // 输入验证
    const params = parseFloat(parameters);
    const seqLen = parseInt(sequenceLength);
    const batch = parseInt(batchSize);
    
    if (isNaN(params) || params <= 0) {
      setError(t.invalidParameters);
      return;
    }
    if (isNaN(seqLen) || seqLen <= 0) {
      setError(t.invalidSequenceLength);
      return;
    }
    if (isNaN(batch) || batch <= 0) {
      setError(t.invalidBatchSize);
      return;
    }

    setIsCalculating(true);
    
    // 模拟计算延迟以提供更好的用户体验
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const config = {
        parameters: params,
        sequenceLength: seqLen,
        batchSize: batch,
        precision: precision as 'fp32' | 'fp16' | 'int8' | 'int4',
        task: task as 'inference' | 'training'
      };

      const vramResults = calculateVRAM(config);
      setResults(vramResults);
    } catch (err) {
      setError(t.calculationError);
    } finally {
      setIsCalculating(false);
    }
  };

  const exportResults = () => {
    if (!results) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      configuration: {
        parameters: parseFloat(parameters),
        sequenceLength: parseInt(sequenceLength),
        batchSize: parseInt(batchSize),
        precision,
        task
      },
      results,
      summary: language === 'zh' 
        ? `模型: ${parameters}B 参数, 序列长度: ${sequenceLength}, 批次: ${batchSize}, 精度: ${precision.toUpperCase()}, 任务: ${task === 'inference' ? '推理' : '训练'}`
        : `Model: ${parameters}B params, Sequence: ${sequenceLength}, Batch: ${batchSize}, Precision: ${precision.toUpperCase()}, Task: ${task}`
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vram-calculation-${parameters}B-${precision}-${task}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const presetModels = [
    { name: t.presets['GPT-3.5 (7B)'], params: '7', seqLen: '2048' },
    { name: t.presets['LLaMA-7B'], params: '7', seqLen: '4096' },
    { name: t.presets['LLaMA-13B'], params: '13', seqLen: '4096' },
    { name: t.presets['LLaMA-30B'], params: '30', seqLen: '4096' },
    { name: t.presets['LLaMA-65B'], params: '65', seqLen: '4096' },
    { name: t.presets['GPT-J-6B'], params: '6', seqLen: '2048' },
    { name: t.presets['OPT-66B'], params: '66', seqLen: '2048' },
    { name: t.presets['BLOOM-176B'], params: '176', seqLen: '2048' },
  ];

  const loadPreset = (preset: any) => {
    setParameters(preset.params);
    setSequenceLength(preset.seqLen);
  };

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {t.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t.subtitle}
          </p>
        </div>
        
        {/* 使用响应式布局：手机上垂直堆叠，大屏幕上1:2比例 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 输入参数区域 - 在大屏幕上占1列 */}
          <div className="xl:col-span-1">
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t.modelConfig}
                </CardTitle>
                <CardDescription>
                  {t.modelConfigDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">{/* 预设模型 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help">
                        <Label htmlFor="preset">{t.presetModel}</Label>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start">
                      <p>{t.presetModelTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={(value) => {
                  const index = parseInt(value);
                  if (!isNaN(index)) {
                    const preset = presetModels[index];
                    if (preset) loadPreset(preset);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.presetModel} />
                  </SelectTrigger>
                  <SelectContent>
                    {presetModels.map((model, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* 参数数量 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="parameters">{t.parameters}</Label>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start">
                      <p className="whitespace-pre-line">{t.parametersTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="parameters"
                  type="number"
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  placeholder="7"
                  min="0.1"
                  step="0.1"
                />
              </div>

              {/* 序列长度和批次大小 - 合并为一行 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="sequenceLength" className="text-sm whitespace-nowrap">{t.sequenceLengthShort || "序列长度"}</Label>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start">
                        <p className="whitespace-pre-line">{t.sequenceLengthTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="sequenceLength"
                    type="number"
                    value={sequenceLength}
                    onChange={(e) => setSequenceLength(e.target.value)}
                    placeholder="2048"
                    min="1"
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="batchSize" className="text-sm whitespace-nowrap">{t.batchSizeShort || "批次大小"}</Label>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start">
                        <p className="whitespace-pre-line">{t.batchSizeTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="batchSize"
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                    placeholder="1"
                    min="1"
                    step="1"
                  />
                </div>
              </div>

              {/* 精度和任务类型 - 合并为一行 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm whitespace-nowrap">{t.precisionShort || "数值精度"}</Label>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start">
                        <p className="whitespace-pre-line">{t.precisionTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={precision} onValueChange={setPrecision}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fp32">{t.fp32}</SelectItem>
                      <SelectItem value="fp16">{t.fp16}</SelectItem>
                      <SelectItem value="int8">{t.int8}</SelectItem>
                      <SelectItem value="int4">{t.int4}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm whitespace-nowrap">{t.taskTypeShort || "任务类型"}</Label>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start">
                        <p className="whitespace-pre-line">{t.taskTypeTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={task} onValueChange={setTask}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inference">{t.inference}</SelectItem>
                      <SelectItem value="training">{t.training}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/50">
                  <AlertDescription className="text-red-800 dark:text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleCalculate} 
                className="w-full" 
                size="lg"
                disabled={isCalculating}
              >
                <Cpu className="h-4 w-4 mr-2" />
                {isCalculating ? t.calculating : t.calculate}
              </Button>
              </CardContent>
            </Card>
          </div>

          {/* 结果显示区域 - 在大屏幕上占2列 */}
          <div className="xl:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  {t.results}
                </CardTitle>
                <CardDescription>
                  {t.resultsDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-6">
                    {/* 总VRAM需求 - 突出显示 */}
                    <Card className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30">
                      <CardContent className="">
                        <div className="text-center space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t.totalVRAM}
                          </p>
                          <p className="text-4xl font-bold text-primary dark:text-primary/90">
                            {results.totalVRAM} GB
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 详细分解 - 使用网格布局 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <HardDrive className="h-4 w-4" />
                          {t.modelWeights}
                        </span>
                        <Badge variant="outline" className="text-base font-semibold">{results.modelWeights} GB</Badge>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          {t.activations}
                        </span>
                        <Badge variant="outline" className="text-base font-semibold">{results.activations} GB</Badge>
                      </div>

                      {results.kvCache && parseFloat(results.kvCache.toString()) > 0 && (
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Gauge className="h-4 w-4" />
                            {t.kvCache}
                          </span>
                          <Badge variant="outline" className="text-base font-semibold">{results.kvCache} GB</Badge>
                        </div>
                      )}

                      {results.gradients && (
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            {t.gradients}
                          </span>
                          <Badge variant="outline" className="text-base font-semibold">{results.gradients} GB</Badge>
                        </div>
                      )}

                      {results.optimizer && (
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            {t.optimizerState}
                          </span>
                          <Badge variant="outline" className="text-base font-semibold">{results.optimizer} GB</Badge>
                        </div>
                      )}

                      {results.frameworkOverhead && parseFloat(results.frameworkOverhead.toString()) > 0 && (
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Cpu className="h-4 w-4" />
                            {t.frameworkOverhead}
                          </span>
                          <Badge variant="outline" className="text-base font-semibold">{results.frameworkOverhead} GB</Badge>
                        </div>
                      )}
                    </div>

                    {/* 内存分配可视化 */}
                    <Card className="bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          {t.memoryAllocation || "Memory Allocation"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* 内存分配条形图 */}
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex">
                              {(() => {
                                const totalVRAM = parseFloat(results.totalVRAM);
                                const components = [
                                  { value: parseFloat(results.modelWeights), color: "bg-blue-500", show: true },
                                  { value: parseFloat(results.activations), color: "bg-green-500", show: true },
                                  { value: results.kvCache ? parseFloat(results.kvCache) : 0, color: "bg-purple-500", show: results.kvCache && parseFloat(results.kvCache) > 0 },
                                  { value: results.gradients ? parseFloat(results.gradients) : 0, color: "bg-yellow-500", show: results.gradients },
                                  { value: results.optimizer ? parseFloat(results.optimizer) : 0, color: "bg-red-500", show: results.optimizer },
                                  { value: results.frameworkOverhead ? parseFloat(results.frameworkOverhead) : 0, color: "bg-gray-500", show: results.frameworkOverhead && parseFloat(results.frameworkOverhead) > 0 }
                                ].filter(c => c.show);
                                
                                return components.map((component, index) => {
                                  const percentage = (component.value / totalVRAM) * 100;
                                  const shouldShowText = percentage > 8; // 只有大于8%的才显示文字
                                  
                                  return (
                                    <div 
                                      key={index}
                                      className={`${component.color} flex items-center justify-center text-white text-sm font-semibold`}
                                      style={{ width: `${percentage}%` }}
                                    >
                                      {shouldShowText && `${percentage.toFixed(1)}%`}
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-center">{t.memoryAllocation || "Memory Allocation"}</p>
                          </div>

                          {/* 详细占比信息 */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span>{t.modelWeights}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{results.modelWeights} GB</div>
                                <div className="text-blue-600 dark:text-blue-400">
                                  {((parseFloat(results.modelWeights) / parseFloat(results.totalVRAM)) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span>{t.activations}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{results.activations} GB</div>
                                <div className="text-green-600 dark:text-green-400">
                                  {((parseFloat(results.activations) / parseFloat(results.totalVRAM)) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>

                            {results.kvCache && parseFloat(results.kvCache) > 0 && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                                  <span>{t.kvCache}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{results.kvCache} GB</div>
                                  <div className="text-purple-600 dark:text-purple-400">
                                    {((parseFloat(results.kvCache) / parseFloat(results.totalVRAM)) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            )}

                            {results.gradients && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                  <span>{t.gradients}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{results.gradients} GB</div>
                                  <div className="text-yellow-600 dark:text-yellow-400">
                                    {((parseFloat(results.gradients) / parseFloat(results.totalVRAM)) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            )}

                            {results.optimizer && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                                  <span>{t.optimizerState}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{results.optimizer} GB</div>
                                  <div className="text-red-600 dark:text-red-400">
                                    {((parseFloat(results.optimizer) / parseFloat(results.totalVRAM)) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            )}

                            {results.frameworkOverhead && parseFloat(results.frameworkOverhead) > 0 && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                                  <span>{t.frameworkOverhead}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{results.frameworkOverhead} GB</div>
                                  <div className="text-gray-600 dark:text-gray-400">
                                    {((parseFloat(results.frameworkOverhead) / parseFloat(results.totalVRAM)) * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 计算公式说明 */}
                    <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-800 dark:text-blue-300 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {t.calculationFormulas || "Calculation Formulas"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <div className="space-y-3">
                          <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg">
                            <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                              {t.modelWeights}
                            </h4>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {t.modelWeightsFormula || "Parameters × Precision_Bytes"}
                            </code>
                            <p className="text-muted-foreground mt-1">
                              {t.modelWeightsDesc || `FP16: 2 bytes, FP32: 4 bytes, INT8: 1 byte, INT4: 0.5 bytes`}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg">
                            <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">
                              {t.activations}
                            </h4>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {t.activationsFormula || "2 × Batch_Size × Sequence_Length × Hidden_Size × Precision_Bytes"}
                            </code>
                            <p className="text-muted-foreground mt-1">
                              {t.activationsDesc || "Includes attention and feed-forward activations"}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg">
                            <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">
                              {t.kvCache}
                            </h4>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {t.kvCacheFormula || "2 × Batch_Size × Sequence_Length × Num_Layers × Hidden_Size × Precision_Bytes"}
                            </code>
                            <p className="text-muted-foreground mt-1">
                              {t.kvCacheDesc || "Storage for Key and Value matrices in attention"}
                            </p>
                          </div>

                          {task === 'training' && (
                            <>
                              <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg">
                                <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">
                                  {t.gradients}
                                </h4>
                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {t.gradientsFormula || "Parameters × Precision_Bytes"}
                                </code>
                                <p className="text-muted-foreground mt-1">
                                  {t.gradientsDesc || "Same size as model weights for backpropagation"}
                                </p>
                              </div>

                              <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg">
                                <h4 className="font-semibold mb-2 text-orange-700 dark:text-orange-400">
                                  {t.optimizerState}
                                </h4>
                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {t.optimizerFormula || "Parameters × 8 bytes (Adam optimizer)"}
                                </code>
                                <p className="text-muted-foreground mt-1">
                                  {t.optimizerDesc || "Momentum and variance states for Adam optimizer"}
                                </p>
                              </div>
                            </>
                          )}

                          <div className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                              {t.totalVRAM}
                            </h4>
                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {task === 'training' 
                                ? (t.totalTrainingFormula || "(Model + Activations + Gradients + Optimizer) × 1.2")
                                : (t.totalInferenceFormula || "(Model + Activations) × 1.2")
                              }
                            </code>
                            <p className="text-muted-foreground mt-1">
                              {t.totalVRAMDesc || "Includes 20% safety buffer for framework overhead"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* GPU 推荐 */}
                    <Card className="bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900/60">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-800 dark:text-green-300 flex items-center gap-2">
                          <Cpu className="h-5 w-5" />
                          {t.recommendedGPUs}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {results.recommendedGPUs.map((gpu: string, index: number) => (
                            <div key={index} className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <Badge variant="secondary" className="text-green-700 dark:text-green-400 text-base px-4 py-1">
                                {gpu}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* 导出按钮 */}
                    <Button 
                      onClick={exportResults}
                      variant="outline" 
                      className="w-full"
                      size="lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t.exportResults}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-16 space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <HardDrive className="h-8 w-8" />
                    </div>
                    <p className="text-lg">{t.fillParameters}</p>
                    <p className="text-sm">{t.startAnalysis}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
