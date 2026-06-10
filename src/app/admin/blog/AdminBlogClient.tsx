'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, FileText, Loader2, Plus, Save, Send, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { type BlogContentBlock, type BlogPost as BlogPostType } from '@/lib/blog';
import { BlogPost } from '@/views/BlogPost';

type BlogStatus = 'draft' | 'published';

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: BlogContentBlock[] | unknown;
  category: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  status: BlogStatus;
  published_at: string | null;
  updated_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean | null;
};

type BlogForm = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tagsText: string;
  coverImageUrl: string;
  coverImageAlt: string;
  authorName: string;
  status: BlogStatus;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  contentText: string;
};

const starterContent: BlogContentBlock[] = [
  {
    type: 'paragraph',
    text: 'Escreva a introducao do artigo aqui. Explique o problema, a promessa do conteudo e para quem esse guia foi feito.',
  },
  {
    type: 'heading',
    level: 2,
    text: 'Primeiro ponto importante',
  },
  {
    type: 'paragraph',
    text: 'Desenvolva o primeiro ponto com exemplos praticos e links internos quando fizer sentido.',
  },
  {
    type: 'faq',
    items: [
      {
        question: 'Pergunta frequente do cliente?',
        answer: 'Resposta curta, clara e util para aparecer no post e no schema de FAQ.',
      },
    ],
  },
];

const emptyForm: BlogForm = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  category: 'Guias',
  tagsText: '',
  coverImageUrl: 'https://lumecontrolesolar.com.br/hero-bg.webp',
  coverImageAlt: '',
  authorName: 'LUME Controle Solar',
  status: 'draft',
  publishedAt: '',
  seoTitle: '',
  seoDescription: '',
  featured: false,
  contentText: JSON.stringify(starterContent, null, 2),
};

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toDateTimeLocal(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  if (!value) return null;
  return new Date(value).toISOString();
}

function formFromRow(row: BlogPostRow): BlogForm {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    category: row.category || 'Guias',
    tagsText: (row.tags || []).join(', '),
    coverImageUrl: row.cover_image_url || '',
    coverImageAlt: row.cover_image_alt || row.title,
    authorName: row.author_name || 'LUME Controle Solar',
    status: row.status,
    publishedAt: toDateTimeLocal(row.published_at),
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    featured: Boolean(row.featured),
    contentText: JSON.stringify(row.content || [], null, 2),
  };
}

function parseContent(contentText: string): BlogContentBlock[] {
  const parsed = JSON.parse(contentText) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('O conteudo precisa ser um array JSON de blocos.');
  }
  return parsed as BlogContentBlock[];
}

