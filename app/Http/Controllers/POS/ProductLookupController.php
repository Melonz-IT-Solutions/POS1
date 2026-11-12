<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductLookupController extends Controller
{
    public function __construct(private readonly ProductRepositoryInterface $productRepository) {}

    public function search(Request $request): JsonResponse
    {
        $term = $request->validate([
            'q' => ['required', 'string', 'min:1', 'max:100'],
        ])['q'];

        $products = $this->productRepository->search($term, 15);

        return response()->json(['products' => $products]);
    }

    public function barcode(Request $request): JsonResponse
    {
        $barcode = $request->validate([
            'barcode' => ['required', 'string'],
        ])['barcode'];

        // Try barcode first, then SKU
        $product = $this->productRepository->findByBarcode($barcode)
            ?? $this->productRepository->findBySku($barcode);

        if (! $product) {
            return response()->json(['product' => null, 'message' => 'Product not found.'], 404);
        }

        return response()->json(['product' => $product]);
    }
}
