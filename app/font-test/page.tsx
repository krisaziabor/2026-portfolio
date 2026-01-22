'use client';

import { useState } from 'react';

export default function FontTest() {
  const [settings, setSettings] = useState({
    liningNums: true,
    proportionalNums: true,
    oldstyleNums: false,
    tabularNums: false,
    kern: true,
    liga: true,
    calt: true,
    ss01: false,
    ss02: false,
  });

  const buildFeatureSettings = () => {
    const features: string[] = [];
    if (settings.liningNums) features.push('"lnum" 1');
    if (settings.proportionalNums) features.push('"pnum" 1');
    if (settings.oldstyleNums) features.push('"onum" 1');
    if (settings.tabularNums) features.push('"tnum" 1');
    if (settings.kern) features.push('"kern" 1');
    if (settings.liga) features.push('"liga" 1');
    if (settings.calt) features.push('"calt" 1');
    if (settings.ss01) features.push('"ss01" 1');
    if (settings.ss02) features.push('"ss02" 1');
    
    // Disable conflicting features
    if (settings.liningNums && !settings.oldstyleNums) features.push('"onum" 0');
    if (settings.proportionalNums && !settings.tabularNums) features.push('"tnum" 0');
    if (settings.oldstyleNums && !settings.liningNums) features.push('"lnum" 0');
    if (settings.tabularNums && !settings.proportionalNums) features.push('"pnum" 0');
    
    return features.join(', ');
  };

  const buildVariantNumeric = () => {
    const variants: string[] = [];
    if (settings.liningNums) variants.push('lining-nums');
    if (settings.proportionalNums) variants.push('proportional-nums');
    if (settings.oldstyleNums) variants.push('oldstyle-nums');
    if (settings.tabularNums) variants.push('tabular-nums');
    return variants.join(' ') || 'normal';
  };

  const featureSettings = buildFeatureSettings();
  const variantNumeric = buildVariantNumeric();

  const testTexts = {
    numbers: '0123456789 2026 12345 67890',
    arrows: '↗ → ← ↑ ↓',
    symbols: '& @ # $ % * + =',
    ampersands: '& &amp; &',
    mixed: 'I worked at Kensho, S&P Global, and cyclio in 2024 & 2025.',
    bio: 'I study Computer Science and Fine Arts at Yale and lead the university\'s design community & studio.',
  };

  return (
    <div className="min-h-screen p-12" style={{ backgroundColor: '#F9F8F6' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">Lector Font Test Page</h1>

        {/* Controls */}
        <div className="bg-white p-6 rounded border" style={{ borderColor: '#DBD8D8' }}>
          <h2 className="text-xl font-semibold mb-4">Font Feature Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.liningNums}
                onChange={(e) => setSettings({ ...settings, liningNums: e.target.checked })}
              />
              <span>Lining Numbers (lnum)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.proportionalNums}
                onChange={(e) => setSettings({ ...settings, proportionalNums: e.target.checked })}
              />
              <span>Proportional Numbers (pnum)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.oldstyleNums}
                onChange={(e) => setSettings({ ...settings, oldstyleNums: e.target.checked })}
              />
              <span>Oldstyle Numbers (onum)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.tabularNums}
                onChange={(e) => setSettings({ ...settings, tabularNums: e.target.checked })}
              />
              <span>Tabular Numbers (tnum)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.kern}
                onChange={(e) => setSettings({ ...settings, kern: e.target.checked })}
              />
              <span>Kerning (kern)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.liga}
                onChange={(e) => setSettings({ ...settings, liga: e.target.checked })}
              />
              <span>Ligatures (liga)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.calt}
                onChange={(e) => setSettings({ ...settings, calt: e.target.checked })}
              />
              <span>Contextual Alternates (calt)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.ss01}
                onChange={(e) => setSettings({ ...settings, ss01: e.target.checked })}
              />
              <span>Stylistic Set 1 (ss01)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.ss02}
                onChange={(e) => setSettings({ ...settings, ss02: e.target.checked })}
              />
              <span>Stylistic Set 2 (ss02)</span>
            </label>
          </div>
        </div>

        {/* CSS Output */}
        <div className="bg-white p-6 rounded border" style={{ borderColor: '#DBD8D8' }}>
          <h2 className="text-xl font-semibold mb-4">CSS Output</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>font-variant-numeric:</strong> {variantNumeric}
            </div>
            <div>
              <strong>font-feature-settings:</strong> {featureSettings || 'normal'}
            </div>
          </div>
        </div>

        {/* Test Samples */}
        <div className="space-y-6">
          {Object.entries(testTexts).map(([key, text]) => (
            <div key={key} className="bg-white p-6 rounded border" style={{ borderColor: '#DBD8D8' }}>
              <h3 className="text-lg font-semibold mb-3 capitalize">{key}</h3>
              <div
                className="font-[family-name:var(--font-lector)] text-2xl"
                style={{
                  fontVariantNumeric: variantNumeric,
                  fontFeatureSettings: featureSettings || 'normal',
                  color: '#574C41',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                {text}
              </div>
              <div className="mt-2 text-sm text-gray-500 font-mono">
                {text}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison: Default vs Custom */}
        <div className="bg-white p-6 rounded border" style={{ borderColor: '#DBD8D8' }}>
          <h2 className="text-xl font-semibold mb-4">Comparison</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Default (no features)</h3>
              <div className="font-[family-name:var(--font-lector)] text-xl" style={{ color: '#574C41' }}>
                {testTexts.numbers} {testTexts.arrows} {testTexts.ampersands}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">With Current Settings</h3>
              <div
                className="font-[family-name:var(--font-lector)] text-xl"
                style={{
                  fontVariantNumeric: variantNumeric,
                  fontFeatureSettings: featureSettings || 'normal',
                  color: '#574C41',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                }}
              >
                {testTexts.numbers} {testTexts.arrows} {testTexts.ampersands}
              </div>
            </div>
          </div>
        </div>

        {/* Copy CSS Button */}
        <div className="bg-white p-6 rounded border" style={{ borderColor: '#DBD8D8' }}>
          <h2 className="text-xl font-semibold mb-4">Copy CSS</h2>
          <button
            onClick={() => {
              const css = `.lector-font {
  font-variant-numeric: ${variantNumeric};
  font-feature-settings: ${featureSettings || 'normal'};
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;
              navigator.clipboard.writeText(css);
              alert('CSS copied to clipboard!');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Copy CSS to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
