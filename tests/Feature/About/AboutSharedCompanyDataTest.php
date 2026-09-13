<?php

namespace Tests\Feature\About;

use App\Models\Contact\ContactInformation;
use App\Models\Contact\ContactSocialLink;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AboutSharedCompanyDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_contact_information_is_shared_between_about_and_contact(): void
    {
        $this->seed();

        ContactInformation::create([
            'type' => 'email',
            'title' => 'General',
            'value' => 'shared-inbox@example.com',
            'sort_order' => 99,
            'is_active' => true,
        ]);

        $this->get('/about')->assertOk()->assertSee('shared-inbox@example.com', false);
        $this->get('/contact')->assertOk()->assertSee('shared-inbox@example.com', false);
    }

    public function test_social_links_are_shared_between_about_and_contact(): void
    {
        $this->seed();

        ContactSocialLink::create([
            'platform' => 'facebook',
            'label' => 'Facebook',
            'url' => 'https://facebook.com/shared-test',
            'sort_order' => 99,
            'is_active' => true,
        ]);

        $this->get('/about')->assertOk()->assertSee('facebook.com\\/shared-test', false);
        $this->get('/contact')->assertOk()->assertSee('facebook.com\\/shared-test', false);
    }
}
