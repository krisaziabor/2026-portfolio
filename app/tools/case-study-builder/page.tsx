'use client';

import { useState, useCallback } from 'react';
import type { CaseStudy, Diptych, DiptychMedia } from '@/types/case-study';

const RATIOS = ['30-70', '40-60', '50-50', '60-40', '70-30'] as const;
const ALIGNMENTS = ['top', 'center', 'bottom'] as const;

const DEFAULT_SECTIONS = ['Overview', 'Context', 'Strategy', 'Designs', 'Reflections'];

type DiptychForm = {
  idOverride: string; // empty = auto-generate
  section: string;
  ratio: (typeof RATIOS)[number];
  alignment: (typeof ALIGNMENTS)[number];
  textContent: string;
  mediaType: 'image' | 'video';
  imageSrc: string;
  imageAlt: string;
  vimeoId: string;
  hasAudio: boolean;
  aspectRatio: string;
  posterTime: string; // number as string for input
};

function emptyDiptychForm(firstSection: string): DiptychForm {
  return {
    idOverride: '',
    section: firstSection,
    ratio: '50-50',
    alignment: 'top',
    textContent: '',
    mediaType: 'image',
    imageSrc: '',
    imageAlt: '',
    vimeoId: '',
    hasAudio: false,
    aspectRatio: '16/9',
    posterTime: '',
  };
}

function formToMedia(form: DiptychForm): DiptychMedia {
  const aspectRatio = form.aspectRatio.trim() || undefined;
  const posterTime = form.posterTime.trim() ? Number(form.posterTime) : undefined;
  if (form.mediaType === 'image') {
    return {
      type: 'image',
      src: form.imageSrc || '/placeholder.png',
      alt: form.imageAlt || 'Image',
      ...(aspectRatio && { aspectRatio }),
    };
  }
  return {
    type: 'video',
    vimeoId: form.vimeoId || '0',
    hasAudio: form.hasAudio,
    ...(aspectRatio && { aspectRatio }),
    ...(posterTime != null && !Number.isNaN(posterTime) && { posterTime }),
  };
}

function formToDiptych(form: DiptychForm, slug: string, index: number): Diptych {
  const id = form.idOverride.trim() || `${slug}-${String(index + 1).padStart(2, '0')}`;
  return {
    id,
    section: form.section,
    ratio: form.ratio,
    alignment: form.alignment,
    text: { content: form.textContent.trim() || ' ' },
    media: formToMedia(form),
  };
}

