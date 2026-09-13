<?php

namespace Tests\Feature\Legal;

use App\Enums\LegalPageStatus;
use App\Models\Legal\LegalPage;
use App\Models\User;
use App\Services\Legal\LegalContentSanitizer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LegalPageTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    private function makePage(array $overrides = []): LegalPage
    {
        return LegalPage::create(array_merge([
            'title' => 'Privacy Policy',
            'slug' => 'privacy-policy',
            'content' => '<p>Hello</p>',
            'status' => LegalPageStatus::Published->value,
            'published_at' => now(),
        ], $overrides));
    }

    public function test_guests_are_redirected_from_admin_legal(): void
    {
        $this->get(route('admin.legal.index'))->assertRedirect('/login');
    }

    public function test_admin_can_create_a_page_with_an_auto_generated_slug(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.legal.store'), [
                'title' => 'Privacy Policy',
                'content' => '<p>Content</p>',
                'status' => 'published',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('legal_pages', ['slug' => 'privacy-policy', 'status' => 'published']);
    }

    public function test_slug_is_generated_from_the_title(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.legal.store'), [
                'title' => 'Terms & Conditions',
                'content' => '<p>Terms</p>',
                'status' => 'draft',
            ]);

        $this->assertDatabaseHas('legal_pages', ['slug' => 'terms-conditions']);
    }

    public function test_duplicate_titles_get_a_unique_slug(): void
    {
        $this->makePage(['slug' => 'privacy-policy']);

        $this->actingAs($this->admin())
            ->post(route('admin.legal.store'), [
                'title' => 'Privacy Policy',
                'content' => '<p>x</p>',
                'status' => 'draft',
            ]);

        $this->assertDatabaseHas('legal_pages', ['slug' => 'privacy-policy-2']);
    }

    public function test_reserved_slugs_are_skipped(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.legal.store'), [
                'title' => 'Login',
                'content' => '<p>x</p>',
                'status' => 'draft',
            ]);

        $this->assertDatabaseHas('legal_pages', ['slug' => 'login-2']);
    }

    public function test_content_is_required_when_publishing(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.legal.store'), [
                'title' => 'Privacy',
                'content' => '',
                'status' => 'published',
            ])
            ->assertSessionHasErrors('content');
    }

    public function test_admin_can_update_and_delete(): void
    {
        $admin = $this->admin();
        $page = $this->makePage();

        $this->actingAs($admin)
            ->put(route('admin.legal.update', $page), [
                'title' => 'Privacy Policy (updated)',
                'content' => '<p>Updated</p>',
                'status' => 'published',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('legal_pages', [
            'id' => $page->id,
            'title' => 'Privacy Policy (updated)',
            'slug' => 'privacy-policy-updated',
        ]);

        $this->actingAs($admin)->delete(route('admin.legal.destroy', $page))->assertRedirect(route('admin.legal.index'));
        $this->assertSoftDeleted('legal_pages', ['id' => $page->id]);
    }

    public function test_the_public_url_follows_the_slug(): void
    {
        $this->makePage(['title' => 'Privacy', 'slug' => 'privacy']);

        $this->get('/privacy')->assertOk()->assertSee('Privacy', false);
        $this->get('/privacy-policy')->assertNotFound();
    }

    public function test_draft_is_not_public(): void
    {
        $this->makePage(['status' => 'draft', 'published_at' => null]);

        $this->get('/privacy-policy')->assertNotFound();
    }

    public function test_published_page_is_public(): void
    {
        $this->makePage(['content' => '<p>Unique body content</p>']);

        $this->get('/privacy-policy')->assertOk()->assertSee('Unique body content', false);
    }

    public function test_unpublishing_hides_the_page(): void
    {
        $admin = $this->admin();
        $page = $this->makePage();

        $this->actingAs($admin)->patch(route('admin.legal.unpublish', $page))->assertRedirect();

        $this->get('/privacy-policy')->assertNotFound();
    }

    public function test_content_is_sanitized_on_save(): void
    {
        $this->actingAs($this->admin())->post(route('admin.legal.store'), [
            'title' => 'Privacy Sanitize',
            'status' => 'draft',
            'content' => '<p onclick="evil()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>',
        ]);

        $content = LegalPage::where('slug', 'privacy-sanitize')->firstOrFail()->content;

        $this->assertStringNotContainsString('<script', $content);
        $this->assertStringNotContainsString('onclick', $content);
        $this->assertStringNotContainsString('javascript:', $content);
        $this->assertStringContainsString('Hi', $content);
    }

    public function test_tiptap_formatting_is_preserved(): void
    {
        $content = '<h2>Head</h2><p style="text-align: center"><strong>B</strong><em>I</em><u>U</u><s>S</s></p>'
            .'<ul><li>One<ul><li>Nested</li></ul></li></ul><ol><li>First</li></ol>'
            .'<blockquote>Quote</blockquote><hr><p><a href="https://example.com">Read our Privacy Policy</a></p>';

        $this->actingAs($this->admin())
            ->post(route('admin.legal.store'), [
                'title' => 'Terms Formatting',
                'status' => 'draft',
                'content' => $content,
            ])
            ->assertRedirect();

        $saved = LegalPage::where('slug', 'terms-formatting')->firstOrFail()->content;

        foreach ([
            '<h2>', '<strong>', '<em>', '<u>', '<s>', '<ul>', '<ol>', '<li>', '<blockquote>', '<hr',
            'text-align: center', 'https://example.com', 'Read our Privacy Policy',
        ] as $fragment) {
            $this->assertStringContainsString($fragment, $saved, "Missing: {$fragment}");
        }
    }

    public function test_footer_links_follow_the_slug(): void
    {
        $this->makePage(['title' => 'Privacy', 'slug' => 'privacy']);
        $this->makePage(['title' => 'Terms', 'slug' => 'terms']);

        $this->get('/about')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('footer.legal', [
                ['title' => 'Privacy', 'slug' => 'privacy'],
                ['title' => 'Terms', 'slug' => 'terms'],
            ]));

        $this->get('/privacy')->assertOk()->assertSee('Privacy', false);
        $this->get('/terms')->assertOk()->assertSee('Terms', false);
    }

    public function test_sanitizer_blocks_dangerous_markup_and_styles(): void
    {
        $output = app(LegalContentSanitizer::class)->sanitize(
            '<p>ok</p><iframe src="x"></iframe><a href="vbscript:x">bad</a>'
            .'<a href="https://ok.com">good</a><p style="color:red;text-align:right">t</p>'
        );

        $this->assertStringNotContainsString('iframe', $output);
        $this->assertStringNotContainsString('vbscript', $output);
        $this->assertStringContainsString('https://ok.com', $output);
        $this->assertStringContainsString('text-align: right', $output);
        $this->assertStringNotContainsString('color:red', $output);
    }
}
