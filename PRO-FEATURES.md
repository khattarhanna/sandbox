# Al Hashem POS Pro Features

Added in this pass:

- Pro command dock
- Command palette
- Held carts
- Resume held cart
- Receipt preview
- Print receipt
- Manager pulse dashboard
- Light / dark mode
- Keyboard shortcuts
- POS state exposure for safe UI extensions
- Sale completed event hook

Keyboard shortcuts:

- F2: Open POS Cashier
- F4: Open Orders
- Ctrl + K: Focus search
- Ctrl + Shift + K: Command palette
- Ctrl + P: Receipt preview / print helper

Deployment:

Redeploy Vercel after pushing these changes.

Database:

Run these files in Supabase if not already done:

1. supabase-schema.sql
2. testing-data.sql
3. supabase-advanced-upgrade.sql
4. advanced-testing-data.sql

Security:

The demo policies are for testing only. Replace open demo RLS with authenticated role-based policies before production data.
