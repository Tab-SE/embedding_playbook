"use client";

import { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { TableauEmbed } from '@/components';

export const description = "A translated dashboard with language selector to toggle between different languages using Tableau parameters.";

export const Translation = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Available languages - these should match the parameter values in Tableau
  const languages = ['English', 'Spanish', 'French', 'Finnish'];

  // Apply parameter change when selectedLanguage changes
  useEffect(() => {
    const applyParameter = async () => {
      const applyParameterToViz = async () => {
        // Try multiple ways to find the viz element
        let viz = document.getElementById('translationViz');

        // If not found by ID, try querySelector
        if (!viz) {
          const tableauVizElements = document.querySelectorAll('tableau-viz');
          if (tableauVizElements.length > 0) {
            viz = tableauVizElements[0];
          }
        }

        if (!viz) {
          setTimeout(() => applyParameterToViz(), 500);
          return;
        }

        try {
          // Check if workbook exists by accessing it safely
          if (!viz.workbook) {
            setTimeout(() => applyParameterToViz(), 500);
            return;
          }
        } catch (error) {
          // Viz workbook not ready yet
          setTimeout(() => applyParameterToViz(), 500);
          return;
        }

        try {
          const workbook = viz.workbook;

          // Change the parameter value
          await workbook.changeParameterValueAsync('Language Selector', selectedLanguage);
          console.log(`✅ Changed language parameter to: ${selectedLanguage}`);
        } catch (error) {
          console.error('Error changing parameter:', error);
          // Parameter might not exist or has different name, try alternative names
          try {
            await viz.workbook.changeParameterValueAsync('LanguageSelector', selectedLanguage);
            console.log(`✅ Changed language parameter (alternative name) to: ${selectedLanguage}`);
          } catch (err2) {
            console.error('Error with alternative parameter name:', err2);
          }
        }
      };

      await applyParameterToViz();
    };

    applyParameter();
  }, [selectedLanguage]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className='dark:bg-stone-900 shadow-xl'>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Translated Dashboard
                </CardTitle>
                <CardDescription>
                  View the dashboard in different languages using the language selector
                </CardDescription>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="languageFilter" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Language:
                </label>
                <select
                  id="languageFilter"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 xs:p-6 xs:pt-0">
            <TableauEmbed
              id="translationViz"
              src='https://prod-useast-b.online.tableau.com/t/embeddingplaybook/views/QuotaAttainment-Translated/Dashboard1'
              hideTabs={true}
              toolbar='hidden'
              className='
              min-w-[300px] min-h-[600px]
              sm:min-w-[600px] sm:min-h-[800px]
              md:min-w-[800px] md:min-h-[1000px]
              lg:min-w-[1000px] lg:min-h-[1200px]
              xl:min-w-[1200px] xl:min-h-[1400px]
              2xl:min-w-[1400px] 2xl:min-h-[1600px]
              '
              layouts = {{
                'xs': { 'device': 'phone' },
                'sm': { 'device': 'tablet' },
                'md': { 'device': 'default' },
                'lg': { 'device': 'default' },
                'xl': { 'device': 'desktop' },
                'xl2': { 'device': 'desktop' },
              }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

