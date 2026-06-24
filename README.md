# Al Hashem Market POS

A Vercel-ready market / convenience store POS MVP.

## Scope

This is not a restaurant system and it has no QR menu.

Included modules:

- POS cashier screen
- Product catalog with SKU/barcode-style search
- Online ordering website screen
- Delivery management
- Inventory and low-stock alerts
- Supplier management
- Customer management
- Cashier session and daily closing
- Sales and inventory reports
- Local demo data fallback
- Optional Supabase browser connection

## Deploy to Vercel

1. Push these files to the GitHub repository.
2. In Vercel, import the repository.
3. Use the default static deployment settings.
4. Open the deployed URL.

No build command is required because this is a static app.

## Connect Supabase

1. Open your Supabase project.
2. Go to SQL Editor.
3. Run `supabase-schema.sql`.
4. Open the app.
5. Go to `Supabase Setup`.
6. Add your Supabase URL and anon key.
7. Test the connection.

## Production note

The SQL file includes open demo policies so the static browser MVP can read and write. Before production, replace them with authenticated role-based policies for admin, manager, cashier, stock controller, and driver.

## Recommended next backend phase

- Supabase Auth users and roles
- Secure RLS policies
- Real product barcode scanner support
- Receipt printer integration
- Payment gateway integration
- Driver mobile PWA
- Purchase order receiving workflow
- Returns approval permissions
