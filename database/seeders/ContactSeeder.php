<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ContactFormFieldType;
use App\Enums\ContactInformationType;
use App\Enums\FaqDisplayLocation;
use App\Enums\LiveChatProvider;
use App\Enums\SubmissionPriority;
use App\Enums\SubmissionStatus;
use App\Enums\TeamMemberDepartment;
use App\Models\Contact\ContactFaq;
use App\Models\Contact\ContactFormField;
use App\Models\Contact\ContactInformation;
use App\Models\Contact\ContactLiveChatSetting;
use App\Models\Contact\ContactLocation;
use App\Models\Contact\ContactPageSetting;
use App\Models\Contact\ContactSocialLink;
use App\Models\Contact\ContactSubmission;
use App\Models\Contact\ContactSubmissionNote;
use App\Models\Contact\ContactTeamMember;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $this->addPageSettings();
        $this->addInformation();
        $this->addFormFields();
        $this->addFaqs();
        $this->addTeamMembers();
        $this->addLocations();
        $this->addSocialLinks();
        $this->addLiveChatSettings();
        $this->addDemoSubmissions();
    }

    private function addPageSettings(): void
    {
        ContactPageSetting::updateOrCreate(['id' => 1], [
            'hero_badge' => 'We are here for you',
            'hero_title' => 'Get in touch with our',
            'hero_highlight' => 'team',
            'hero_description' => 'Questions about a property, pricing or a viewing? Our team is ready to help you find the perfect home.',
            'hero_primary_button_text' => 'Send a message',
            'hero_primary_button_link' => '#contact-form',
            'hero_secondary_button_text' => 'Call us now',
            'hero_secondary_button_link' => 'tel:+8809610000000',
            'hero_background_image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop',

            'form_title' => 'Send us a message',
            'form_description' => 'Fill in the form and we will reply within one business day.',
            'form_success_message' => 'Thank you! Your message has been sent. We will get back to you soon.',

            'faq_badge' => 'FAQ',
            'faq_title' => 'Frequently asked questions',
            'faq_description' => 'Quick answers to the questions we hear most often. Do not see yours? Reach out and ask.',

            'team_badge' => 'Our team',
            'team_title' => 'Meet our specialists',
            'team_description' => 'Friendly property experts ready to guide you through every step.',

            'location_badge' => 'Locations',
            'location_title' => 'Visit us in person',
            'location_description' => 'Drop by our offices for a coffee and a chat about your next move.',

            'live_chat_title' => 'Live chat',
            'live_chat_description' => 'Chat with us directly for an instant answer.',

            'closing_badge' => 'Ready to start?',
            'closing_title' => 'Let us find your ideal place together',
            'closing_description' => 'Whether you are buying, selling or renting, our advisors are one message away.',

            'seo_title' => 'Contact Us — Real Estate',
            'seo_description' => 'Contact our real estate team for property inquiries, viewings and expert advice.',
            'seo_keywords' => 'contact us, real estate, property inquiries, viewings',
            'canonical_url' => null,
            'og_title' => 'Contact Us — Real Estate',
            'og_description' => 'Reach out to our team for property inquiries, viewings and advice.',
            'og_image' => null,
            'twitter_card' => 'summary',

            'is_active' => true,
        ]);
    }

    private function addInformation(): void
    {
        $items = [
            [ContactInformationType::Hotline, 'Hotline', '+880 9610 000 000', '+880 1710 000 000', 'tel:+8809610000000', 'Reach us any time.'],
            [ContactInformationType::Email, 'Email us', 'hello@srproperties.com', null, 'mailto:hello@srproperties.com', 'For general questions.'],
            [ContactInformationType::Address, 'Head office', 'Level 5, Concord Tower, Gulshan Avenue', 'Dhaka 1212, Bangladesh', 'https://maps.google.com/?q=Concord+Tower+Gulshan+Dhaka', 'Visit us on weekdays.'],
            [ContactInformationType::BusinessHours, 'Business hours', 'Saturday – Thursday: 9:00 – 18:00', null, null, 'Friday closed.'],
            [ContactInformationType::WhatsApp, 'WhatsApp', '+880 1710 000 000', null, 'https://wa.me/8801710000000', 'Fastest response time.'],
            [ContactInformationType::Support, 'Support', 'support@srproperties.com', null, 'mailto:support@srproperties.com', 'For help after purchase.'],
        ];

        foreach ($items as $index => [$type, $title, $value, $secondary, $link, $description]) {
            ContactInformation::updateOrCreate(['title' => $title], [
                'type' => $type,
                'value' => $value,
                'secondary_value' => $secondary,
                'link' => $link,
                'description' => $description,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    private function addFormFields(): void
    {
        $fields = [
            [ContactFormFieldType::Text, 'name', 'Your name', 'Jane Doe', [], ['required', 'max:255'], true],
            [ContactFormFieldType::Email, 'email', 'Email address', 'you@example.com', [], ['required', 'email', 'max:255'], true],
            [ContactFormFieldType::Tel, 'phone', 'Phone number', '+880 ...', [], ['nullable', 'max:50'], false],
            [ContactFormFieldType::Text, 'subject', 'Subject', 'Home viewing request', [], ['nullable', 'max:255'], false],
            [ContactFormFieldType::Textarea, 'message', 'Message', 'Tell us a little about what you need…', [], ['required', 'min:10', 'max:5000'], true],
            [ContactFormFieldType::Select, 'interest', 'I am interested in', 'Select an option…', [['label' => 'Apartment', 'value' => 'apartment'], ['label' => 'Buying', 'value' => 'buying'], ['label' => 'Selling', 'value' => 'selling'], ['label' => 'Renting', 'value' => 'renting']], ['required'], true],
        ];

        $sort = 0;
        foreach ($fields as [$type, $name, $label, $placeholder, $options, $rules, $required]) {
            ContactFormField::updateOrCreate(['name' => $name], [
                'label' => $label,
                'type' => $type,
                'placeholder' => $placeholder,
                'options' => $options === [] ? null : $options,
                'validation_rules' => $rules,
                'is_required' => $required,
                'is_active' => true,
                'sort_order' => $sort++,
            ]);
        }
    }

    private function addFaqs(): void
    {
        $faqs = [
            ['How soon do you reply to messages?', 'We normally reply within one business day. Messages sent on weekends are answered first thing Monday.', 'General', FaqDisplayLocation::Contact],
            ['Do you offer virtual viewings?', 'Yes. If you cannot visit in person, we can arrange a live video walkthrough of the property.', 'Viewings', FaqDisplayLocation::Contact],
            ['Is your consultation free?', 'Absolutely. Our first consultation is free and there is no obligation to use our services afterwards.', 'Pricing', FaqDisplayLocation::Contact],
            ['Which areas do you cover?', 'We specialise in Gulshan, Banani, Bashundhara, Uttara and Purbachal, but we can help with projects across Dhaka and beyond.', 'General', FaqDisplayLocation::Contact],
            ['Can I sell my property through you?', 'Yes, we handle listings, photos, valuation and advertising for sellers. Reach out for a free valuation.', 'Selling', FaqDisplayLocation::Contact],
        ];

        foreach ($faqs as $index => [$question, $answer, $category, $location]) {
            ContactFaq::updateOrCreate(['question' => $question], [
                'answer' => $answer,
                'category' => $category,
                'display_location' => $location,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    private function addTeamMembers(): void
    {
        $members = [
            [
                'name' => 'Rakib Hasan',
                'role' => 'Senior Sales Advisor',
                'department' => TeamMemberDepartment::Sales,
                'email' => 'rakib@srproperties.com',
                'phone' => '+880 1711 100 100',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
                'bio' => 'Rakib has helped more than 300 families find their home over a decade in Dhaka real estate.',
                'availability' => 'Sat – Thu 9:00 – 18:00',
            ],
            [
                'name' => 'Nusrat Jahan',
                'role' => 'Client Care Manager',
                'department' => TeamMemberDepartment::Support,
                'email' => 'nusrat@srproperties.com',
                'phone' => '+880 1711 200 200',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
                'bio' => 'Nusrat leads our after-sales care, making sure every handover runs smoothly.',
                'availability' => 'Sat – Thu 9:00 – 18:00',
            ],
            [
                'name' => 'Tanvir Ahmed',
                'role' => 'Listing Coordinator',
                'department' => TeamMemberDepartment::Technical,
                'email' => 'tanvir@srproperties.com',
                'phone' => '+880 1711 300 300',
                'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
                'bio' => 'Tanvir prepares floor plans, site documents and approvals for every development.',
                'availability' => 'Sun – Thu 9:00 – 17:00',
            ],
            [
                'name' => 'Farhana Islam',
                'role' => 'Property Consultant',
                'department' => TeamMemberDepartment::Sales,
                'email' => 'farhana@srproperties.com',
                'phone' => '+880 1711 400 400',
                'avatar' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop',
                'bio' => 'Farhana guides first-time buyers through financing, site visits and paperwork.',
                'availability' => 'Sat – Thu 10:00 – 18:00',
            ],
            [
                'name' => 'Imran Chowdhury',
                'role' => 'Head of Construction',
                'department' => TeamMemberDepartment::Management,
                'email' => 'imran@srproperties.com',
                'phone' => '+880 1711 500 500',
                'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
                'bio' => 'Imran oversees quality and timelines across all active construction sites.',
                'availability' => 'Sun – Thu 8:00 – 17:00',
            ],
            [
                'name' => 'Sadia Rahman',
                'role' => 'Marketing Lead',
                'department' => TeamMemberDepartment::Other,
                'email' => 'sadia@srproperties.com',
                'phone' => '+880 1711 600 600',
                'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
                'bio' => 'Sadia tells the story of each project and keeps buyers informed at every launch.',
                'availability' => 'Sat – Thu 9:00 – 18:00',
            ],
        ];

        foreach ($members as $index => $member) {
            ContactTeamMember::updateOrCreate(
                ['email' => $member['email']],
                [
                    'name' => $member['name'],
                    'role' => $member['role'],
                    'department' => $member['department'],
                    'phone' => $member['phone'],
                    'avatar' => $member['avatar'],
                    'bio' => $member['bio'],
                    'availability' => $member['availability'],
                    'sort_order' => $index,
                    'is_active' => true,
                ],
            );
        }

        // Keep the demo team authoritative so placeholder entries do not leak.
        ContactTeamMember::query()
            ->whereNotIn('email', array_column($members, 'email'))
            ->delete();
    }

    private function addLocations(): void
    {
        ContactLocation::updateOrCreate(['name' => 'Head Office'], [
            'address' => 'Level 5, Concord Tower, Gulshan Avenue, Gulshan 1',
            'description' => 'Our main showroom and sales office. Free parking available in the building basement.',
            'city' => 'Dhaka',
            'state' => null,
            'country' => 'Bangladesh',
            'postal_code' => '1212',
            'latitude' => 23.7806,
            'longitude' => 90.4153,
            'google_maps_url' => 'https://maps.google.com/?q=Concord+Tower+Gulshan+Dhaka',
            'place_id' => null,
            'phone' => '+880 9610 000 000',
            'email' => 'hello@srproperties.com',
            'business_hours' => "Saturday – Thursday: 9:00 – 18:00\nFriday: Closed",
            'is_primary' => true,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        ContactLocation::updateOrCreate(['name' => 'Banani Branch'], [
            'address' => 'House 45, Road 11, Kemal Ataturk Avenue, Banani',
            'description' => 'Sales lounge for northern Dhaka clients. Walk-ins welcome.',
            'city' => 'Dhaka',
            'state' => null,
            'country' => 'Bangladesh',
            'postal_code' => '1213',
            'latitude' => 23.7944,
            'longitude' => 90.4039,
            'google_maps_url' => 'https://maps.google.com/?q=Kemal+Ataturk+Avenue+Banani+Dhaka',
            'place_id' => null,
            'phone' => '+880 1710 000 000',
            'email' => 'banani@srproperties.com',
            'business_hours' => "Saturday – Thursday: 10:00 – 19:00\nFriday: Closed",
            'is_primary' => false,
            'sort_order' => 1,
            'is_active' => true,
        ]);
    }

    private function addSocialLinks(): void
    {
        $links = [
            ['Facebook', 'Facebook', 'https://facebook.com/example'],
            ['Instagram', 'Instagram', 'https://instagram.com/example'],
            ['LinkedIn', 'LinkedIn', 'https://linkedin.com/company/example'],
            ['YouTube', 'YouTube', 'https://youtube.com/@example'],
        ];

        foreach ($links as $index => [$platform, $label, $url]) {
            ContactSocialLink::updateOrCreate(['platform' => $platform], [
                'label' => $label,
                'url' => $url,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    private function addLiveChatSettings(): void
    {
        ContactLiveChatSetting::updateOrCreate(['id' => 1], [
            'enabled' => true,
            'provider' => LiveChatProvider::Custom,
            'script_url' => null,
            'widget_id' => null,
            'button_text' => 'Chat with us',
            'position' => 'bottom_right',
            'availability_text' => 'We usually reply within a few minutes.',
        ]);
    }

    private function addDemoSubmissions(): void
    {
        $users = User::query()->pluck('id')->all();
        $assigneeId = $users[0] ?? null;

        $submissions = [
            [
                'name' => 'Kate Johnson',
                'email' => 'kate@example.com',
                'phone' => '+1 202 555 0134',
                'subject' => 'Viewing request — Riverside Apartment',
                'message' => 'Hi, I would love to book a viewing of the 3-bedroom Riverside apartment next Saturday. Is the morning slot available?',
                'form_data' => ['interest' => 'renting'],
                'status' => SubmissionStatus::New,
                'priority' => SubmissionPriority::High,
                'assigned_to' => $assigneeId,
            ],
            [
                'name' => 'Tom Becker',
                'email' => 'tom@example.com',
                'phone' => '+61 4 0000 0000',
                'subject' => 'Selling a townhouse in District 2',
                'message' => 'I am considering selling my townhouse. Could you send me a brochure about your listing services and a rough valuation timeline?',
                'form_data' => ['interest' => 'selling'],
                'status' => SubmissionStatus::InProgress,
                'priority' => SubmissionPriority::Normal,
                'assigned_to' => null,
            ],
            [
                'name' => 'Demo Bot',
                'email' => 'bot@example.com',
                'phone' => null,
                'subject' => null,
                'message' => 'click here to win a free home http://spam.example',
                'form_data' => ['interest' => 'buying'],
                'status' => SubmissionStatus::Spam,
                'priority' => SubmissionPriority::Low,
                'assigned_to' => null,
            ],
        ];

        foreach ($submissions as $data) {
            $submission = ContactSubmission::firstOrCreate(
                ['email' => $data['email'], 'message' => $data['message']],
                array_merge($data, [
                    'ip_hash' => hash('sha256', '203.0.113.'.$data['email']),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'source' => 'contact page',
                    'submitted_at' => now()->subDays(random_int(1, 5)),
                ]),
            );

            if ($submission->notes()->count() === 0 && $assigneeId) {
                ContactSubmissionNote::create([
                    'submission_id' => $submission->id,
                    'user_id' => $assigneeId,
                    'note' => 'Initial contact received, waiting for customer reply.',
                ]);
            }
        }
    }
}
