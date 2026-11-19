<?php

namespace App\Http\Controllers;

use App\Mail\TrialBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TrialBookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'           => ['required', 'string', 'max:100'],
            'store_type'     => ['required', 'string', 'max:60'],
            'store_name'     => ['required', 'string', 'max:150'],
            'address'        => ['required', 'string', 'max:300'],
            'contact_no'     => ['required', 'string', 'max:30'],
            'preferred_date' => ['nullable', 'date'],
            'message'        => ['nullable', 'string', 'max:1000'],
        ]);

        $recipient = env('TRIAL_BOOKING_EMAIL', config('mail.from.address'));

        Mail::to($recipient)
            ->cc(config('mail.from.address'))
            ->send(new TrialBooking(
            name:          $data['name'],
            storeType:     $data['store_type'],
            storeName:     $data['store_name'],
            address:       $data['address'],
            contactNo:     $data['contact_no'],
            preferredDate: $data['preferred_date'] ?? null,
            message:       $data['message'] ?? null,
        ));

        return back()->with('trial_booked', true);
    }
}
