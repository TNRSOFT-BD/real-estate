<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\About\AboutItem;
use App\Models\About\AboutPageSetting;
use Illuminate\Database\Seeder;

class AboutSeeder extends Seeder
{
    public function run(): void
    {
        AboutPageSetting::updateOrCreate(['id' => 1], [
            'hero_badge' => 'About us',
            'hero_title' => 'Building places,',
            'hero_highlight' => 'shaping better futures.',
            'hero_description' => 'For over fifteen years we have designed, developed and delivered residential and commercial spaces that stand the test of time.',
            'hero_cta_text' => 'Discover our story',
            'hero_cta_link' => '#story',
            'hero_image' => null,

            'intro_badge' => 'Who we are',
            'intro_title' => 'A company built around vision, quality and place.',
            'intro_description' => 'We are an architecture and development practice that believes great spaces change how people live and work. From the first sketch to the final handover, every project is shaped by the same principles: honesty of materials, clarity of design and a deep respect for the context it sits in. Our team brings together architects, engineers and developers who share one obsession — doing things properly.',
            'intro_image' => null,

            'direction_badge' => 'Our direction',

            'values_badge' => 'Our values',
            'values_title' => 'The principles that guide every project.',

            'journey_badge' => 'Our journey',
            'journey_title' => 'From first site to future skyline.',

            'why_badge' => 'Why choose us',
            'why_title' => 'A partner you can build on.',

            'team_badge' => 'Our people',
            'team_title' => 'The people behind our projects.',
            'team_description' => 'A multidisciplinary team of architects, engineers and developers dedicated to doing the work properly.',

            'partners_title' => 'Trusted by',

            'closing_badge' => "Let's build the future",
            'closing_title' => 'Have a project in mind?',
            'closing_description' => 'Whether you are buying, selling or dreaming up something new, tell us what you have in mind and let us start a conversation.',
            'closing_button_text' => 'Contact our team',
            'closing_button_link' => '/contact',

            'seo_title' => 'About Us — Real Estate',
            'seo_description' => 'Learn about our company, mission, values, journey and the people behind our projects.',
            'seo_keywords' => 'about us, real estate developer, architecture, property development, our story',
            'canonical_url' => null,
            'og_title' => 'About Us — Real Estate',
            'og_description' => 'A premium architecture and development firm built around vision, quality and place.',
            'og_image' => null,
            'twitter_card' => 'summary',

            'is_active' => true,
        ]);

        AboutItem::withTrashed()->forceDelete();

        $items = [
            ['type' => AboutItem::TYPE_MISSION, 'title' => 'To design and build places that improve the people who use them.', 'description' => 'Every decision — structural, material, spatial — is made with the end user in mind. We measure success in the everyday quality of life our buildings enable.', 'sort_order' => 1],
            ['type' => AboutItem::TYPE_VISION, 'title' => 'A future where development is responsible, lasting and beautiful.', 'description' => 'We want to be the developer communities trust with their skyline. Sustainable construction, fair partnerships and timeless architecture are not goals; they are the baseline.', 'sort_order' => 1],

            ['type' => AboutItem::TYPE_STATISTIC, 'value' => '15+', 'label' => 'Years of experience', 'sort_order' => 1],
            ['type' => AboutItem::TYPE_STATISTIC, 'value' => '120+', 'label' => 'Projects delivered', 'sort_order' => 2],
            ['type' => AboutItem::TYPE_STATISTIC, 'value' => '25', 'label' => 'Active developments', 'sort_order' => 3],
            ['type' => AboutItem::TYPE_STATISTIC, 'value' => '10k+', 'label' => 'Happy clients', 'sort_order' => 4],

            ['type' => AboutItem::TYPE_VALUE, 'title' => 'Integrity', 'description' => 'We are transparent in pricing, process and promise. What we say is what we deliver.', 'sort_order' => 1],
            ['type' => AboutItem::TYPE_VALUE, 'title' => 'Quality', 'description' => 'Materials, craftsmanship and detail are never compromised. Good enough is not enough.', 'sort_order' => 2],
            ['type' => AboutItem::TYPE_VALUE, 'title' => 'Innovation', 'description' => 'We question convention and adopt smarter ways to build, from engineering to energy.', 'sort_order' => 3],
            ['type' => AboutItem::TYPE_VALUE, 'title' => 'Responsibility', 'description' => 'We build for the community and the environment, not just the sale. Long-term value comes first.', 'sort_order' => 4],

            ['type' => AboutItem::TYPE_MILESTONE, 'year' => '2008', 'title' => 'Company founded', 'description' => 'Started as a small architecture studio with a single drafting table.', 'sort_order' => 1],
            ['type' => AboutItem::TYPE_MILESTONE, 'year' => '2012', 'title' => 'First major development', 'description' => 'Delivered our landmark residential tower, setting the standard for what followed.', 'sort_order' => 2],
            ['type' => AboutItem::TYPE_MILESTONE, 'year' => '2017', 'title' => 'National expansion', 'description' => 'Opened regional offices and moved into commercial and mixed-use projects.', 'sort_order' => 3],
            ['type' => AboutItem::TYPE_MILESTONE, 'year' => '2022', 'title' => 'New markets', 'description' => 'Launched internationally and adopted a sustainability-led construction programme.', 'sort_order' => 4],
            ['type' => AboutItem::TYPE_MILESTONE, 'year' => '2026', 'title' => 'Building the future', 'description' => 'A pipeline of ambitious projects that put people and planet at the centre.', 'sort_order' => 5],

            ['type' => AboutItem::TYPE_FEATURE, 'title' => 'Track record', 'description' => 'Over 120 completed projects delivered on time and on budget.', 'sort_order' => 1],
            ['type' => AboutItem::TYPE_FEATURE, 'title' => 'One team, end to end', 'description' => 'Architecture, engineering and development under one roof for total accountability.', 'sort_order' => 2],
            ['type' => AboutItem::TYPE_FEATURE, 'title' => 'Transparent partnerships', 'description' => 'Clear contracts, honest pricing and open communication at every milestone.', 'sort_order' => 3],
            ['type' => AboutItem::TYPE_FEATURE, 'title' => 'Long-term thinking', 'description' => 'We build places designed to serve communities for generations.', 'sort_order' => 4],

            ['type' => AboutItem::TYPE_PARTNER, 'title' => 'Meridian Capital', 'url' => null, 'sort_order' => 1],
            ['type' => AboutItem::TYPE_PARTNER, 'title' => 'Atlas Bank', 'url' => null, 'sort_order' => 2],
            ['type' => AboutItem::TYPE_PARTNER, 'title' => 'City Development Group', 'url' => null, 'sort_order' => 3],
            ['type' => AboutItem::TYPE_PARTNER, 'title' => 'Northwind Properties', 'url' => null, 'sort_order' => 4],
            ['type' => AboutItem::TYPE_PARTNER, 'title' => 'Stonebridge Partners', 'url' => null, 'sort_order' => 5],
        ];

        foreach ($items as $item) {
            AboutItem::create($item + ['is_active' => true, 'is_featured' => false]);
        }
    }
}
