<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Trial Booking</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; }
        .wrapper { max-width: 560px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
        .header { background: #141A2A; padding: 28px 32px; }
        .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
        .header p { margin: 4px 0 0; color: #94a3b8; font-size: 13px; }
        .body { padding: 28px 32px; }
        .label { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 3px; }
        .value { font-size: 15px; color: #09090b; font-weight: 500; margin-bottom: 20px; }
        .badge { display: inline-block; background: #eff6ff; color: #2563eb; border-radius: 20px; padding: 3px 10px; font-size: 12px; font-weight: 600; }
        .footer { border-top: 1px solid #f1f5f9; padding: 16px 32px; text-align: center; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>New Free Trial Booking</h1>
            <p>Someone just requested a free trial for POS1.</p>
        </div>
        <div class="body">
            <div class="label">Contact Name</div>
            <div class="value">{{ $name }}</div>

            <div class="label">Store Type</div>
            <div class="value"><span class="badge">{{ $storeType }}</span></div>

            <div class="label">Store Name / Full Name</div>
            <div class="value">{{ $storeName }}</div>

            <div class="label">Address</div>
            <div class="value">{{ $address }}</div>

            <div class="label">Contact Number</div>
            <div class="value">{{ $contactNo }}</div>

            @if($preferredDate)
            <div class="label">Preferred Start Date</div>
            <div class="value">{{ \Carbon\Carbon::parse($preferredDate)->format('F j, Y') }}</div>
            @endif

            @if($message)
            <div class="label">Message</div>
            <div class="value" style="white-space: pre-wrap;">{{ $message }}</div>
            @endif
        </div>
        <div class="footer">
            POS1 &mdash; Powered by Melonz IT Solutions
        </div>
    </div>
</body>
</html>
