<?php

namespace App\Services;

use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Deduct stock for a product and record movement.
     * Must be called within a DB transaction.
     */
    public function deduct(
        Product $product,
        int $quantity,
        StockMovementType $type,
        User $user,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $reason = null,
    ): StockMovement {
        $before = $product->stock_quantity;
        $after  = $before - $quantity;

        // Lock the row to prevent concurrent deductions
        Product::lockForUpdate()->find($product->id);
        $product->decrement('stock_quantity', $quantity);
        $product->refresh();

        return StockMovement::create([
            'product_id'      => $product->id,
            'type'            => $type,
            'quantity'        => -$quantity,
            'quantity_before' => $before,
            'quantity_after'  => $product->stock_quantity,
            'unit_cost'       => $product->cost_price,
            'reference_type'  => $referenceType,
            'reference_id'    => $referenceId,
            'reason'          => $reason,
            'user_id'         => $user->id,
        ]);
    }

    /**
     * Restore (increase) stock for a product and record movement.
     * Must be called within a DB transaction.
     */
    public function restore(
        Product $product,
        int $quantity,
        StockMovementType $type,
        User $user,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $reason = null,
    ): StockMovement {
        $before = $product->stock_quantity;

        Product::lockForUpdate()->find($product->id);
        $product->increment('stock_quantity', $quantity);
        $product->refresh();

        return StockMovement::create([
            'product_id'      => $product->id,
            'type'            => $type,
            'quantity'        => $quantity,
            'quantity_before' => $before,
            'quantity_after'  => $product->stock_quantity,
            'unit_cost'       => $product->cost_price,
            'reference_type'  => $referenceType,
            'reference_id'    => $referenceId,
            'reason'          => $reason,
            'user_id'         => $user->id,
        ]);
    }

    /**
     * Manual adjustment (can be positive or negative).
     */
    public function adjust(
        Product $product,
        int $newQuantity,
        string $reason,
        User $user,
    ): StockMovement {
        $before     = $product->stock_quantity;
        $difference = $newQuantity - $before;

        $product->update(['stock_quantity' => $newQuantity]);

        return StockMovement::create([
            'product_id'      => $product->id,
            'type'            => StockMovementType::ManualAdjustment,
            'quantity'        => $difference,
            'quantity_before' => $before,
            'quantity_after'  => $newQuantity,
            'unit_cost'       => $product->cost_price,
            'reason'          => $reason,
            'user_id'         => $user->id,
        ]);
    }
}
