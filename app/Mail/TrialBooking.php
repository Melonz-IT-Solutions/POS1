<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TrialBooking extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $storeType,
        public string $storeName,
        public string $address,
        public string $contactNo,
        public ?string $preferredDate = null,
        public ?string $message = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New Trial Booking – {$this->storeName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.trial-booking',
        );
    }
}
