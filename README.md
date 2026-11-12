# POS System — Philippines Retail

A production-ready Point of Sale system built with Laravel 13 + Inertia.js + Vue 3 + TypeScript + Tailwind CSS v4.

## Default Login Credentials

| Role          | Email               | Password  |
|---------------|---------------------|-----------|
| Administrator | admin@pos.com       | password  |
| Manager       | manager@pos.com     | password  |
| Cashier       | cashier@pos.com     | password  |

> **Change these immediately in production.**

---

## Quick Start (Docker)

```bash
# 1. Clone and enter project
cd pos1

# 2. Run one-command setup
make setup

# 3. Open in browser
open http://localhost:8000
```

The `make setup` command will:
- Copy `.env.example` → `.env`
- Build Docker images
- Start MySQL, Redis, Nginx, PHP-FPM
- Run composer install
- Run all migrations + seeders
- Build frontend assets

---

## Manual Setup (without Docker)

### Requirements
- PHP 8.3+
- MySQL 8.0+
- Redis 7+
- Node 20+
- Composer 2

### Steps

```bash
# 1. Install PHP dependencies
composer install

# 2. Copy env
cp .env.example .env

# 3. Update .env with your DB credentials
# DB_HOST=127.0.0.1
# DB_DATABASE=pos1
# DB_USERNAME=your_user
# DB_PASSWORD=your_password

# 4. Generate app key
php artisan key:generate

# 5. Publish Spatie Permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# 6. Run migrations + seed
php artisan migrate --seed

# 7. Install frontend dependencies
npm install

# 8. Build frontend
npm run build
# or for development:
npm run dev

# 9. Start Laravel dev server
php artisan serve
```

---

## Docker Commands

```bash
make up          # Start all containers
make dev         # Start with Vite dev server (adds 'node' profile)
make down        # Stop all containers
make logs        # Follow logs
make shell       # Open bash in app container
make fresh       # Fresh migrate + seed (destroys all data)
make test        # Run test suite
make artisan CMD='route:list'  # Run any artisan command
```

---

## Environment Variables

| Variable            | Description                          | Default       |
|---------------------|--------------------------------------|---------------|
| `APP_NAME`          | Application name                     | POS System    |
| `APP_URL`           | Application URL                      | http://localhost:8000 |
| `APP_PORT`          | Nginx port                           | 8000          |
| `VITE_PORT`         | Vite dev server port                 | 5173          |
| `DB_HOST`           | MySQL host (use `mysql` in Docker)   | 127.0.0.1     |
| `DB_DATABASE`       | MySQL database name                  | pos1          |
| `DB_USERNAME`       | MySQL user                           | pos_user      |
| `DB_PASSWORD`       | MySQL password                       | pos_secret    |
| `DB_ROOT_PASSWORD`  | MySQL root password                  | root_secret   |

---

## Architecture

```
app/
├── Actions/          # Single-responsibility invokable classes
│   ├── Sales/        # CreateSaleAction, VoidSaleAction, etc.
│   └── Inventory/    # DeductStockAction, RestoreStockAction
├── DataTransferObjects/  # Typed input objects (CartItemData, etc.)
├── Enums/            # PHP 8.1+ backed enums
├── Models/           # Eloquent models
├── Policies/         # Authorization policies
├── Repositories/     # Data access layer with contracts
├── Services/         # Business logic orchestration
│   ├── SaleService.php
│   ├── TaxService.php
│   ├── DiscountService.php
│   ├── InventoryService.php
│   └── ShiftService.php
└── Http/
    ├── Controllers/POS/
    └── Requests/POS/

resources/js/
├── components/
│   ├── pos/          # Cashier screen components
│   └── common/       # Reusable UI components
├── composables/      # useCurrency, useTax, useBarcode, useDiscount
├── pages/pos/        # POS cashier screen
├── stores/           # Pinia stores (cart, pos, settings)
└── types/            # TypeScript interfaces
```

---

## Money Handling

All monetary values are stored as **integers in centavos**.  
`₱1.00 = 100` | `₱1,234.56 = 123456`

**Never use floating-point for money.**

---

## VAT Calculation (Philippines BIR)

**VAT-inclusive (default):**
- Net (VATable Sales) = Gross × 100/112
- VAT Amount = Gross × 12/112
- Verify: Net + VAT = Gross ✓

**Receipt breakdown shows:**
- VATable Sales (net amount)
- VAT-Exempt Sales
- Zero-Rated Sales
- VAT Amount (12%)
- Discount
- Total Due
- Amount Tendered
- Change

---

## Keyboard Shortcuts (POS Screen)

| Key        | Action                     |
|------------|----------------------------|
| F2         | Focus product search       |
| F12 / Ctrl+Enter | Open payment modal  |
| Escape     | Clear cart                 |
| Enter (search) | Add product / scan   |

Barcode scanners (HID keyboard emulation) work automatically.

---

## Running Tests

```bash
# All tests
php artisan test

# Unit tests only
php artisan test --testsuite=Unit

# With coverage
php artisan test --coverage
```

Tests cover:
- `TaxServiceTest` — VAT-inclusive/exclusive calculations, Senior/PWD discount
- `DiscountServiceTest` — Percentage and fixed discounts
- `CreateSaleActionTest` — Full sale creation, change calculation, stock deduction
- `StockDeductionTest` — Inventory movements and balances

---

## Module Status

| Module                   | Status  |
|--------------------------|---------|
| 1. Sales Management      | ✅ Done  |
| 2. Inventory Management  | 🔜 Next  |
| 3. Product Management    | 🔜 Next  |
| 4. Payment Management    | ✅ Done  |
| 5. User Management       | 🔜 Next  |
| 6. Customer Management   | 🔜 Next  |
| 7. Supplier Management   | 🔜 Next  |
| 8. Purchase Management   | 🔜 Next  |
| 9. Reports & Analytics   | 🔜 Next  |
| 10. Dashboard            | 🔜 Next  |
| 11. Discounts            | 🔜 Next  |
| 12. System Settings      | 🔜 Next  |
