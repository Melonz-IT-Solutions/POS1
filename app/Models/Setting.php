<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'group', 'label', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        // $setting = Cache::remember("setting:{$key}", 3600, function () use ($key) {
        //     return static::where('key', $key)->first();
        // });

        // if ($setting === null) {
        //     return $default;
        // }

        // $value = $setting->value;

        // if ($value === null) {
        //     return $default;
        // }

        // // Try to decode as JSON, return raw string if not valid JSON
        // $decoded = json_decode($value, true);

        // return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
        $setting = static::query()
            ->where('key', $key)
            ->first();

        if ($setting === null) {
            return $default;
        }

        $value = $setting->value;

        if ($value === null) {
            return $default;
        }

        $decoded = json_decode($value, true);

        return json_last_error() === JSON_ERROR_NONE
            ? $decoded
            : $value;
    }

    public static function set(string $key, mixed $value, string $group = 'general', ?string $label = null): void
    {
        $encoded = is_string($value) ? $value : json_encode($value);

        static::updateOrCreate(
            ['key' => $key],
            ['value' => $encoded, 'group' => $group, 'label' => $label]
        );

        Cache::forget("setting:{$key}");
    }

    public static function getGroup(string $group): array
    {
        return static::where('group', $group)
            ->pluck('value', 'key')
            ->map(function ($value) {
                if ($value === null) {
                    return null;
                }
                $decoded = json_decode($value, true);
                return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
            })
            ->toArray();
    }
}
