<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\LegalPageStatus;
use App\Enums\LegalPageType;
use App\Models\Legal\LegalPage;
use Illuminate\Database\Seeder;

class LegalPageSeeder extends Seeder
{
    public function run(): void
    {
        LegalPage::updateOrCreate(['slug' => 'privacy-policy'], [
            'type' => LegalPageType::PrivacyPolicy->value,
            'title' => 'Privacy Policy',
            'status' => LegalPageStatus::Published->value,
            'published_at' => now(),
            'content' => <<<'HTML'
                <h2>1. Introduction</h2>
                <p>We are committed to protecting your privacy. This policy explains how we collect, use and safeguard the personal information you provide when you use our website or contact our team.</p>
                <h2>2. Information We Collect</h2>
                <p>We only collect the information we need to respond to your enquiry and improve our services, including:</p>
                <ul>
                    <li>Your name and contact details.</li>
                    <li>The details of your enquiry or property interest.</li>
                    <li>Basic technical information such as your browser and device type.</li>
                </ul>
                <h2>3. How We Use Information</h2>
                <p>Your information is used to respond to enquiries, arrange viewings, provide the services you request and keep you informed about relevant updates.</p>
                <h2>4. Sharing</h2>
                <p>We do not sell your personal information. We only share it with trusted partners where it is necessary to deliver a service you have asked for, or where we are required to by law.</p>
                <h2>5. Your Rights</h2>
                <p>You have the right to access, correct or request deletion of the personal information we hold about you. To make a request, please contact our team.</p>
                <h2>6. Contact</h2>
                <p>If you have any questions about this policy, please <a href="/contact">contact us</a>.</p>
                HTML,
        ]);

        LegalPage::updateOrCreate(['slug' => 'terms-and-conditions'], [
            'type' => LegalPageType::TermsConditions->value,
            'title' => 'Terms & Conditions',
            'status' => LegalPageStatus::Published->value,
            'published_at' => now(),
            'content' => <<<'HTML'
                <h2>1. Introduction</h2>
                <p>These terms and conditions govern your use of our website and services. By using the site, you agree to these terms.</p>
                <h2>2. Use of the Website</h2>
                <p>You agree to use the website lawfully and not to misuse it. All content is provided for general information and may change without notice.</p>
                <h2>3. Property Information</h2>
                <p>Property details, images and pricing are provided in good faith but are not a binding offer. Please confirm all material details with our team before making a decision.</p>
                <h2>4. Intellectual Property</h2>
                <p>All content on this website, including text, images and branding, is owned by us or our licensors and may not be reproduced without permission.</p>
                <h2>5. Liability</h2>
                <p>We take care to keep information accurate, but we are not liable for any loss arising from reliance on the content of this website.</p>
                <h2>6. Contact</h2>
                <p>For any questions about these terms, please <a href="/contact">contact us</a>.</p>
                HTML,
        ]);
    }
}
