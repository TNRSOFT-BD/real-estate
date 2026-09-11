<?php

declare(strict_types=1);

namespace App\Enums;

enum SubmissionStatus: string
{
    case New = 'new';
    case Read = 'read';
    case InProgress = 'in_progress';
    case Waiting = 'waiting';
    case Resolved = 'resolved';
    case Closed = 'closed';
    case Spam = 'spam';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Read => 'Read',
            self::InProgress => 'In Progress',
            self::Waiting => 'Waiting',
            self::Resolved => 'Resolved',
            self::Closed => 'Closed',
            self::Spam => 'Spam',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::New => 'blue',
            self::Read => 'gray',
            self::InProgress => 'yellow',
            self::Waiting => 'orange',
            self::Resolved => 'green',
            self::Closed => 'neutral',
            self::Spam => 'red',
        };
    }
}
