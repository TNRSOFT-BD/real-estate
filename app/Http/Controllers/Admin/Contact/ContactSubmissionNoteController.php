<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Models\Contact\ContactSubmission;
use App\Models\Contact\ContactSubmissionNote;
use Illuminate\Http\Request;

class ContactSubmissionNoteController extends Controller
{
    public function store(Request $request, ContactSubmission $submission)
    {
        $this->authorize('update', $submission);

        $data = $request->validate([
            'note' => ['required', 'string', 'max:5000'],
        ]);

        ContactSubmissionNote::create([
            'submission_id' => $submission->id,
            'user_id' => $request->user()->id,
            'note' => $data['note'],
        ]);

        return back()->with('success', 'Note added.');
    }

    public function update(Request $request, ContactSubmissionNote $note)
    {
        $this->authorize('update', $note->submission);

        $data = $request->validate([
            'note' => ['required', 'string', 'max:5000'],
        ]);

        $note->update($data);

        return back()->with('success', 'Note updated.');
    }

    public function destroy(ContactSubmissionNote $note)
    {
        $this->authorize('update', $note->submission);

        $note->delete();

        return back()->with('success', 'Note deleted.');
    }
}
