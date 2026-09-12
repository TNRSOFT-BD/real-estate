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
            'hero_secondary_button_link' => 'tel:+8466000000',
            'hero_background_image' => null,

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
            [ContactInformationType::Hotline, 'Hotline', '+84 66 000 000', '+84 900 000 000', 'tel:+8466000000', 'Reach us any time.'],
            [ContactInformationType::Email, 'Email us', 'hello@example.com', null, 'mailto:hello@example.com', 'For general questions.'],
            [ContactInformationType::Address, 'Head office', '123 Le Loi Street, District 1', 'Ho Chi Minh City, Vietnam', 'https://maps.google.com/?q=Le+Loi+Street+District+1', 'Visit us on weekdays.'],
            [ContactInformationType::BusinessHours, 'Business hours', 'Monday – Saturday: 8:00 – 18:00', null, null, 'Sunday closed.'],
            [ContactInformationType::WhatsApp, 'WhatsApp', '+84 900 000 000', null, 'tel:+84900000000', 'Fastest response time.'],
            [ContactInformationType::Support, 'Support', 'support@example.com', null, 'mailto:support@example.com', 'For help after purchase.'],
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
            ['Which areas do you cover?', 'We specialise in Ho Chi Minh City, Hanoi and Da Nang, but we can help with projects nationwide.', 'General', FaqDisplayLocation::Contact],
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
            ['Minh Tran', 'Senior Advisor', TeamMemberDepartment::Sales, 'minh@example.com', 'Mon – Sat 9:00 – 18:00'],
            ['Linh Nguyen', 'Client Care', TeamMemberDepartment::Support, 'linh@example.com', 'Mon – Fri 8:30 – 17:30'],
            ['Anh Pham', 'Listing Coordinator', TeamMemberDepartment::Technical, 'anh@example.com', 'Mon – Fri 9:00 – 17:00'],
        ];

        foreach ($members as $index => [$name, $role, $department, $email, $availability]) {
            ContactTeamMember::updateOrCreate(['name' => $name], [
                'role' => $role,
                'department' => $department,
                'email' => $email,
                'availability' => $availability,
                'bio' => null,
                'sort_order' => $index,
                'is_active' => true,
            ]);
        }
    }

    private function addLocations(): void
    {
        ContactLocation::updateOrCreate(['name' => 'Head Office'], [
            'address' => '123 Le Loi Street, Ben Nghe Ward, District 1',
            'description' => 'Our main showroom and sales office. Free parking available in the building basement.',
            'city' => 'Ho Chi Minh City',
            'state' => null,
            'country' => 'Vietnam',
            'postal_code' => '700000',
            'latitude' => 10.7756,
            'longitude' => 106.7019,
            'google_maps_url' => 'https://maps.google.com/?q=Le+Loi+Street+District+1+Ho+Chi+Minh',
            'place_id' => 'ChIJv4q8K9yxQzERFcKq3s4F2b4',
            'phone' => '+84 66 000 000',
            'email' => 'hello@example.com',
            'business_hours' => "Monday – Friday: 8:00 – 18:00\nSaturday: 9:00 – 12:00\nSunday: Closed",
            'is_primary' => true,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        ContactLocation::updateOrCreate(['name' => 'Hanoi Branch'], [
            'address' => '45 Hang Bai Street, Hoan Kiem District',
            'description' => 'Branch office for northern clients. 5 minutes from the Old Quarter.',
            'city' => 'Hanoi',
            'state' => null,
            'country' => 'Vietnam',
            'postal_code' => '100000',
            'latitude' => 21.0278,
            'longitude' => 105.8342,
            'google_maps_url' => 'https://maps.google.com/?q=Hang+Bai+Hanoi',
            'place_id' => null,
            'phone' => '+84 24 000 000',
            'email' => 'hanoi@example.com',
            'business_hours' => "Monday – Friday: 8:30 – 17:30\nSaturday: 9:00 – 12:00\nSunday: Closed",
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
