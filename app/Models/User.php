<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $pin
 * @property string $status
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $last_login_at
 * @property int $failed_login_attempts
 * @property Carbon|null $locked_until
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable(['name', 'email', 'password', 'status'])]
#[Hidden(['password', 'pin', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, PasskeyAuthenticatable, SoftDeletes, TwoFactorAuthenticatable;

    protected function casts(): array
    {
        return [
            'email_verified_at'      => 'datetime',
            'password'               => 'hashed',
            'two_factor_confirmed_at'=> 'datetime',
            'last_login_at'          => 'datetime',
            'locked_until'           => 'datetime',
        ];
    }

    public function setPin(?string $pin): void
    {
        $this->pin = $pin ? Hash::make($pin) : null;
        $this->save();
    }

    public function verifyPin(string $pin): bool
    {
        return $this->pin !== null && Hash::check($pin, $this->pin);
    }

    public function isLocked(): bool
    {
        return $this->locked_until !== null && $this->locked_until->isFuture();
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'cashier_id');
    }

    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class, 'cashier_id');
    }

    public function currentShift(): ?Shift
    {
        return $this->shifts()
            ->where('status', 'open')
            ->latest()
            ->first();
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }
}
