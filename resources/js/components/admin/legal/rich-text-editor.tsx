import { cn } from '@/lib/utils';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Eraser,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Italic,
    Link as LinkIcon,
    Link2Off,
    List,
    ListOrdered,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    error?: boolean;
    placeholder?: string;
}

function ToolbarButton({
    onClick,
    active = false,
    disabled = false,
    label,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    label: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={cn(
                'text-ink-soft hover:bg-accent hover:text-accent-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-40',
                active && 'bg-accent text-accent-foreground',
            )}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <span aria-hidden className="bg-border mx-1 h-5 w-px shrink-0" />;
}

function Toolbar({ editor, onLink }: { editor: Editor; onLink: () => void }) {
    return (
        <div className="border-border flex flex-wrap items-center gap-0.5 border-b p-1.5">
            <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <Heading3 className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Heading 4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
                <Heading4 className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton label="Link" active={editor.isActive('link')} onClick={onLink}>
                <LinkIcon className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}>
                <Link2Off className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                <Quote className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                <AlignLeft className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                <AlignCenter className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                <AlignRight className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Justify" active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
                <AlignJustify className="size-4" />
            </ToolbarButton>

            <Divider />

            <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
                <Eraser className="size-4" />
            </ToolbarButton>
        </div>
    );
}

export default function RichTextEditor({ value, onChange, error, placeholder = 'Write your legal content here...' }: RichTextEditorProps) {
    const initialized = useRef(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [linkText, setLinkText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
                link: {
                    openOnClick: false,
                    autolink: true,
                    HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
                },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral text-ink-soft prose-headings:text-ink prose-headings:font-medium prose-p:text-ink-soft prose-li:text-ink-soft prose-a:text-ink prose-strong:text-ink prose-blockquote:text-ink-soft prose-blockquote:border-line prose-hr:border-line min-h-[24rem] max-w-none px-4 py-4 focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        if (!initialized.current) {
            initialized.current = true;

            return;
        }

        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
    }, [value, editor]);

    const openLink = () => {
        if (!editor) {
            return;
        }

        const { from, to } = editor.state.selection;
        const selected = editor.state.doc.textBetween(from, to, ' ');
        setLinkText(selected);
        setLinkUrl((editor.getAttributes('link').href as string) ?? '');
        setLinkOpen(true);
    };

    const applyLink = () => {
        if (!editor) {
            return;
        }

        const url = linkUrl.trim();

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setLinkOpen(false);

            return;
        }

        if (editor.state.selection.empty) {
            editor
                .chain()
                .focus()
                .insertContent({
                    type: 'text',
                    text: linkText.trim() || url,
                    marks: [{ type: 'link', attrs: { href: url } }],
                })
                .run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }

        setLinkOpen(false);
    };

    if (!editor) {
        return <div className="border-input min-h-[26rem] rounded-md border" />;
    }

    return (
        <div className={cn('border-input bg-background rounded-md border', error && 'border-destructive')}>
            <Toolbar editor={editor} onLink={openLink} />

            {linkOpen && (
                <div className="border-border bg-muted/40 flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-end">
                    <label className="grid gap-1 text-xs font-medium sm:flex-1">
                        Link text
                        <input
                            value={linkText}
                            onChange={(event) => setLinkText(event.target.value)}
                            placeholder="Read our Privacy Policy"
                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                        />
                    </label>
                    <label className="grid gap-1 text-xs font-medium sm:flex-1">
                        URL
                        <input
                            value={linkUrl}
                            onChange={(event) => setLinkUrl(event.target.value)}
                            placeholder="https://example.com"
                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                        />
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={applyLink}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 text-sm font-medium"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={() => setLinkOpen(false)}
                            className="border-input hover:bg-accent h-9 rounded-md border px-3 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="max-h-[34rem] overflow-y-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
