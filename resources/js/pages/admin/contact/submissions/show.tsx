import AdminPageHeader from '@/components/admin/contact/admin-page-header';
import { PriorityBadge, StatusBadge } from '@/components/admin/contact/status-badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Assignee, type ContactSubmissionItem, type ContactSubmissionNoteItem } from '@/types/contact-admin';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Pencil, Save, Send, ShieldAlert, Trash, Undo2, User } from 'lucide-react';
import { useState } from 'react';

interface SubmissionShowProps {
    submission: ContactSubmissionItem;
    assignees?: Assignee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/admin/contact/settings' },
    { title: 'Submissions', href: '/admin/contact/submissions' },
];

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'read', label: 'Read' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'spam', label: 'Spam' },
];

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

function NoteItem({ note, onEdit, onDelete }: { note: ContactSubmissionNoteItem; onEdit: (note: ContactSubmissionNoteItem) => void; onDelete: (id: number) => void }) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
            <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="size-3" />
                    {note.user?.name ?? 'System'} · {new Date(note.created_at).toLocaleString()}
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">{note.note}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
                <Button size="icon" variant="ghost" title="Edit note" onClick={() => onEdit(note)}>
                    <Pencil />
                </Button>
                <Button size="icon" variant="ghost" title="Delete note" onClick={() => { if (window.confirm('Delete this note?')) onDelete(note.id); }}>
                    <Trash />
                </Button>
            </div>
        </div>
    );
}

