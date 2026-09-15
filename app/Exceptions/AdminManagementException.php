<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

class AdminManagementException extends RuntimeException
{
    public static function cannotDeleteSelf(): self
    {
        return new self('You cannot delete your own administrator account.');
    }

    public static function cannotDeleteLastAdmin(): self
    {
        return new self('You cannot delete the last administrator account. Create another administrator before deleting this account.');
    }
}
