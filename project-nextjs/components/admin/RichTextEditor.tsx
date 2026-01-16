'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Image,
    Palette,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify
} from 'lucide-react';
import { EditorImageDialog } from './EditorImageDialog';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const RichTextEditor = ({ value, onChange, label = "কন্টেন্ট" }: RichTextEditorProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showImageDialog, setShowImageDialog] = useState(false);

    const insertText = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        const newText = value.substring(0, start) +
            prefix + selectedText + suffix +
            value.substring(end);

        onChange(newText);

        // Focus back to textarea
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + prefix.length,
                start + prefix.length + selectedText.length
            );
        }, 0);
    };

    const handleImageSelect = (url: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert HTML image tag instead of Markdown to ensure preview works with dangerouslySetInnerHTML
        const imageHtml = `<img src="${url}" alt="ছবি" class="w-full h-auto my-4 rounded-lg" />`;
        const newText = value.substring(0, start) + imageHtml + value.substring(end);

        onChange(newText);

        // Focus back to textarea
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + imageHtml.length, start + imageHtml.length);
        }, 0);
    };


    const toolbarButtons = [
        { icon: Bold, label: 'Bold', action: () => insertText('<strong>', '</strong>') },
        { icon: Italic, label: 'Italic', action: () => insertText('<em>', '</em>') },
        { icon: Underline, label: 'Underline', action: () => insertText('<u>', '</u>') },
        { icon: Heading1, label: 'Heading 1', action: () => insertText('<h1>', '</h1>') },
        { icon: Heading2, label: 'Heading 2', action: () => insertText('<h2>', '</h2>') },
        { icon: Heading3, label: 'Heading 3', action: () => insertText('<h3>', '</h3>') },
        { icon: List, label: 'Bullet List', action: () => insertText('<ul><li>', '</li></ul>') },
        { icon: ListOrdered, label: 'Numbered List', action: () => insertText('<ol><li>', '</li></ol>') },
        { icon: AlignLeft, label: 'Align Left', action: () => insertText('<div style="text-align: left">', '</div>') },
        { icon: AlignCenter, label: 'Align Center', action: () => insertText('<div style="text-align: center">', '</div>') },
        { icon: AlignRight, label: 'Align Right', action: () => insertText('<div style="text-align: right">', '</div>') },
        { icon: AlignJustify, label: 'Align Justify', action: () => insertText('<div style="text-align: justify">', '</div>') },
    ];

    const colorOptions = [
        { name: 'লাল', value: '#ef4444' },
        { name: 'নীল', value: '#3b82f6' },
        { name: 'সবুজ', value: '#10b981' },
        { name: 'হলুদ', value: '#f59e0b' },
        { name: 'বেগুনি', value: '#8b5cf6' },
        { name: 'কালো', value: '#000000' },
    ];

    return (
        <div className="space-y-4">
            <Label>{label} *</Label>

            {/* Toolbar */}
            <div className="border rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-1 sticky top-0 z-10">
                {toolbarButtons.map((button, index) => (
                    <Button
                        key={index}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={button.action}
                        title={button.label}
                    >
                        <button.icon className="w-4 h-4" />
                    </Button>
                ))}

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    title="ইমেজ যোগ করুন"
                    onClick={() => setShowImageDialog(true)}
                >
                    <Image className="w-4 h-4" />
                </Button>

                <div className="flex items-center space-x-1 ml-2 border-l pl-2">
                    <Palette className="w-4 h-4 text-gray-600" />
                    {colorOptions.map((color) => (
                        <button
                            key={color.value}
                            type="button"
                            className="w-5 h-5 rounded-full border hover:scale-110 transition-transform shadow-sm"
                            style={{ backgroundColor: color.value }}
                            onClick={() => insertText(`<span style="color: ${color.value}">`, '</span>')}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* Image Dialog */}
            <EditorImageDialog
                open={showImageDialog}
                onOpenChange={setShowImageDialog}
                onImageSelect={handleImageSelect}
            />

            {/* Text Area */}
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="আপনার কন্টেন্ট লিখুন..."
                className="min-h-[400px] rounded-t-none border-t-0 font-sans text-lg leading-relaxed p-4"
                required
            />

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                <Label className="text-sm font-medium mb-2 block uppercase tracking-wider text-gray-500">প্রিভিউ</Label>
                <div
                    className="prose max-w-none bg-white p-6 rounded border shadow-sm"
                    dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400 italic text-center">এখানে প্রিভিউ দেখাবে...</p>' }}
                />
            </div>
        </div>
    );
};
