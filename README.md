Al Hashem Market POS - Advanced Live Version

Advanced market and convenience store POS for Vercel and Supabase.

Current scope:
- Advanced dashboard / overview
- POS cashier with product search, barcode/SKU fields, cart, quantity control, and stock deduction
- Online ordering test flow
- Orders command center
- Delivery board
- Inventory table with low-stock alerts
- Suppliers and customers
- Cashier closing
- Reports and JSON export
- Live Supabase mode through api/config.js

Not included:
- QR menu
- Restaurant table flow
- Waiter flow
- Kitchen display

Vercel variables required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Supabase setup:
1. Run supabase-schema.sql
2. Run testing-data.sql
3. Redeploy Vercel
