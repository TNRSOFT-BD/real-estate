<?php

declare(strict_types=1);

namespace App\Models\Contact;

use App\Enums\LiveChatProvider;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactLiveChatSetting extends Model
{
    use HasFactory;

    protected $table = 'contact_live_chat_settings';

    protected $fillable = [
        'enabled',
        'provider',
        'script_url',
        'widget_id',
        'button_text',
        'position',
        'availability_text',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'provider' => LiveChatProvider::class,
    ];

    public static function singleton(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}
