<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Exceptions\AdminManagementException;
use App\Models\User;
use App\Services\Admin\AdminService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(array $attributes = []): User
    {
        return User::factory()->create(['is_admin' => true] + $attributes);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('admin.admins.index'))->assertRedirect('/login');
    }

    public function test_non_admin_users_are_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.admins.index'))->assertForbidden();
    }

    public function test_admin_can_view_the_administrator_list(): void
    {
        $admin = $this->admin(['name' => 'Root Admin']);
        $this->admin(['name' => 'Second Admin']);

        $this->actingAs($admin)
            ->get(route('admin.admins.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/admins/index')
                ->has('items.data', 2)
                ->has('filters'));
    }

    public function test_administrators_can_be_searched_by_name_or_email(): void
    {
        $admin = $this->admin(['name' => 'Root Admin', 'email' => 'root@example.com']);
        $this->admin(['name' => 'Jane Doe', 'email' => 'jane@example.com']);

        $this->actingAs($admin)
            ->get(route('admin.admins.index', ['search' => 'jane']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('items.data', 1)->where('items.data.0.email', 'jane@example.com'));
    }

    public function test_non_admin_users_are_never_listed(): void
    {
        $admin = $this->admin();
        User::factory()->create(['is_admin' => false]);

        $this->actingAs($admin)
            ->get(route('admin.admins.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('items.data', 1));
    }

    public function test_admin_can_create_another_administrator_with_a_hashed_password(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.admins.store'), [
                'name' => 'New Admin',
                'email' => 'new-admin@example.com',
                'password' => 'secret-password',
                'password_confirmation' => 'secret-password',
            ])
            ->assertRedirect(route('admin.admins.index'));

        $created = User::where('email', 'new-admin@example.com')->firstOrFail();

        $this->assertTrue($created->isAdministrator());
        $this->assertNotSame('secret-password', $created->password);
        $this->assertTrue(Hash::check('secret-password', $created->password));
    }

    public function test_duplicate_email_is_rejected_when_creating(): void
    {
        $admin = $this->admin(['email' => 'taken@example.com']);

        $this->actingAs($admin)
            ->from(route('admin.admins.create'))
            ->post(route('admin.admins.store'), [
                'name' => 'Another',
                'email' => 'taken@example.com',
                'password' => 'secret-password',
                'password_confirmation' => 'secret-password',
            ])
            ->assertSessionHasErrors('email');

        $this->assertSame(1, User::where('email', 'taken@example.com')->count());
    }

    public function test_password_confirmation_must_match_when_creating(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->from(route('admin.admins.create'))
            ->post(route('admin.admins.store'), [
                'name' => 'Mismatch',
                'email' => 'mismatch@example.com',
                'password' => 'secret-password',
                'password_confirmation' => 'different-password',
            ])
            ->assertSessionHasErrors('password');
    }

    public function test_admin_can_update_another_administrator(): void
    {
        $admin = $this->admin();
        $target = $this->admin(['name' => 'Old Name', 'email' => 'old@example.com']);

        $this->actingAs($admin)
            ->put(route('admin.admins.update', $target), [
                'name' => 'New Name',
                'email' => 'new@example.com',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $target->id,
            'name' => 'New Name',
            'email' => 'new@example.com',
            'is_admin' => true,
        ]);
    }

    public function test_duplicate_email_is_rejected_when_updating(): void
    {
        $admin = $this->admin(['email' => 'taken@example.com']);
        $target = $this->admin(['email' => 'target@example.com']);

        $this->actingAs($admin)
            ->from(route('admin.admins.edit', $target))
            ->put(route('admin.admins.update', $target), [
                'name' => 'Target',
                'email' => 'taken@example.com',
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_admin_password_is_never_exposed_to_the_frontend(): void
    {
        $admin = $this->admin();
        $target = $this->admin();

        $this->actingAs($admin)
            ->get(route('admin.admins.edit', $target))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/admins/edit')
                ->has('item.id')
                ->missing('item.password')
                ->missing('item.remember_token'));
    }

    public function test_admin_can_change_another_administrator_password(): void
    {
        $admin = $this->admin();
        $target = $this->admin(['password' => Hash::make('old-password')]);

        $this->actingAs($admin)
            ->put(route('admin.admins.password.update', $target), [
                'password' => 'brand-new-password',
                'password_confirmation' => 'brand-new-password',
            ])
            ->assertRedirect();

        $this->assertTrue(Hash::check('brand-new-password', $target->fresh()->password));
    }

    public function test_password_change_requires_confirmation(): void
    {
        $admin = $this->admin();
        $target = $this->admin();

        $this->actingAs($admin)
            ->from(route('admin.admins.edit', $target))
            ->put(route('admin.admins.password.update', $target), [
                'password' => 'brand-new-password',
                'password_confirmation' => 'nope',
            ])
            ->assertSessionHasErrors('password');
    }

    public function test_admin_can_delete_another_administrator(): void
    {
        $admin = $this->admin();
        $target = $this->admin();

        $this->actingAs($admin)
            ->delete(route('admin.admins.destroy', $target))
            ->assertRedirect(route('admin.admins.index'));

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    public function test_administrator_cannot_delete_themselves(): void
    {
        $admin = $this->admin();
        $this->admin();

        $response = $this->actingAs($admin)->delete(route('admin.admins.destroy', $admin));

        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_last_administrator_cannot_be_deleted_at_the_service_level(): void
    {
        $onlyAdmin = $this->admin();
        $nonAdmin = User::factory()->create(['is_admin' => false]);

        $this->expectException(AdminManagementException::class);

        app(AdminService::class)->delete($onlyAdmin, $nonAdmin);
    }

    public function test_non_administrator_target_cannot_be_edited_through_this_module(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($admin)
            ->get(route('admin.admins.edit', $user))
            ->assertNotFound();
    }

    public function test_non_administrator_target_cannot_be_deleted_through_this_module(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($admin)
            ->delete(route('admin.admins.destroy', $user))
            ->assertNotFound();

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }
}
