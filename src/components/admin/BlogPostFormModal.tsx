import React, { useState } from 'react';
import { X, FileText, Save, Image as ImageIcon } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogPostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Partial<BlogPost>) => Promise<boolean>;
  postToEdit?: BlogPost | null;
}

export const BlogPostFormModal: React.FC<BlogPostFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  postToEdit,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(postToEdit?.title || '');
  const [slug, setSlug] = useState(postToEdit?.slug || '');
  const [category, setCategory] = useState(postToEdit?.category || 'Land Verification Guides');
  const [author, setAuthor] = useState(postToEdit?.author || 'Legit Properties Legal Team');
  const [coverImage, setCoverImage] = useState(
    postToEdit?.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
  );
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [content, setContent] = useState(postToEdit?.content || '');
  const [published, setPublished] = useState(postToEdit?.published ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!postToEdit) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Article title and content are required.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const payload: Partial<BlogPost> = {
      ...(postToEdit?.id ? { id: postToEdit.id } : {}),
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category.trim(),
      author: author.trim(),
      coverImage: coverImage.trim(),
      excerpt: excerpt.trim() || content.substring(0, 160) + '...',
      content: content.trim(),
      published,
      createdAt: postToEdit?.createdAt || new Date().toISOString()
    };

    const success = await onSave(payload);
    setIsSaving(false);
    if (success) {
      onClose();
    } else {
      setErrorMsg('Failed to save blog post to Supabase.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#102033] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#167A5A] rounded-xl text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {postToEdit ? 'Edit Article' : 'Create New Blog Post'}
              </h3>
              <p className="text-xs text-slate-400">Syncs to Supabase <code className="text-emerald-400 font-mono">blog_posts</code> table</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 text-xs sm:text-sm">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Post Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. How to Verify a Governor's Consent in Alausa Land Registry"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 bg-white"
              >
                <option value="Land Verification Guides">Land Verification Guides</option>
                <option value="Diaspora Investment Tips">Diaspora Investment Tips</option>
                <option value="Legal & C of O Due Diligence">Legal & C of O Due Diligence</option>
                <option value="Real Estate Market Reports">Real Estate Market Reports</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Short Excerpt (Summary)</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary for previews and social sharing..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Article Body Content (Markdown / Text) *</label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the article content here. You can use markdown headings, paragraphs, and bullet points..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#167A5A] text-slate-900 font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="published-toggle"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 text-[#167A5A] rounded-md focus:ring-[#167A5A]"
            />
            <label htmlFor="published-toggle" className="font-semibold text-slate-800 text-xs cursor-pointer">
              Publish immediately (visible to public readers)
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#167A5A] hover:bg-[#13684d] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{postToEdit ? 'Save Changes' : 'Publish Article'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
