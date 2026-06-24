# Al Hashem Market POS - Advanced Live Version

Advanced market / convenience store POS MVP for Vercel + Supabase.

Scope:
- Dashboard / overview
- POS cashier with cart, quantity controls, stock deduction
- Online ordering demo flow
- Orders command center
- Delivery board
- Inventory with barcode/SKU search and low-stock alerts
- Suppliers and customers
- Cashier closing
- Reports and JSON export
- Live Supabase mode through `/api/config.js`

Not included:
- QR menu
- Restaurant table flow
- Waiter flow
- Kitchen display

Vercel variables required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Run in Supabase SQL Editor:
1. supabase-schema.sql
2. testing-data.sql

Redeploy Vercel after updating variables or code.
