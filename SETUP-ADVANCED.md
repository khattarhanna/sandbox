Al Hashem Market POS Advanced Setup

Run SQL in this order:
1. supabase-schema.sql
2. testing-data.sql
3. supabase-advanced-upgrade.sql
4. advanced-testing-data.sql

Vercel variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Then redeploy Vercel.

Advanced modules now included:
- POS cashier
- Online orders
- Delivery
- Inventory
- Purchases
- Returns
- Branches
- Suppliers
- Customers
- Users and roles
- Cashier closing
- Reports

Not included:
- QR menu
- Restaurant table flow
- Waiter flow
- Kitchen display

Replace demo open RLS policies before real production use.
