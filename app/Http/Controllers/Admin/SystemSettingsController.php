<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingsController extends Controller
{
    private array $groups = ['business', 'tax', 'currency', 'receipt', 'loyalty', 'system'];

    public function index(): Response
    {
        $this->authorize('manage settings');

        $settings = [];
        foreach ($this->groups as $group) {
            $settings[$group] = Setting::where('group', $group)
                ->orderBy('key')
                ->get(['key', 'group', 'label', 'value'])
                ->toArray();
        }

        return Inertia::render('admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $this->authorize('manage settings');

        $data = $request->validate([
            'settings'         => ['required', 'array'],
            'settings.*.key'   => ['required', 'string'],
            'settings.*.value' => ['nullable'],
        ]);

        foreach ($data['settings'] as $item) {
            $existing = Setting::where('key', $item['key'])->first();
            if ($existing) {
                Setting::set($item['key'], $item['value'], $existing->group, $existing->label);
            }
        }

        AuditLog::record('settings.update', null, [], ['keys_updated' => array_column($data['settings'], 'key')]);

        return back()->with('success', 'Settings saved.');
    }
}
