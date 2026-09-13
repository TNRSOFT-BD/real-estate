<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Company;

use App\Models\Company\CompanyProfile;

interface CompanyProfileRepositoryInterface
{
    public function getSingleton(): CompanyProfile;

    public function updateSettings(array $data): CompanyProfile;
}
