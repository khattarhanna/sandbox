# Al Hashem Market POS

Market and convenience store POS MVP connected to Vercel + Supabase live data.

## Scope

Includes POS cashier, barcode-style product search, cart checkout, online orders, delivery, inventory, suppliers, customers, cashier closing, reports, and Supabase setup.

Not included: restaurant tables, waiter flow, kitchen display, or QR menu.

## Vercel variables

Add these in Vercel Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_or_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_backend_only
```

The current browser app uses only the first two through `/api/config.js`. Do not expose or use the service role key in browser code.

## Supabase setup

Run in this order inside Supabase SQL Editor:

1. `supabase-schema.sql`
2. `testing-data.sql`

`testing-data.sql` resets the demo tables, so use it only in a testing database.

## Deploy

Import this repo/folder to Vercel. No build command is required. After changing environment variables, redeploy.
