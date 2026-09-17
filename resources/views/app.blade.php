<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php($companyProfile = app(\App\Services\Company\CompanyProfileService::class)->getProfile() ?? [])

        @if (! empty($companyProfile['favicon']))
            <link rel="icon" href="{{ asset('storage/'.ltrim($companyProfile['favicon'], '/')) }}">
        @endif

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])

        @include('partials.seo-meta', ['page' => $page])
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
