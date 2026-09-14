<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectPermission: string
{
    case View = 'projects.view';
    case Create = 'projects.create';
    case Update = 'projects.update';
    case Delete = 'projects.delete';
    case Publish = 'projects.publish';
    case ManageMedia = 'projects.manage_media';
    case ManageGallery = 'projects.manage_gallery';
    case ManagePricing = 'projects.manage_pricing';
    case ManageFloorPlans = 'projects.manage_floor_plans';

    case TypesView = 'project_types.view';
    case TypesCreate = 'project_types.create';
    case TypesUpdate = 'project_types.update';
    case TypesDelete = 'project_types.delete';

    case StatusesView = 'project_statuses.view';
    case StatusesCreate = 'project_statuses.create';
    case StatusesUpdate = 'project_statuses.update';
    case StatusesDelete = 'project_statuses.delete';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
