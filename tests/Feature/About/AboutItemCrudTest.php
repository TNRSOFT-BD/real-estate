<?php

namespace Tests\Feature\About;

use App\Models\About\AboutItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AboutItemCrudTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_guests_cannot_manage_about_content(): void
    {
        $this->get(route('admin.about.items.index'))->assertRedirect('/login');
    }

    public function test_user_without_permission_is_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.about.items.index'))->assertForbidden();
    }

    public function test_admin_can_create_a_milestone(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.about.items.store'), [
                'type' => 'milestone',
                'year' => '2030',
                'title' => 'New era',
                'description' => 'Something big.',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.about.items.index'));

        $this->assertDatabaseHas('about_items', [
            'type' => 'milestone',
            'year' => '2030',
            'title' => 'New era',
        ]);
    }

    public function test_statistic_requires_value_and_label(): void
    {
        $this->actingAs($this->admin())
            ->from(route('admin.about.items.create'))
            ->post(route('admin.about.items.store'), ['type' => 'statistic'])
            ->assertSessionHasErrors(['value', 'label']);
    }

    public function test_admin_can_update_without_sending_an_explicit_type(): void
    {
        $admin = $this->admin();
        $item = AboutItem::create([
            'type' => 'partner',
            'title' => 'Original partner',
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.about.items.update', $item), [
                'title' => 'Renamed partner',
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.about.items.index'));

        $this->assertDatabaseHas('about_items', ['id' => $item->id, 'title' => 'Renamed partner']);
    }

    public function test_admin_can_update_partner_with_full_form_payload(): void
    {
        $admin = $this->admin();
        $item = AboutItem::create([
            'type' => 'partner',
            'title' => 'City Development Group',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.about.items.update', $item), [
                'type' => 'partner',
                'title' => 'City Development Group',
                'subtitle' => '',
                'description' => '',
                'content' => '',
                'value' => '',
                'label' => '',
                'year' => '',
                'date' => '',
                'image_alt' => '',
                'icon' => '',
                'url' => '',
                'sort_order' => 3,
                'is_active' => 1,
                'is_featured' => 0,
            ])
            ->assertRedirect(route('admin.about.items.index'));
    }

    public function test_admin_can_update_toggle_reorder_and_delete(): void
    {
        $admin = $this->admin();
        $item = AboutItem::create([
            'type' => 'value',
            'title' => 'Original',
            'sort_order' => 5,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.about.items.update', $item), [
                'type' => 'value',
                'title' => 'Updated',
                'sort_order' => 5,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.about.items.index'));

        $this->assertDatabaseHas('about_items', ['id' => $item->id, 'title' => 'Updated']);

        $this->actingAs($admin)->patch(route('admin.about.items.toggle', $item))->assertRedirect();
        $this->assertDatabaseHas('about_items', ['id' => $item->id, 'is_active' => 0]);

        $this->actingAs($admin)->patch(route('admin.about.items.reorder'), ['ids' => [$item->id]])->assertRedirect();
        $this->assertDatabaseHas('about_items', ['id' => $item->id, 'sort_order' => 1]);

        $this->actingAs($admin)->delete(route('admin.about.items.destroy', $item))->assertRedirect(route('admin.about.items.index'));
        $this->assertSoftDeleted('about_items', ['id' => $item->id]);
    }

    public function test_deleting_an_item_removes_its_image_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('about/items/a.jpg', 'x');

        $item = AboutItem::create([
            'type' => 'value',
            'title' => 'With image',
            'image' => 'about/items/a.jpg',
            'is_active' => true,
        ]);

        $this->actingAs($this->admin())
            ->delete(route('admin.about.items.destroy', $item))
            ->assertRedirect(route('admin.about.items.index'));

        Storage::disk('public')->assertMissing('about/items/a.jpg');
    }

    public function test_replacing_an_item_image_deletes_the_previous_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('about/items/old.jpg', 'x');

        $item = AboutItem::create([
            'type' => 'partner',
            'title' => 'Partner',
            'image' => 'about/items/old.jpg',
            'is_active' => true,
        ]);

        $this->actingAs($this->admin())
            ->put(route('admin.about.items.update', $item), [
                'type' => 'partner',
                'title' => 'Partner',
                'image' => UploadedFile::fake()->image('new.jpg', 300, 200),
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.about.items.index'));

        Storage::disk('public')->assertMissing('about/items/old.jpg');
        Storage::disk('public')->assertExists($item->fresh()->image);
    }
}
