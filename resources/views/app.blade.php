<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"  @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        {{-- SEO defaults — pages can override via Inertia <Head> --}}
        <meta name="description" content="POS1 — No.1 POS Software for Philippine retail. Ring up sales in seconds, stay BIR-compliant, and never run out of best-sellers.">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Open Graph --}}
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name') }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="POS1 — No.1 POS Software for Philippine Retail">
        <meta property="og:description" content="Ring up sales in seconds, stay BIR-compliant, and never run out of best-sellers. The POS built for Philippine retail.">
        <meta property="og:image" content="{{ asset('images/pos_cover_dark.png') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="en_PH">

        {{-- Twitter / X Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="POS1 — No.1 POS Software for Philippine Retail">
        <meta name="twitter:description" content="Ring up sales in seconds, stay BIR-compliant, and never run out of best-sellers.">
        <meta name="twitter:image" content="{{ asset('images/pos_cover.png') }}">

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @vite(['resources/css/app.css', 'resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        <x-inertia::head>
            <title>{{ config('app.name', 'POS1') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
