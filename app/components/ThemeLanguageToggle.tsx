'use client';

import { Moon, Sun, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/app/contexts/AppContext';

export function ThemeLanguageToggle() {
  const { theme, language, toggleTheme, toggleLanguage } = useApp();

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2 z-50">
      {/* 语言切换 */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="w-10 h-10 p-0"
      >
        <Languages className="h-4 w-4" />
        <span className="sr-only">Toggle language</span>
      </Button>
      
      {/* 主题切换 */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="w-10 h-10 p-0"
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      {/* 当前设置指示器 */}
      <div className="hidden sm:flex text-xs text-muted-foreground bg-background/80 backdrop-blur-sm border rounded px-2 py-1">
        {language.toUpperCase()} | {theme === 'light' ? 'Light' : 'Dark'}
      </div>
    </div>
  );
}