export default function SubmissionShow({ submission, assignees = [] }: SubmissionShowProps) {
    const [editingNote, setEditingNote] = useState<ContactSubmissionNoteItem | null>(null);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    const { data, setData, put, transform, processing, errors } = useForm({
        status: submission.status,
        priority: submission.priority,
        assigned_to: submission.assigned_to != null ? String(submission.assigned_to) : '',
    });

    const submitUpdate = (event: React.FormEvent) => {
        event.preventDefault();
        transform((formData) => ({
            ...formData,
            assigned_to: formData.assigned_to === '' ? null : Number(formData.assigned_to),
        }));
        put(route('admin.contact.submissions.update', { submission: submission.id }));
    };

    const saveNote = (event: React.FormEvent) => {
        event.preventDefault();
        const text = editingNote ? editingNote.note : noteText;
        if (!text.trim()) return;
        setSavingNote(true);
        const payload = { note: text };
        if (editingNote) {
            const id = editingNote.id;
            router.put(route('admin.contact.submissions.notes.update', { note: id }), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingNote(null);
                    setSavingNote(false);
                },
                onError: () => setSavingNote(false),
            });
        } else {
            router.post(route('admin.contact.submissions.notes.store', { submission: submission.id }), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setNoteText('');
                    setSavingNote(false);
                },
                onError: () => setSavingNote(false),
            });
        }
    };

    const deleteNote = (id: number) => {
        router.delete(route('admin.contact.submissions.notes.destroy', { note: id }), { preserveScroll: true });
    };

    const renderedData = Object.entries(submission.data ?? {});

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: `#${submission.id}`, href: '#' }]}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <AdminPageHeader
                    title={`Submission #${submission.id}`}
                    description={submission.subject || submission.name || 'Contact message'}
                    actions={
                        <div className="flex items-center gap-2">
                            {submission.is_spam ? (
                                <Button variant="secondary" onClick={() => router.patch(route('admin.contact.submissions.restore', { submission: submission.id }), {}, { preserveScroll: true })}>
                                    <Undo2 />
                                    Restore
                                </Button>
                            ) : (
                                <Button variant="secondary" onClick={() => router.patch(route('admin.contact.submissions.mark-spam', { submission: submission.id }), {}, { preserveScroll: true })}>
                                    <ShieldAlert />
                                    Mark as spam
                                </Button>
                            )}
                            <Button variant="destructive" onClick={() => { if (window.confirm('Delete this submission?')) router.delete(route('admin.contact.submissions.destroy', { submission: submission.id })); }}>
                                <Trash />
                                Delete
                            </Button>
                            <Button variant="outline" onClick={() => router.visit(route('admin.contact.submissions.index'))}>
                                <ArrowLeft />
                                Back
                            </Button>
                        </div>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="grid gap-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Message</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {submission.name && (
                                        <div>
                                            <div className="text-xs text-muted-foreground">Name</div>
                                            <div className="font-medium">{submission.name}</div>
                                        </div>
                                    )}
                                    {submission.email && (
                                        <div>
                                            <div className="text-xs text-muted-foreground">Email</div>
                                            <div className="font-medium">{submission.email}</div>
                                        </div>
                                    )}
                                    {submission.phone && (
                                        <div>
                                            <div className="text-xs text-muted-foreground">Phone</div>
                                            <div className="font-medium">{submission.phone}</div>
                                        </div>
                                    )}
                                </div>
                                {submission.message && (
                                    <div>
                                        <div className="text-xs text-muted-foreground">Message</div>
                                        <p className="mt-1 text-sm whitespace-pre-wrap">{submission.message}</p>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    <StatusBadge value={submission.status} />
                                    <PriorityBadge value={submission.priority} />
                                    {submission.is_spam && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">Spam</span>}
                                </div>
                            </CardContent>
                        </Card>

                        {renderedData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Form data</CardTitle>
                                    <CardDescription>All fields submitted through the form.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-3 sm:grid-cols-2">
                                    {renderedData.map(([key, value]) => (
                                        <div key={key} className="break-all rounded-lg border p-3">
                                            <div className="text-xs text-muted-foreground">{key}</div>
                                            <div className="text-sm">{Array.isArray(value) ? value.join(', ') : String(value ?? '')}</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata</CardTitle>
                                <CardDescription>Technical information about the submission.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                                {submission.source && (
                                    <>
                                        <div className="text-muted-foreground">Source</div>
                                        <div className="break-all">{submission.source}</div>
                                    </>
                                )}
                                {submission.user_agent && (
                                    <>
                                        <div className="text-muted-foreground">User agent</div>
                                        <div className="break-all">{submission.user_agent}</div>
                                    </>
                                )}
                                {submission.ip_hash && (
                                    <>
                                        <div className="text-muted-foreground">IP (hashed)</div>
                                        <div className="break-all font-mono text-xs">{submission.ip_hash}</div>
                                    </>
                                )}
                                <>
                                    <div className="text-muted-foreground">Received</div>
                                    <div>{new Date(submission.created_at).toLocaleString()}</div>
                                </>
                                <>
                                    <div className="text-muted-foreground">Last updated</div>
                                    <div>{new Date(submission.updated_at).toLocaleString()}</div>
                                </>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                                <CardDescription>Internal notes visible only to staff.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <form onSubmit={saveNote} className="grid gap-2">
                                    <textarea
                                        value={editingNote ? editingNote.note : noteText}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (editingNote) setEditingNote({ ...editingNote, note: value });
                                            else setNoteText(value);
                                        }}
                                        rows={3}
                                        placeholder="Add a note about this submission…"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                        aria-label="Note text"
                                    />
                                    <div className="flex items-center justify-between gap-2">
                                        {editingNote && (
                                            <Button type="button" size="sm" variant="ghost" onClick={() => setEditingNote(null)}>
                                                Cancel edit
                                            </Button>
                                        )}
                                        <Button type="submit" size="sm" disabled={savingNote || (!editingNote && !noteText.trim())}>
                                            {savingNote ? <Loader2 className="animate-spin" /> : <Send />}
                                            {editingNote ? 'Update note' : 'Add note'}
                                        </Button>
                                    </div>
                                </form>
                                {(submission.notes ?? []).length > 0 ? (
                                    <div className="grid gap-2">
                                        {(submission.notes ?? []).map((note) => (
                                            <NoteItem key={note.id} note={note} onEdit={setEditingNote} onDelete={deleteNote} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No notes yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage</CardTitle>
                                <CardDescription>Update status, priority and assignment.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitUpdate} className="grid gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            {statusOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                        </select>
                                        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Priority</label>
                                        <select
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            {priorityOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                        </select>
                                        {errors.priority && <p className="text-xs text-destructive">{errors.priority}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Assignee</label>
                                        <select
                                            value={data.assigned_to}
                                            onChange={(e) => setData('assigned_to', e.target.value)}
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <option value="">Unassigned</option>
                                            {assignees.map((assignee) => (<option key={assignee.id} value={assignee.id}>{assignee.name}</option>))}
                                        </select>
                                        {errors.assigned_to && <p className="text-xs text-destructive">{errors.assigned_to}</p>}
                                    </div>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? <Loader2 className="animate-spin" /> : <Save />}
                                        Save changes
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}