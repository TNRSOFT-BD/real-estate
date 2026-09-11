<?php

declare(strict_types=1);

namespace App\Enums;

enum ContactPermission: string
{
    case View = 'contact.view';
    case Create = 'contact.create';
    case Update = 'contact.update';
    case Delete = 'contact.delete';

    case SettingsView = 'contact.settings.view';
    case SettingsUpdate = 'contact.settings.update';

    case SubmissionView = 'contact.submissions.view';
    case SubmissionUpdate = 'contact.submissions.update';
    case SubmissionDelete = 'contact.submissions.delete';
    case SubmissionAssign = 'contact.submissions.assign';
    case SubmissionBulk = 'contact.submissions.bulk';

    case FaqView = 'contact.faq.view';
    case FaqCreate = 'contact.faq.create';
    case FaqUpdate = 'contact.faq.update';
    case FaqDelete = 'contact.faq.delete';

    case TeamView = 'contact.team.view';
    case TeamCreate = 'contact.team.create';
    case TeamUpdate = 'contact.team.update';
    case TeamDelete = 'contact.team.delete';

    case LocationView = 'contact.location.view';
    case LocationCreate = 'contact.location.create';
    case LocationUpdate = 'contact.location.update';
    case LocationDelete = 'contact.location.delete';

    case SocialView = 'contact.social.view';
    case SocialCreate = 'contact.social.create';
    case SocialUpdate = 'contact.social.update';
    case SocialDelete = 'contact.social.delete';

    case LiveChatView = 'contact.livechat.view';
    case LiveChatUpdate = 'contact.livechat.update';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
