import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Undo2,
  Redo2,
  Eye,
  Save,
  Check,
  Globe,
  Tag,
  Calendar,
  Sparkles,
  FileText,
  HelpCircle,
  Maximize2,
  Minus
} from 'lucide-react';
import { BlogPost } from '../../types';

interface WordPressClassicEditorProps {
  postToEdit?: BlogPost | null;
  onSave: (post: Partial<BlogPost>) => Promise<{ success: boolean; error?: string } | boolean>;
  onClose: () => void;
}

export const WordPressClassicEditor: React.FC<WordPressClassicEditorProps> = ({
  postToEdit,
  onSave,
  onClose
}) => {
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [slug, setSlug] = useState(postToEdit?.slug || '');
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [content, setContent] = useState(
    postToEdit?.content ||
      '<h2>Introduction to Prime Short Stays & Verified Real Estate</h2>\n<p>Exploring high-yield luxury shortlet investments in Nigeria requires meticulous legal auditing and guaranteed title documentation.</p>\n<h3>Why Location and Infrastructure Dictate Short-Stay Yields</h3>\n<p>Properties in Ikoyi, Maitama, and Peter Odili Road consistently produce superior rental yields due to uninterrupted power guarantees, stringent security, and proximity to diplomatic hubs.</p>'
  );
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || '');
  const [category, setCategory] = useState(postToEdit?.category || 'Short Stay & Real Estate');
  const [coverImage, setCoverImage] = useState(
    postToEdit?.coverImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  );
  const [isPublished, setIsPublished] = useState(postToEdit?.published ?? true);
  const [editorMode, setEditorMode] = useState<'visual' | 'text'>('visual');
  const [showToolbarRow2, setShowToolbarRow2] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug when title changes if new post
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!postToEdit) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  // Quick insertion helpers for classic WP toolbar
  const insertTag = (openTag: string, closeTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'Sample text';
    const replacement = `${openTag}${selectedText}${closeTag}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 50);
  };

  const insertLink = () => {
    const url = prompt('Enter URL (e.g. https://legitproperties.com/short-stay/lagos):', 'https://');
    if (url) {
      insertTag(`<a href="${url}" target="_blank">`, '</a>');
    }
  };

  const insertImageTag = () => {
    const url = prompt('Enter Image URL:', coverImage || 'https://');
    if (url) {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const imgTag = `\n<img src="${url}" alt="${title || 'Property View'}" class="w-full rounded-2xl my-4" />\n`;
      const newContent = content.substring(0, start) + imgTag + content.substring(start);
      setContent(newContent);
    }
  };

  // Word count & reading time
  const wordCount = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const handlePublish = async () => {
    if (!title.trim()) {
      setErrorMsg('Please enter a post title before publishing.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const payload: Partial<BlogPost> = {
      ...(postToEdit?.id ? { id: postToEdit.id } : {}),
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
      content,
      category,
      coverImage: coverImage.trim() || undefined,
      published: isPublished,
      author: 'Legit Properties Editorial',
      createdAt: postToEdit?.createdAt || new Date().toISOString()
    };

    const res = await onSave(payload);
    setIsSaving(false);

    if (res === true || (typeof res === 'object' && res.success)) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 700);
    } else {
      setErrorMsg(typeof res === 'object' && res.error ? res.error : 'Failed to publish post');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col font-sans text-slate-900 animate-fadeIn">
      
      {/* WordPress Classic Top Bar */}
      <div className="h-12 bg-[#23282d] text-slate-300 px-4 flex items-center justify-between border-b border-slate-700 select-none text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center font-serif text-xs">W</span>
            <span>Classic Post Editor</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Legit Properties SEO & Content Engine</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs transition-colors cursor-pointer"
          >
            Exit to Dashboard
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto bg-[#f1f1f1] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* Main Title Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-normal text-[#23282d]">
              {postToEdit ? 'Edit Post' : 'Add New Post'}
            </h1>
            
            {errorMsg && (
              <div className="px-3 py-1.5 bg-red-100 border border-red-300 text-red-800 text-xs rounded">
                {errorMsg}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 8 Cols: Classic Editor Main Column */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Post Title Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter title here"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ccd0d4] rounded shadow-inner text-lg sm:text-xl font-medium text-slate-900 focus:outline-none focus:border-[#007cba]"
                />

                {/* Permalink Slug row */}
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                  <strong>Permalink:</strong>
                  <span>https://legitproperties.com/insights/</span>
                  {isEditingSlug ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="px-1.5 py-0.5 border border-[#ccd0d4] bg-white text-xs text-slate-900 rounded"
                      />
                      <button
                        onClick={() => setIsEditingSlug(false)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold rounded"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <span className="bg-[#f0f0f1] px-1 py-0.5 rounded text-emerald-800 font-mono">
                      {slug || 'post-slug'}
                    </span>
                  )}
                  <button
                    onClick={() => setIsEditingSlug(!isEditingSlug)}
                    className="text-[#0073aa] hover:underline text-[11px] cursor-pointer"
                  >
                    {isEditingSlug ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>

              {/* Add Media Bar & Visual / Text Tabs */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={insertImageTag}
                  className="px-3 py-1.5 bg-white border border-[#ccd0d4] hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Add Media</span>
                </button>

                {/* Visual vs Text Switcher */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setEditorMode('visual')}
                    className={`px-3 py-1 text-xs font-medium rounded-t border-t border-l border-r ${
                      editorMode === 'visual'
                        ? 'bg-white border-[#ccd0d4] text-slate-900'
                        : 'bg-slate-200 border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('text')}
                    className={`px-3 py-1 text-xs font-medium rounded-t border-t border-l border-r ${
                      editorMode === 'text'
                        ? 'bg-white border-[#ccd0d4] text-slate-900'
                        : 'bg-slate-200 border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Text (HTML)
                  </button>
                </div>
              </div>

              {/* Classic WordPress Editor Container */}
              <div className="bg-white border border-[#ccd0d4] rounded shadow-xs overflow-hidden">
                
                {/* Toolbar Row 1 */}
                <div className="bg-[#f6f7f7] border-b border-[#ccd0d4] px-2 py-1.5 flex flex-wrap items-center gap-1 text-slate-700">
                  <button
                    type="button"
                    onClick={() => insertTag('<strong>', '</strong>')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTag('<em>', '</em>')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTag('<del>', '</del>')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Bulleted list"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Numbered list"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTag('<blockquote>', '</blockquote>')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Blockquote"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertTag('<hr class="my-4" />')}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Horizontal line"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={insertLink}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                    title="Insert/edit link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => setShowToolbarRow2(!showToolbarRow2)}
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-700 ml-auto"
                    title="Toggle Toolbar Kitchen Sink"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                {/* Toolbar Row 2 (Kitchen Sink) */}
                {showToolbarRow2 && (
                  <div className="bg-[#f0f0f1] border-b border-[#ccd0d4] px-2 py-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'h1') insertTag('<h1>', '</h1>');
                        else if (val === 'h2') insertTag('<h2>', '</h2>');
                        else if (val === 'h3') insertTag('<h3>', '</h3>');
                        else if (val === 'p') insertTag('<p>', '</p>');
                        else if (val === 'pre') insertTag('<pre>', '</pre>');
                        e.target.value = '';
                      }}
                      className="px-2 py-1 bg-white border border-[#ccd0d4] rounded text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="">Paragraph / Headings</option>
                      <option value="p">Paragraph</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="pre">Preformatted</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => insertTag('<u>', '</u>')}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<code>', '</code>')}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<p class="text-left">', '</p>')}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                      title="Align Left"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<p class="text-center">', '</p>')}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                      title="Align Center"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<p class="text-right">', '</p>')}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                      title="Align Right"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Editing Area */}
                {editorMode === 'text' ? (
                  <textarea
                    ref={textareaRef}
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 font-mono text-xs text-slate-900 bg-white focus:outline-none resize-y leading-relaxed"
                    placeholder="Write raw HTML or article text..."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    <textarea
                      ref={textareaRef}
                      rows={16}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-4 text-xs font-mono text-slate-800 bg-white focus:outline-none resize-none leading-relaxed"
                      placeholder="Type content or formatting tags..."
                    />
                    <div
                      className="p-4 overflow-y-auto max-h-[380px] bg-white prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                )}

                {/* Editor Bottom Status Bar */}
                <div className="bg-[#f0f0f1] px-3 py-1.5 border-t border-[#ccd0d4] text-[11px] text-slate-600 flex items-center justify-between">
                  <div>
                    Word count: <strong>{wordCount}</strong> · Est. Read time: <strong>{readingTimeMin} min</strong>
                  </div>
                  <div>Classic HTML Visualizer</div>
                </div>

              </div>

              {/* Excerpt Box */}
              <div className="bg-white border border-[#ccd0d4] rounded shadow-xs p-4 space-y-2">
                <div className="font-bold text-xs text-[#23282d]">Excerpt (SEO Meta Description)</div>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short excerpt for Google search results and post summaries..."
                  className="w-full px-3 py-2 border border-[#ccd0d4] rounded text-xs text-slate-900 focus:outline-none focus:border-[#007cba]"
                />
                <p className="text-[10px] text-slate-500">
                  Excerpts are optional hand-crafted summaries that appear in social sharing and search engines.
                </p>
              </div>

            </div>

            {/* Right 4 Cols: Classic WordPress Sidebar Boxes */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Publish Box */}
              <div className="bg-white border border-[#ccd0d4] rounded shadow-xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-[#f6f7f7] border-b border-[#ccd0d4] font-bold text-xs text-[#23282d] flex items-center justify-between">
                  <span>Publish</span>
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div className="p-3.5 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <strong className="text-slate-900">
                      {isPublished ? 'Published' : 'Draft'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Visibility:</span>
                    <strong className="text-slate-900">Public</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Publish:</span>
                    <strong className="text-slate-900">Immediately</strong>
                  </div>

                  <div className="pt-2 border-t border-[#ccd0d4] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsPublished(!isPublished)}
                      className="text-[#0073aa] hover:underline cursor-pointer text-xs"
                    >
                      {isPublished ? 'Switch to Draft' : 'Switch to Published'}
                    </button>

                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#007cba] hover:bg-[#006ba1] text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSaving ? (
                        <span>Publishing...</span>
                      ) : saveSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <span>{isPublished ? 'Publish' : 'Save Draft'}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories Box */}
              <div className="bg-white border border-[#ccd0d4] rounded shadow-xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-[#f6f7f7] border-b border-[#ccd0d4] font-bold text-xs text-[#23282d] flex items-center justify-between">
                  <span>Categories</span>
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div className="p-3.5 space-y-2 text-xs">
                  {[
                    'Short Stay & Real Estate',
                    'Lagos Shortlet Guide',
                    'Abuja Diplomatic Stays',
                    'Title Verification & C of O',
                    'Diaspora Investment',
                    'Market Insights'
                  ].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                      <input
                        type="radio"
                        name="post_category"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="text-[#007cba] focus:ring-0"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Image Box */}
              <div className="bg-white border border-[#ccd0d4] rounded shadow-xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-[#f6f7f7] border-b border-[#ccd0d4] font-bold text-xs text-[#23282d]">
                  Featured Image
                </div>

                <div className="p-3.5 space-y-2.5">
                  {coverImage ? (
                    <div className="relative rounded overflow-hidden border border-[#ccd0d4] aspect-[16/9] bg-slate-100">
                      <img src={coverImage} alt="Featured" className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  <label className="text-[11px] font-semibold text-slate-600 block">Featured Image URL</label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2.5 py-1.5 border border-[#ccd0d4] rounded text-xs text-slate-900 focus:outline-none focus:border-[#007cba]"
                  />
                  <p className="text-[10px] text-slate-500">
                    Click and paste any high-resolution image URL to use as the blog hero.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