function escapeTemplateLiteral(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function generateCaseStudyTS(meta: CaseStudyMeta, diptychs: Diptych[]): string {
  const slug = meta.slug || 'case-study';
  const varName = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const lines: string[] = [];
  lines.push("import type { CaseStudy } from '@/types/case-study';");
  lines.push('');
  lines.push(`export const ${varName}: CaseStudy = {`);
  lines.push(`  slug: '${slug.replace(/'/g, "\\'")}',`);
  lines.push(`  title: '${(meta.title || '').replace(/'/g, "\\'")}',`);
  lines.push(`  client: '${(meta.client || '').replace(/'/g, "\\'")}',`);
  lines.push(`  isProtected: ${meta.isProtected},`);
  lines.push(`  sequence: ${meta.sequence},`);
  lines.push(`  summary: '${(meta.summary || '').replace(/'/g, "\\'")}',`);
  lines.push(`  tags: [${(meta.tags || []).map((t) => `'${String(t).replace(/'/g, "\\'")}'`).join(', ')}],`);
  lines.push(`  sections: [${(meta.sections || []).map((s) => `'${String(s).replace(/'/g, "\\'")}'`).join(', ')}],`);
  const metadataFiltered = (meta.metadata || []).filter((item) => (item.key || '').trim() !== '' && (item.value || '').trim() !== '');
  if (metadataFiltered.length > 0) {
    lines.push('  metadata: [');
    metadataFiltered.forEach((item, i) => {
      const k = (item.key || '').replace(/'/g, "\\'");
      const v = (item.value || '').replace(/'/g, "\\'");
      lines.push(`    { key: '${k}', value: '${v}' }${i < metadataFiltered.length - 1 ? ',' : ''}`);
    });
    lines.push('  ],');
  }
  if ((meta.lede ?? '').trim() !== '') {
    const ledeEscaped = escapeTemplateLiteral(meta.lede!.trim());
    lines.push(`  lede: \`\n${ledeEscaped}\n  \`.trim(),`);
  }
  if ((meta.tagline ?? '').trim() !== '') {
    lines.push(`  tagline: '${(meta.tagline || '').replace(/'/g, "\\'")}',`);
  }
  if ((meta.skipLinkLabel ?? '').trim() !== '' && (meta.skipLinkTargetSection ?? '').trim() !== '') {
    lines.push(`  skipLink: { label: '${(meta.skipLinkLabel || '').replace(/'/g, "\\'")}', targetSection: '${(meta.skipLinkTargetSection || '').replace(/'/g, "\\'")}' },`);
  }
  lines.push('  diptychs: [');
  for (let i = 0; i < diptychs.length; i++) {
    const d = diptychs[i];
    const contentEscaped = escapeTemplateLiteral(d.text.content);
    lines.push('    {');
    lines.push(`      id: '${(d.id || '').replace(/'/g, "\\'")}',`);
    lines.push(`      section: '${(d.section || '').replace(/'/g, "\\'")}',`);
    lines.push(`      ratio: '${d.ratio}',`);
    lines.push(`      alignment: '${d.alignment}',`);
    lines.push('      text: {');
    lines.push(`        content: \`\n${contentEscaped}\n        \`.trim(),`);
    lines.push('      },');
    const mediaStr = d.media.type === 'image'
      ? (() => {
          const parts = [`type: 'image'`, `src: '${(d.media.src || '').replace(/'/g, "\\'")}'`, `alt: '${(d.media.alt || '').replace(/'/g, "\\'")}'`];
          if (d.media.aspectRatio) parts.push(`aspectRatio: '${String(d.media.aspectRatio).replace(/'/g, "\\'")}'`);
          return `{ ${parts.join(', ')} }`;
        })()
      : (() => {
          const parts = [`type: 'video'`, `vimeoId: '${d.media.vimeoId}'`, `hasAudio: ${d.media.hasAudio}`];
          if (d.media.aspectRatio) parts.push(`aspectRatio: '${String(d.media.aspectRatio).replace(/'/g, "\\'")}'`);
          if (d.media.posterTime != null) parts.push(`posterTime: ${d.media.posterTime}`);
          return `{ ${parts.join(', ')} }`;
        })();
    lines.push(`      media: ${mediaStr},`);
    lines.push('    }' + (i < diptychs.length - 1 ? ',' : ''));
  }
  lines.push('  ],');
  if (meta.nextCaseStudySlug) {
    lines.push(`  nextCaseStudySlug: '${meta.nextCaseStudySlug.replace(/'/g, "\\'")}',`);
  }
  if (meta.teaserVimeoId) {
    lines.push(`  teaserVimeoId: '${meta.teaserVimeoId.replace(/'/g, "\\'")}',`);
  }
  lines.push('};');
  return lines.join('\n');
}

interface CaseStudyMeta {
  slug: string;
  title: string;
  client: string;
  isProtected: boolean;
  sequence: number;
  summary: string;
  tags: string[];
  sections: string[];
  metadata: { key: string; value: string }[];
  lede: string;
  tagline: string;
  skipLinkLabel: string;
  skipLinkTargetSection: string;
  nextCaseStudySlug: string;
  teaserVimeoId: string;
}

const defaultMeta: CaseStudyMeta = {
  slug: 'my-case-study',
  title: 'My Case Study',
  client: 'Client Name',
  isProtected: false,
  sequence: 1,
  summary: 'One-line summary for navigation.',
  tags: [],
  sections: [...DEFAULT_SECTIONS],
  metadata: [],
  lede: '',
  tagline: '',
  skipLinkLabel: '',
  skipLinkTargetSection: '',
  nextCaseStudySlug: '',
  teaserVimeoId: '',
};

export default function CaseStudyBuilderPage() {
  const [meta, setMeta] = useState<CaseStudyMeta>(defaultMeta);
  const [diptychForms, setDiptychForms] = useState<DiptychForm[]>(() => [
    emptyDiptychForm(defaultMeta.sections[0] ?? 'Overview'),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportText, setExportText] = useState('');

  const slug = meta.slug || 'case-study';

  const updateMeta = useCallback((updates: Partial<CaseStudyMeta>) => {
    setMeta((m) => ({ ...m, ...updates }));
  }, []);

  const updateDiptychForm = useCallback((index: number, updates: Partial<DiptychForm>) => {
    setDiptychForms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  }, []);

  const addDiptych = useCallback(() => {
    const firstSection = meta.sections[0] ?? 'Overview';
    setDiptychForms((prev) => [...prev, emptyDiptychForm(firstSection)]);
    setSelectedIndex((i) => i + 1);
  }, [meta.sections]);

  const addSection = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setMeta((m) => ({
      ...m,
      sections: m.sections.includes(trimmed) ? m.sections : [...m.sections, trimmed],
    }));
  }, []);

  const removeSection = useCallback((sectionName: string) => {
    const nextSections = meta.sections.filter((s) => s !== sectionName);
    const fallback = nextSections[0] ?? 'Overview';
    setMeta((m) => ({ ...m, sections: nextSections }));
    setDiptychForms((prev) =>
      prev.map((f) => (f.section === sectionName ? { ...f, section: fallback } : f))
    );
  }, [meta.sections]);

  const addMetadata = useCallback(() => {
    setMeta((m) => ({ ...m, metadata: [...m.metadata, { key: '', value: '' }] }));
  }, []);

  const updateMetadata = useCallback((index: number, updates: { key?: string; value?: string }) => {
    setMeta((m) => {
      const next = [...m.metadata];
      next[index] = { ...next[index], ...updates };
      return { ...m, metadata: next };
    });
  }, []);

  const removeMetadata = useCallback((index: number) => {
    setMeta((m) => ({ ...m, metadata: m.metadata.filter((_, i) => i !== index) }));
  }, []);

  const removeDiptych = useCallback((index: number) => {
    setDiptychForms((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndex((i) =>
      i === index ? Math.max(0, index - 1) : i > index ? i - 1 : i
    );
  }, []);

  const handleExport = useCallback(() => {
    const diptychs = diptychForms.map((f, i) => formToDiptych(f, meta.slug || 'case-study', i));
    setExportText(generateCaseStudyTS(meta, diptychs));
    setExportOpen(true);
  }, [meta, diptychForms]);

  const copyExport = useCallback(() => {
    navigator.clipboard.writeText(exportText);
  }, [exportText]);

  const currentForm = diptychForms[selectedIndex];
  if (!currentForm) return null;

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-6">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="text-content text-2xl mb-6 font-normal">Case Study Builder</h1>

        <div className="flex flex-col gap-6 max-w-2xl">
            {/* Meta */}
            <section className="rounded border border-[#dbd8d8] bg-[#FCFCFC] p-4">
              <h2 className="text-content text-lg mb-3">Case study</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <label className="flex flex-col gap-1">
                  Slug
                  <input
                    type="text"
                    value={meta.slug}
                    onChange={(e) => updateMeta({ slug: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="my-case-study"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Title
                  <input
                    type="text"
                    value={meta.title}
                    onChange={(e) => updateMeta({ title: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Client
                  <input
                    type="text"
                    value={meta.client}
                    onChange={(e) => updateMeta({ client: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Sequence
                  <input
                    type="number"
                    value={meta.sequence}
                    onChange={(e) => updateMeta({ sequence: Number(e.target.value) || 0 })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                  />
                </label>
                <label className="sm:col-span-2 flex flex-col gap-1">
                  Summary — one-line description for navigation cards
                  <input
                    type="text"
                    value={meta.summary}
                    onChange={(e) => updateMeta({ summary: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="One-line summary"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Tags (comma-separated)
                  <input
                    type="text"
                    value={meta.tags.join(', ')}
                    onChange={(e) =>
                      updateMeta({
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="AI, Design, UX"
                  />
                </label>
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <span className="text-sm">Sections (order used in diptych dropdown)</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {meta.sections.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 rounded border border-[#dbd8d8] bg-white pl-2 pr-1 py-1 text-sm"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => removeSection(name)}
                          className="text-metadata hover:text-content leading-none"
                          title={`Remove section "${name}"`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-section-name"
                      placeholder="New section name"
                      className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white flex-1 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSection((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('new-section-name') as HTMLInputElement;
                        if (el) {
                          addSection(el.value);
                          el.value = '';
                        }
                      }}
                      className="text-sm px-3 py-1.5 rounded border border-[#dbd8d8] bg-white hover:bg-[#f5f5f5] text-content"
                    >
                      Add section
                    </button>
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={meta.isProtected}
                    onChange={(e) => updateMeta({ isProtected: e.target.checked })}
                  />
                  Protected
                </label>
                <label className="flex flex-col gap-1">
                  Next case study slug
                  <input
                    type="text"
                    value={meta.nextCaseStudySlug}
                    onChange={(e) => updateMeta({ nextCaseStudySlug: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="fidelity"
                  />
                </label>
                <div className="sm:col-span-2 flex flex-col gap-2">
                  <span className="text-sm">Metadata — custom key-value pairs</span>
                  {meta.metadata.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) => updateMetadata(i, { key: e.target.value })}
                        placeholder="Key"
                        className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white flex-1 text-sm"
                      />
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateMetadata(i, { value: e.target.value })}
                        placeholder="Value"
                        className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white flex-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeMetadata(i)}
                        className="text-metadata hover:text-content"
                        title="Remove row"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMetadata}
                    className="text-sm px-2 py-1 rounded border border-[#dbd8d8] bg-white hover:bg-[#f5f5f5] text-content self-start"
                  >
                    + Add metadata row
                  </button>
                </div>
                <label className="sm:col-span-2 flex flex-col gap-1">
                  Lede — introductory body text on the title card (markdown)
                  <textarea
                    value={meta.lede}
                    onChange={(e) => updateMeta({ lede: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white min-h-[80px] text-sm"
                    placeholder="Optional opening paragraph..."
                  />
                </label>
                <label className="sm:col-span-2 flex flex-col gap-1">
                  Tagline — short subtitle (light markdown)
                  <input
                    type="text"
                    value={meta.tagline}
                    onChange={(e) => updateMeta({ tagline: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="Optional tagline"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Skip link label (optional)
                  <input
                    type="text"
                    value={meta.skipLinkLabel}
                    onChange={(e) => updateMeta({ skipLinkLabel: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="Skip to content"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Skip link target section
                  <input
                    type="text"
                    value={meta.skipLinkTargetSection}
                    onChange={(e) => updateMeta({ skipLinkTargetSection: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="Overview"
                    list="skip-link-sections"
                  />
                  <datalist id="skip-link-sections">
                    {meta.sections.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </label>
                <label className="flex flex-col gap-1">
                  Teaser Vimeo ID
                  <input
                    type="text"
                    value={meta.teaserVimeoId}
                    onChange={(e) => updateMeta({ teaserVimeoId: e.target.value })}
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                    placeholder="1160310741"
                  />
                </label>
              </div>
            </section>

            {/* Diptych list & current form */}
            <section className="rounded border border-[#dbd8d8] bg-[#FCFCFC] p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-content text-lg">Diptychs</h2>
                <button
                  type="button"
                  onClick={addDiptych}
                  className="text-sm px-3 py-1.5 rounded border border-[#dbd8d8] bg-white hover:bg-[#f5f5f5] text-content"
                >
                  + Add diptych
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {diptychForms.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`px-2 py-1 rounded text-sm border ${
                      selectedIndex === i
                        ? 'border-[#8B6B5A] bg-[#8B6B5A] text-white'
                        : 'border-[#dbd8d8] bg-white hover:bg-[#f0f0f0] text-content'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <label className="flex flex-col gap-1 text-sm mb-3">
                ID (leave blank to auto-generate)
                <input
                  type="text"
                  value={currentForm.idOverride}
                  onChange={(e) => updateDiptychForm(selectedIndex, { idOverride: e.target.value })}
                  className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white font-mono"
                  placeholder={`${slug}-${String(selectedIndex + 1).padStart(2, '0')}`}
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-3">
                <label className="flex flex-col gap-1">
                  Section
                  <select
                    value={currentForm.section}
                    onChange={(e) =>
                      updateDiptychForm(selectedIndex, { section: e.target.value })
                    }
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                  >
                    {meta.sections.length === 0 ? (
                      <option value={currentForm.section}>{currentForm.section}</option>
                    ) : (
                      meta.sections.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))
                    )}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  Ratio
                  <select
                    value={currentForm.ratio}
                    onChange={(e) =>
                      updateDiptychForm(selectedIndex, {
                        ratio: e.target.value as (typeof RATIOS)[number],
                      })
                    }
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                  >
                    {RATIOS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  Vertical alignment
                  <select
                    value={currentForm.alignment}
                    onChange={(e) =>
                      updateDiptychForm(selectedIndex, {
                        alignment: e.target.value as (typeof ALIGNMENTS)[number],
                      })
                    }
                    className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                  >
                    {ALIGNMENTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1 text-sm mb-3">
                Text (Markdown)
                <textarea
                  value={currentForm.textContent}
                  onChange={(e) => updateDiptychForm(selectedIndex, { textContent: e.target.value })}
                  className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white min-h-[120px] font-mono text-sm"
                  placeholder="## Heading&#10;&#10;Paragraph with **bold**."
                />
              </label>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm">Media</span>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`media-${selectedIndex}`}
                    checked={currentForm.mediaType === 'image'}
                    onChange={() => updateDiptychForm(selectedIndex, { mediaType: 'image' })}
                  />
                  Image
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`media-${selectedIndex}`}
                    checked={currentForm.mediaType === 'video'}
                    onChange={() => updateDiptychForm(selectedIndex, { mediaType: 'video' })}
                  />
                  Video
                </label>
              </div>
              {currentForm.mediaType === 'image' ? (
                <div className="space-y-3 text-sm mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      Source
                      <input
                        type="text"
                        value={currentForm.imageSrc}
                        onChange={(e) => updateDiptychForm(selectedIndex, { imageSrc: e.target.value })}
                        className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                        placeholder="/academy/image.png"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Alt text
                      <input
                        type="text"
                        value={currentForm.imageAlt}
                        onChange={(e) => updateDiptychForm(selectedIndex, { imageAlt: e.target.value })}
                        className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white"
                        placeholder="Description"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1">
                    Aspect ratio
                    <input
                      type="text"
                      value={currentForm.aspectRatio}
                      onChange={(e) => updateDiptychForm(selectedIndex, { aspectRatio: e.target.value })}
                      className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white w-24"
                      placeholder="16/9"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-3 text-sm mb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex flex-col gap-1">
                      Source (Vimeo ID)
                      <input
                        type="text"
                        value={currentForm.vimeoId}
                        onChange={(e) =>
                          updateDiptychForm(selectedIndex, { vimeoId: e.target.value })
                        }
                        className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white w-32"
                        placeholder="1160310741"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={currentForm.hasAudio}
                        onChange={(e) =>
                          updateDiptychForm(selectedIndex, { hasAudio: e.target.checked })
                        }
                      />
                      Has audio
                    </label>
                  </div>
                  <label className="flex flex-col gap-1">
                    Aspect ratio
                    <input
                      type="text"
                      value={currentForm.aspectRatio}
                      onChange={(e) => updateDiptychForm(selectedIndex, { aspectRatio: e.target.value })}
                      className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white w-24"
                      placeholder="16/9"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    Poster time (seconds, optional)
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={currentForm.posterTime}
                      onChange={(e) => updateDiptychForm(selectedIndex, { posterTime: e.target.value })}
                      className="border border-[#dbd8d8] rounded px-2 py-1.5 bg-white w-24"
                      placeholder="0"
                    />
                  </label>
                </div>
              )}
              {diptychForms.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDiptych(selectedIndex)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove this diptych
                </button>
              )}
            </section>

            <button
              type="button"
              onClick={handleExport}
              className="rounded border border-[#8B6B5A] bg-[#8B6B5A] text-white px-4 py-2 hover:opacity-90"
            >
              Finish & get TS file
            </button>
        </div>
      </div>

      {/* Export modal */}
      {exportOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setExportOpen(false)}
        >
          <div
            className="bg-white rounded border border-[#dbd8d8] max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EBEBEB]">
              <h3 className="text-content text-lg">Copy your case study TS file</h3>
              <button
                type="button"
                onClick={() => setExportOpen(false)}
                className="text-metadata hover:text-content"
              >
                Close
              </button>
            </div>
            <textarea
              readOnly
              value={exportText}
              className="flex-1 p-4 font-mono text-sm border-0 resize-none focus:outline-none"
              rows={20}
            />
            <div className="px-4 py-3 border-t border-[#EBEBEB] flex justify-end gap-2">
              <button
                type="button"
                onClick={copyExport}
                className="rounded border border-[#8B6B5A] bg-[#8B6B5A] text-white px-4 py-2 hover:opacity-90"
              >
                Copy to clipboard
              </button>
              <button
                type="button"
                onClick={() => setExportOpen(false)}
                className="rounded border border-[#dbd8d8] px-4 py-2 hover:bg-[#f5f5f5]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
