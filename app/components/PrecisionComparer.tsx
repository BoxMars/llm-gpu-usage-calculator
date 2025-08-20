'use client';

import { useState } from 'react';
import { comparePrecisions } from '@/lib/vramCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Gauge, 
  Zap, 
  TrendingDown, 
  Clock,
  HardDrive,
  Activity,
  Layers,
  Settings,
  Cpu
} from "lucide-react";
import { useApp } from '@/app/contexts/AppContext';
import { translations } from '@/app/lib/translations';

interface PrecisionComparerProps {}

export default function PrecisionComparer({}: PrecisionComparerProps) {
  const { language } = useApp();
  const t = translations[language];
  
  const [parameters, setParameters] = useState('7');
  const [sequenceLength, setSequenceLength] = useState('2048');
  const [batchSize, setBatchSize] = useState('1');
  const [task, setTask] = useState('inference');
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);

  const handleCompare = () => {
    const config = {
      parameters: parseFloat(parameters),
      sequenceLength: parseInt(sequenceLength),
      batchSize: parseInt(batchSize),
      precision: 'fp16' as const, // 这个值会被comparePrecisions覆盖
      task: task as 'inference' | 'training'
    };

    const results = comparePrecisions(config);
    setComparisonResults(results);
  };

  const precisionLabels: Record<string, string> = {
    fp32: t.fp32,
    fp16: t.fp16, 
    int8: t.int8,
    int4: t.int4
  };

  const precisionColors: Record<string, string> = {
    fp32: 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30',
    fp16: 'border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/30',
    int8: 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30',
    int4: 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {t.precisionComparisonTitle || 'Precision Comparison Analysis'}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t.precisionComparisonSubtitle || 'Compare VRAM usage across different numerical precisions'}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.configParams || 'Configuration Parameters'}
          </CardTitle>
          <CardDescription>
            {t.configParamsDesc || 'Set base model parameters for precision comparison analysis'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="parameters" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                {t.parameters}
              </Label>
              <Input
                id="parameters"
                type="number"
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sequenceLength" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {t.sequenceLength}
              </Label>
              <Input
                id="sequenceLength"
                type="number"
                value={sequenceLength}
                onChange={(e) => setSequenceLength(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchSize" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {t.batchSize}
              </Label>
              <Input
                id="batchSize"
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {t.taskType}
              </Label>
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

          <Button onClick={handleCompare} className="w-full" size="lg">
            <BarChart className="h-4 w-4 mr-2" />
            {t.comparePrecisions || 'Compare Precision Impact'}
          </Button>
        </CardContent>
      </Card>

      {/* 对比结果 */}
      {comparisonResults.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparisonResults.map((result, index) => (
              <Card key={index} className={precisionColors[result.precision]}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    {precisionLabels[result.precision]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {result.totalVRAM} GB
                    </p>
                    <p className="text-sm text-muted-foreground">{t.totalVRAM}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {t.modelWeights}
                      </span>
                      <Badge variant="outline">{result.modelWeights} GB</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {t.activations}
                      </span>
                      <Badge variant="outline">{result.activations} GB</Badge>
                    </div>

                    {result.gradients && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {t.gradients}:
                        </span>
                        <Badge variant="outline">{result.gradients} GB</Badge>
                      </div>
                    )}

                    {result.optimizer && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-1">
                          <Settings className="h-3 w-3" />
                          {t.optimizerState}:
                        </span>
                        <Badge variant="outline">{result.optimizer} GB</Badge>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Cpu className="h-3 w-3" />
                      {t.recommendedGPUs}:
                    </p>
                    <p className="text-sm font-medium">
                      {result.recommendedGPUs[0] || (t.multiGPURequired || 'Multi-GPU Required')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 节省分析 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                {t.optimizationSuggestions || 'Optimization Suggestions'}
              </CardTitle>
              <CardDescription>
                {t.optimizationSuggestionsDesc || 'Analysis of memory savings from different precision choices'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  const fp32Result = comparisonResults.find(r => r.precision === 'fp32');
                  const fp16Result = comparisonResults.find(r => r.precision === 'fp16');
                  const int8Result = comparisonResults.find(r => r.precision === 'int8');
                  
                  if (!fp32Result) return null;
                  
                  return (
                    <>
                      {fp16Result && (
                        <Card className="text-center">
                          <CardContent className="">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Badge variant="outline">FP32</Badge>
                              <TrendingDown className="h-4 w-4" />
                              <Badge variant="outline">FP16</Badge>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                              {t.savings || 'Savings'} {((fp32Result.totalVRAM - fp16Result.totalVRAM) / fp32Result.totalVRAM * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ({fp32Result.totalVRAM - fp16Result.totalVRAM} GB)
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      
                      {int8Result && (
                        <Card className="text-center">
                          <CardContent className="">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Badge variant="outline">FP32</Badge>
                              <TrendingDown className="h-4 w-4" />
                              <Badge variant="outline">INT8</Badge>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                              {t.savings || 'Savings'} {((fp32Result.totalVRAM - int8Result.totalVRAM) / fp32Result.totalVRAM * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ({fp32Result.totalVRAM - int8Result.totalVRAM} GB)
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      
                      <Card className="text-center">
                        <CardContent className="">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">{t.precisionTradeoff || 'Precision Trade-off'}</span>
                          </div>
                          <p className="text-sm">
                            {t.precisionTradeoffDesc || 'Lower precision may affect model performance. Consider testing INT8 or FP16 effects first.'}
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