function parseTags(tagsText: string) {
  return tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function previewPostFromForm(form: BlogForm, content: BlogContentBlock[]): BlogPostType {
  const now = new Date().toISOString();

  return {
    id: form.id || 'preview',
    title: form.title || 'Titulo do post',
    slug: form.slug || 'preview',
    excerpt: form.excerpt || 'Resumo do post para preview.',
    content,
    category: form.category || 'Guias',
    tags: parseTags(form.tagsText),
    coverImageUrl: form.coverImageUrl || null,
    coverImageAlt: form.coverImageAlt || form.title || 'Imagem do post',
    authorName: form.authorName || 'LUME Controle Solar',
    publishedAt: fromDateTimeLocal(form.publishedAt) || now,
    updatedAt: now,
    seoTitle: form.seoTitle || null,
    seoDescription: form.seoDescription || null,
    featured: form.featured,
  };
}

export function AdminBlogClient() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const contentState = useMemo(() => {
    try {
      const content = parseContent(form.contentText);
      return { content, error: null as string | null };
    } catch (error) {
      return {
        content: starterContent,
        error: error instanceof Error ? error.message : 'JSON invalido.',
      };
    }
  }, [form.contentText]);

  const parsedContent = contentState.content;
  const contentError = contentState.error;
  const previewPost = useMemo(() => previewPostFromForm(form, parsedContent), [form, parsedContent]);

  const loadPosts = useCallback(async (selectFirstPost = false) => {
    if (!supabase) {
      toast.error('Supabase nao configurado.');
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const rows = (data || []) as BlogPostRow[];
    setPosts(rows);
    if (selectFirstPost && rows.length > 0) {
      setForm(formFromRow(rows[0]));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPosts(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPosts]);

  const updateForm = <K extends keyof BlogForm>(key: K, value: BlogForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const createNewPost = () => {
    setForm({
      ...emptyForm,
      contentText: JSON.stringify(starterContent, null, 2),
    });
    setActiveTab('editor');
  };

  const savePost = async (nextStatus?: BlogStatus) => {
    if (!supabase) return;

    let content: BlogContentBlock[];
    try {
      content = parseContent(form.contentText);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'JSON invalido.');
      setActiveTab('editor');
      return;
    }

    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Titulo e slug sao obrigatorios.');
      return;
    }

    const status = nextStatus || form.status;
    const publishedAt =
      status === 'published'
        ? fromDateTimeLocal(form.publishedAt) || new Date().toISOString()
        : fromDateTimeLocal(form.publishedAt);

    setSaving(true);
    const payload = {
      id: form.id || undefined,
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category.trim() || 'Guias',
      tags: parseTags(form.tagsText),
      cover_image_url: form.coverImageUrl.trim() || null,
      cover_image_alt: form.coverImageAlt.trim() || form.title.trim(),
      author_name: form.authorName.trim() || 'LUME Controle Solar',
      status,
      published_at: publishedAt,
      seo_title: form.seoTitle.trim() || null,
      seo_description: form.seoDescription.trim() || null,
      featured: form.featured,
      content,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(payload, { onConflict: 'slug' })
      .select('*')
      .single();

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(status === 'published' ? 'Post publicado.' : 'Rascunho salvo.');
    const row = data as BlogPostRow;
    setForm(formFromRow(row));
    await loadPosts();
  };

  return (
    <div className="min-h-screen bg-[#040811] text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0f1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      <header className="border-b border-white/10 bg-black/20 px-5 py-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c9a227]">Admin LUME</p>
            <h1 className="mt-2 font-montserrat text-3xl font-black">Blog</h1>
            <p className="mt-1 text-sm text-white/45">Crie rascunhos, revise o preview e publique sem colar SQL.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={createNewPost}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold transition hover:border-[#c9a227]/50"
            >
              <Plus className="h-4 w-4" />
              Novo post
            </button>
            <button
              type="button"
              onClick={() => savePost('draft')}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-sm font-bold text-[#c9a227] transition hover:bg-[#c9a227]/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar rascunho
            </button>
            <button
              type="button"
              onClick={() => savePost('published')}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c9a227] px-4 py-2 text-sm font-black text-[#040811] transition hover:brightness-110 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Publicar
            </button>
          </div>
        </div>
      </header>

      <main className="grid min-h-[calc(100vh-96px)] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-black/10 p-4 lg:border-r lg:border-b-0">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white/70">
            <FileText className="h-4 w-4 text-[#c9a227]" />
            Posts
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-white/45">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => {
                    setForm(formFromRow(post));
                    setActiveTab('editor');
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    form.id === post.id
                      ? 'border-[#c9a227]/50 bg-[#c9a227]/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest text-[#c9a227]">{post.status}</span>
                  <h2 className="mt-2 line-clamp-2 font-montserrat text-sm font-bold">{post.title}</h2>
                  <p className="mt-1 truncate text-xs text-white/40">/{post.slug}</p>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="min-w-0">
          <div className="sticky top-0 z-20 flex gap-2 border-b border-white/10 bg-[#040811]/95 p-4 backdrop-blur">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                activeTab === 'editor' ? 'bg-[#c9a227] text-[#040811]' : 'bg-white/5 text-white/70'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                activeTab === 'preview' ? 'bg-[#c9a227] text-[#040811]' : 'bg-white/5 text-white/70'
              }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>

          {activeTab === 'editor' ? (
            <div className="grid gap-5 p-5 lg:grid-cols-2 lg:p-8">
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Titulo</span>
                <input
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((current) => ({
                      ...current,
                      title,
                      slug: current.slug || slugify(title),
                      coverImageAlt: current.coverImageAlt || title,
                    }));
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) => updateForm('slug', slugify(event.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Resumo</span>
                <textarea
                  value={form.excerpt}
                  onChange={(event) => updateForm('excerpt', event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Categoria</span>
                <input
                  value={form.category}
                  onChange={(event) => updateForm('category', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Tags separadas por virgula</span>
                <input
                  value={form.tagsText}
                  onChange={(event) => updateForm('tagsText', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Imagem principal</span>
                <input
                  value={form.coverImageUrl}
                  onChange={(event) => updateForm('coverImageUrl', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Alt da imagem</span>
                <input
                  value={form.coverImageAlt}
                  onChange={(event) => updateForm('coverImageAlt', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">SEO title</span>
                <input
                  value={form.seoTitle}
                  onChange={(event) => updateForm('seoTitle', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Publicado em</span>
                <input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(event) => updateForm('publishedAt', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">SEO description</span>
                <textarea
                  value={form.seoDescription}
                  onChange={(event) => updateForm('seoDescription', event.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-[#c9a227]"
                />
              </label>

              <div className="flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-2">
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateForm('featured', event.target.checked)}
                  />
                  Destaque no blog
                </label>
                <button
                  type="button"
                  onClick={() => savePost(form.status === 'published' ? 'draft' : 'published')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white/70 transition hover:border-[#c9a227]/50"
                >
                  <UploadCloud className="h-4 w-4" />
                  {form.status === 'published' ? 'Voltar para rascunho' : 'Publicar agora'}
                </button>
              </div>

              <label className="space-y-2 lg:col-span-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Conteudo em blocos JSON</span>
                {contentError && <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{contentError}</p>}
                <textarea
                  value={form.contentText}
                  onChange={(event) => updateForm('contentText', event.target.value)}
                  rows={26}
                  spellCheck={false}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm leading-6 outline-none transition focus:border-[#c9a227]"
                />
              </label>
            </div>
          ) : (
            <div className="bg-[#04080f]">
              <div className="border-b border-[#c9a227]/20 bg-[#c9a227]/10 px-5 py-3 text-sm font-bold text-[#c9a227]">
                Preview interno: este visual usa o mesmo template do post publico.
              </div>
              <BlogPost post={previewPost} relatedPosts={[]} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
