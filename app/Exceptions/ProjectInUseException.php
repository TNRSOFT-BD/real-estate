<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

class ProjectInUseException extends RuntimeException
{
    public static function forType(string $name, int $count): self
    {
        return new self("The project type \"{$name}\" is used by {$count} project(s). Reassign them before deleting it.");
    }

    public static function forStatus(string $name, int $count): self
    {
        return new self("The project status \"{$name}\" is used by {$count} project(s). Reassign them before deleting it.");
    }
}
