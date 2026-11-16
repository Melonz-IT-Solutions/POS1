<?php

namespace App\Mail;

use App\Models\Sale;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SaleReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public array $settings;

    public function __construct(public Sale $sale)
    {
        $this->settings = [
            'business_name'    => Setting::get('business_name',    'My Store'),
            'business_address' => Setting::get('business_address', ''),
            'business_phone'   => Setting::get('business_phone',   ''),
            'business_tin'     => Setting::get('business_tin',     ''),
            'business_email'   => Setting::get('business_email',   ''),
        ];
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Receipt #{$this->sale->receipt_number} from {$this->settings['business_name']}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.sale-receipt',
        );
    }
}
