<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Company;

use App\Models\Company\CompanyProfile;
use App\Repositories\Contracts\Company\CompanyProfileRepositoryInterface;

class EloquentCompanyProfileRepository implements CompanyProfileRepositoryInterface
{
    public function getSingleton(): CompanyProfile
    {
        return CompanyProfile::singleton();
    }

    public function updateSettings(array $data): CompanyProfile
    {
        $profile = $this->getSingleton();
        $profile->update($data);

        return $profile;
    }
}
