<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'action', 'auditable_type', 'auditable_id',
        'old_values', 'new_values', 'ip_address', 'user_agent', 'created_at',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public static function record(
        string $action,
        ?Model $model = null,
        array $oldValues = [],
        array $newValues = [],
    ): void {
        static::create([
            'user_id'        => auth()->id(),
            'action'         => $action,
            'auditable_type' => $model ? $model::class : null,
            'auditable_id'   => $model?->getKey(),
            'old_values'     => empty($oldValues) ? null : $oldValues,
            'new_values'     => empty($newValues) ? null : $newValues,
            'ip_address'     => request()->ip(),
            'user_agent'     => request()->userAgent(),
            'created_at'     => now(),
        ]);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
