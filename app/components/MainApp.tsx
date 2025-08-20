'use client';

import Calculator from './Calculator';
import PrecisionComparer from './PrecisionComparer';
import { ThemeLanguageToggle } from './ThemeLanguageToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/app/contexts/AppContext';
import { translations } from '@/app/lib/translations';

export default function MainApp() {
  const { language } = useApp();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-background py-8 relative">
      <ThemeLanguageToggle />
      
      <div className="max-w-7xl mx-auto px-4">
        <Tabs defaultValue="calculator" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="calculator">{t.calculator}</TabsTrigger>
              <TabsTrigger value="comparer">{t.precisionComparer}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calculator" className="space-y-6">
            <Calculator />
          </TabsContent>

          <TabsContent value="comparer" className="space-y-6">
            <PrecisionComparer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
