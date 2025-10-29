# Language Selector Implementation Guide

The language selector is now available on every page through a global context. Here's how to use it:

## 🚀 Quick Setup

The `LanguageProvider` is already wrapped around the entire app in `src/app/layout.tsx`, so the language selector is available everywhere.

## 📝 Adding Language Selector to Any Page

### 1. Import the Components

```jsx
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
```

### 2. Use the Language Context

```jsx
export const YourComponent = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t.title}</h1>
      <p>{t.subtitle}</p>
      {/* Your content here */}
    </div>
  );
};
```

### 3. Add the Language Selector to Your Header

```jsx
<div className="flex items-center gap-4">
  <LanguageSelector />
  {/* Other header elements */}
</div>
```

## 🌍 Available Languages

- **🇺🇸 English** (default)
- **🇪🇸 Español** (Spanish)
- **🇫🇷 Français** (French)

## 📚 Available Translations

The `t` object contains all translated strings. Common keys include:

- `t.title` - Page title
- `t.subtitle` - Page subtitle
- `t.close` - Close button
- `t.previous` - Previous button
- `t.next` - Next button
- `t.email` - Email label
- `t.subject` - Subject label
- `t.message` - Message label

## 🔧 Example Implementation

Here's a complete example of adding the language selector to a page:

```jsx
"use client";

import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

export const MyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-slate-300">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              {t.close}
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-6">
        <p className="text-white">{t.message}</p>
      </div>
    </div>
  );
};
```

## ✨ Features

- **Global State**: Language selection persists across all pages
- **Automatic Translation**: All text updates instantly when language changes
- **Click Outside to Close**: Dropdown closes when clicking outside
- **Flag Icons**: Visual language indicators with country flags
- **Responsive Design**: Works on all screen sizes

## 🎯 Current Pages with Language Selector

- ✅ Home page (`/demo/veriforce`)
- ✅ Safety Dashboard (`/demo/veriforce/safety`)

## 📝 Adding to New Pages

To add the language selector to any new page, simply:

1. Import `LanguageSelector` and `useLanguage`
2. Add `<LanguageSelector />` to your header
3. Use `t.keyName` for any text that should be translated

The language context is already available everywhere, so no additional setup is needed!
