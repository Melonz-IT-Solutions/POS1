<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Receipt #{{ $sale->receipt_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
        .wrapper { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
        .header { background: #18181b; color: #ffffff; padding: 24px 28px; }
        .header h1 { margin: 0 0 4px; font-size: 20px; }
        .header p { margin: 0; font-size: 13px; color: #a1a1aa; }
        .body { padding: 24px 28px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
        .meta-col p { margin: 2px 0; }
        .meta-col .label { color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; border-bottom: 2px solid #e4e4e7; padding: 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #71717a; }
        td { padding: 8px 0; border-bottom: 1px solid #f4f4f5; vertical-align: top; }
        td.right, th.right { text-align: right; }
        .totals { margin-top: 16px; font-size: 13px; }
        .totals-row { display: flex; justify-content: space-between; padding: 3px 0; }
        .totals-row.total { font-size: 16px; font-weight: 700; border-top: 2px solid #18181b; padding-top: 8px; margin-top: 6px; }
        .footer { background: #f4f4f5; padding: 16px 28px; text-align: center; font-size: 12px; color: #71717a; }
        .payments { margin-top: 16px; font-size: 13px; }
        .payment-row { display: flex; justify-content: space-between; padding: 3px 0; }
    </style>
</head>
<body>
<div class="wrapper">
    <!-- Header -->
    <div class="header">
        <h1>{{ $settings['business_name'] }}</h1>
        @if($settings['business_address'])
            <p>{{ $settings['business_address'] }}</p>
        @endif
        @if($settings['business_phone'])
            <p>{{ $settings['business_phone'] }}</p>
        @endif
        @if($settings['business_tin'])
            <p>TIN: {{ $settings['business_tin'] }}</p>
        @endif
    </div>

    <!-- Body -->
    <div class="body">
        <div class="meta">
            <div class="meta-col">
                <p class="label">Receipt</p>
                <p><strong>{{ $sale->receipt_number }}</strong></p>
                <p>{{ $sale->created_at->format('M d, Y g:i A') }}</p>
            </div>
            <div class="meta-col" style="text-align:right">
                @if($sale->customer)
                    <p class="label">Customer</p>
                    <p><strong>{{ $sale->customer->name }}</strong></p>
                    @if($sale->customer->phone)<p>{{ $sale->customer->phone }}</p>@endif
                @else
                    <p class="label">Customer</p>
                    <p>Walk-in</p>
                @endif
            </div>
        </div>

        <!-- Items -->
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="right">Qty</th>
                    <th class="right">Unit</th>
                    <th class="right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sale->items ?? [] as $item)
                <tr>
                    <td>
                        {{ $item->product_name }}<br>
                        <span style="color:#71717a;font-size:11px">{{ $item->product_sku }}</span>
                    </td>
                    <td class="right">{{ $item->quantity }}</td>
                    <td class="right">₱{{ number_format($item->unit_price / 100, 2) }}</td>
                    <td class="right">₱{{ number_format($item->line_total / 100, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
            <div class="totals-row">
                <span>Subtotal</span>
                <span>₱{{ number_format($sale->subtotal / 100, 2) }}</span>
            </div>
            @if($sale->discount_amount > 0)
            <div class="totals-row" style="color:#16a34a">
                <span>Discount</span>
                <span>-₱{{ number_format($sale->discount_amount / 100, 2) }}</span>
            </div>
            @endif
            @if($sale->vat_amount > 0)
            <div class="totals-row" style="color:#71717a">
                <span>VAT (12%)</span>
                <span>₱{{ number_format($sale->vat_amount / 100, 2) }}</span>
            </div>
            @endif
            <div class="totals-row total">
                <span>Total</span>
                <span>₱{{ number_format($sale->total_amount / 100, 2) }}</span>
            </div>
        </div>

        <!-- Payments -->
        @if($sale->payments && $sale->payments->count())
        <div class="payments" style="margin-top:20px;border-top:1px solid #e4e4e7;padding-top:12px">
            <p style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#71717a;margin:0 0 6px">Payment</p>
            @foreach($sale->payments as $payment)
            <div class="payment-row">
                <span>{{ ucfirst($payment->payment_method) }}</span>
                <span>₱{{ number_format($payment->amount / 100, 2) }}</span>
            </div>
            @endforeach
            @if($sale->change_amount > 0)
            <div class="payment-row" style="color:#71717a">
                <span>Change</span>
                <span>₱{{ number_format($sale->change_amount / 100, 2) }}</span>
            </div>
            @endif
        </div>
        @endif
    </div>

    <!-- Footer -->
    <div class="footer">
        <p style="margin:0 0 4px;font-weight:600">Thank you for your purchase!</p>
        @if($settings['business_email'])
            <p style="margin:0">Questions? Email {{ $settings['business_email'] }}</p>
        @endif
    </div>
</div>
</body>
</html>
