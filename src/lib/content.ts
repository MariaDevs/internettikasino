import fs from 'node:fs';
import path from 'node:path';
import { Marked, type Tokens } from 'marked';
import { slugify } from './site';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

export interface Heading {
  id: string;
  text: string;
  depth: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Rendered {
  /** HTML split around `<!-- casino-list:N -->` markers; listIndexes[i] sits after segments[i]. */
  segments: string[];
  listIndexes: number[];
  headings: Heading[];
  faqs: Faq[];
  wordCount: number;
}

const stripMd = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Pull Q&A pairs out of the FAQ section so we can emit FAQPage schema.
 * WordPress content uses two shapes: `### Question` + paragraphs, or
 * `**Question?**` followed by the answer in the same/next paragraph.
 */
export function extractFaqs(md: string): Faq[] {
  const start = md.search(/^## .*(usein kysy|useimmiten kysy|ukk)/im);
  if (start === -1) return [];
  const rest = md.slice(start).split('\n').slice(1).join('\n');
  const end = rest.search(/^(## |\* \* \*)/m);
  const section = end === -1 ? rest : rest.slice(0, end);
  const blocks = section.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const faqs: Faq[] = [];
  let current: Faq | null = null;
  for (const block of blocks) {
    const h3 = block.match(/^###\s+(.+)$/m);
    const bold = block.match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
    if (h3 && block.startsWith('###')) {
      if (current) faqs.push(current);
      current = { question: stripMd(h3[1]), answer: stripMd(block.replace(h3[0], '')) };
    } else if (bold && /\?\s*$/.test(bold[1])) {
      if (current) faqs.push(current);
      current = { question: stripMd(bold[1]), answer: stripMd(bold[2]) };
    } else if (current) {
      current.answer = `${current.answer} ${stripMd(block)}`.trim();
    }
  }
  if (current) faqs.push(current);
  return faqs.filter((f) => f.question && f.answer);
}

export function renderMarkdown(md: string): Rendered {
  const headings: Heading[] = [];
  const used = new Set<string>();
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const html = this.parser.parseInline(tokens);
        const text = html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        let id = slugify(text) || 'osio';
        while (used.has(id)) id += '-2';
        used.add(id);
        if (depth === 2) headings.push({ id, text, depth });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const t = title ? ` title="${title}"` : '';
        if (href.startsWith('/go/')) {
          return `<a href="${href}" rel="nofollow sponsored noopener" target="_blank" class="cta-link"${t}>${text}</a>`;
        }
        if (/^https?:\/\//.test(href)) {
          return `<a href="${href}" rel="noopener" target="_blank"${t}>${text}</a>`;
        }
        return `<a href="${href}"${t}>${text}</a>`;
      },
      image({ href, title, text }: Tokens.Image) {
        const t = title ? ` title="${title}"` : '';
        return `<img src="${href}" alt="${text}"${t} loading="lazy" decoding="async">`;
      },
    },
  });

  const parts = md.split(/<!-- casino-list:(\d+) -->/);
  const segments: string[] = [];
  const listIndexes: number[] = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1) listIndexes.push(Number(part));
    else segments.push(postProcess(marked.parse(part) as string));
  });

  return {
    segments,
    listIndexes,
    headings,
    faqs: extractFaqs(md),
    wordCount: stripMd(md).split(' ').length,
  };
}

/** Raw HTML tables from WordPress need the same scroll wrapper as GFM ones. */
function postProcess(html: string): string {
  return html
    .replace(/<table/g, '<div class="table-wrap"><table')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<p>\s*<\/p>/g, '');
}

export function loadContent(kind: 'pages' | 'posts' | 'reviews', slug: string): Rendered {
  const file = path.join(CONTENT_DIR, kind, `${slug || 'home'}.md`);
  return renderMarkdown(fs.readFileSync(file, 'utf8'));
}

export function readingTime(words: number) {
  return Math.max(1, Math.round(words / 200));
}
