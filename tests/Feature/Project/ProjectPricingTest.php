<?php

namespace Tests\Feature\Project;

use App\Models\Project\ProjectPricingPlan;

class ProjectPricingTest extends ProjectTestCase
{
    public function test_admin_can_add_a_pricing_plan(): void
    {
        $project = $this->makeProject();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.pricing.store', $project), [
                'unit_type' => '3 Bed Apartment',
                'size_sqft' => '1450',
                'price_per_sqft' => '8500',
                'total_price' => '12325000.00',
                'booking_money' => '500000',
                'down_payment_percentage' => '30',
                'status' => 'available',
                'is_featured' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('project_pricing_plans', ['project_id' => $project->id, 'unit_type' => '3 Bed Apartment']);
    }

    public function test_unit_type_is_required(): void
    {
        $project = $this->makeProject();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.pricing.store', $project), ['status' => 'available'])
            ->assertSessionHasErrors('unit_type');
    }

    public function test_down_payment_percentage_is_range_validated(): void
    {
        $project = $this->makeProject();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.pricing.store', $project), [
                'unit_type' => 'Bad',
                'down_payment_percentage' => '150',
                'status' => 'available',
            ])
            ->assertSessionHasErrors('down_payment_percentage');
    }

    public function test_update_duplicate_reorder_and_delete(): void
    {
        $project = $this->makeProject();

        $first = ProjectPricingPlan::create(['project_id' => $project->id, 'unit_type' => 'A', 'status' => 'available', 'sort_order' => 1]);
        $second = ProjectPricingPlan::create(['project_id' => $project->id, 'unit_type' => 'B', 'status' => 'available', 'sort_order' => 2]);

        $admin = $this->admin();

        $this->actingAs($admin)
            ->put(route('admin.projects.pricing.update', ['project' => $project->id, 'pricing' => $first->id]), [
                'unit_type' => 'A updated',
                'status' => 'sold_out',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('project_pricing_plans', ['id' => $first->id, 'unit_type' => 'A updated', 'status' => 'sold_out']);

        $this->actingAs($admin)
            ->post(route('admin.projects.pricing.duplicate', ['project' => $project->id, 'pricing' => $first->id]))
            ->assertRedirect();

        $this->assertDatabaseCount('project_pricing_plans', 3);

        $this->actingAs($admin)
            ->patch(route('admin.projects.pricing.reorder', $project), ['ids' => [$second->id, $first->id]])
            ->assertRedirect();

        $this->assertSame(1, $second->fresh()->sort_order);
        $this->assertSame(2, $first->fresh()->sort_order);

        $this->actingAs($admin)
            ->delete(route('admin.projects.pricing.destroy', ['project' => $project->id, 'pricing' => $first->id]))
            ->assertRedirect();

        $this->assertDatabaseMissing('project_pricing_plans', ['id' => $first->id]);
    }

    public function test_money_is_stored_as_decimal(): void
    {
        $project = $this->makeProject();

        $plan = ProjectPricingPlan::create([
            'project_id' => $project->id,
            'unit_type' => 'A',
            'total_price' => '1234567.89',
            'status' => 'available',
            'sort_order' => 1,
        ]);

        $this->assertSame('1234567.89', $plan->fresh()->total_price);
    }
}
