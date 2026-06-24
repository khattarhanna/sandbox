-- Al Hashem Market POS - Supabase schema
-- Run this in Supabase SQL Editor.
-- This MVP is browser/static-site friendly. For production, enable Auth and tighten RLS before public use.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  barcode text unique,
  sku text unique,
  name text not null,
  category text not null default 'General',
  emoji text default '🛒',
  supplier_name text,
  cost numeric(12,2) not null default 0,
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  min_stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  orders_count integer not null default 0,
  total_spent numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  phone text,
  balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  source text not null check (source in ('POS','Online')),
  customer_name text not null default 'Walk-in Customer',
  fulfillment_type text not null default 'Pickup' check (fulfillment_type in ('Pickup','Delivery')),
  status text not null default 'New',
  payment_method text not null default 'Cash',
  total numeric(12,2) not null default 0,
  items_count integer not null default 0,
  driver_name text,
  delivery_address text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid,
  product_name text not null,
  qty integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  movement_type text not null check (movement_type in ('sale','restock','adjustment','return')),
  qty integer not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.cashier_sessions (
  id uuid primary key default gen_random_uuid(),
  cashier_name text not null,
  opening_cash numeric(12,2) not null default 0,
  cash_sales numeric(12,2) not null default 0,
  card_sales numeric(12,2) not null default 0,
  status text not null default 'Open' check (status in ('Open','Closed')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);

insert into public.products (barcode, sku, name, category, emoji, supplier_name, cost, price, stock, min_stock)
values
('5281000011111','WATER-500','Water 500ml','Drinks','💧','Fresh Distribution',0.22,0.50,142,30),
('5281000011128','COLA-CAN','Cola Can','Drinks','🥤','Fresh Distribution',0.48,0.85,84,24),
('5281000011135','ENERGY','Energy Drink','Drinks','⚡','Beverage Hub',1.05,1.75,18,20),
('5281000011142','CHIPS-SALT','Chips Salt','Snacks','🍟','Snack Line',0.62,1.10,63,18),
('5281000011159','CHOC-BAR','Chocolate Bar','Snacks','🍫','Snack Line',0.70,1.25,51,20),
('5281000011166','BREAD','Bread Pack','Bakery','🍞','Daily Bakery',0.82,1.30,22,14),
('5281000011173','MILK-1L','Milk 1L','Dairy','🥛','Dairy Fresh',1.55,2.20,16,12),
('5281000011180','EGGS-12','Eggs 12pcs','Dairy','🥚','Dairy Fresh',2.70,3.60,9,10),
('5281000011197','TUNA','Tuna Can','Grocery','🥫','Grocery Partners',1.62,2.40,37,15),
('5281000011203','RICE-1KG','Rice 1kg','Grocery','🍚','Grocery Partners',2.10,2.90,28,16),
('5281000011210','DETERGENT','Laundry Detergent','Household','🧴','Home Supply',4.20,5.90,11,8),
('5281000011227','TISSUES','Tissues Box','Household','🧻','Home Supply',0.95,1.65,48,20)
on conflict (barcode) do nothing;

insert into public.customers (name, phone, address, orders_count, total_spent)
values
('Walk-in Customer','-','-',0,0),
('Rima Ghoulam','+961 70 000 111','Main Street, Building 14',2,34.50),
('Ahmad Saleh','+961 71 555 222','Near Pharmacy',1,18.75)
on conflict do nothing;

insert into public.suppliers (name, contact_name, phone, balance)
values
('Fresh Distribution','Nader','+961 1 111 111',240),
('Snack Line','Maya','+961 1 222 222',120),
('Dairy Fresh','Karim','+961 1 333 333',315),
('Grocery Partners','Sami','+961 1 444 444',430)
on conflict do nothing;

-- Demo policies: permissive for testing only. Replace with authenticated policies before production.
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.suppliers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.cashier_sessions enable row level security;

do $$ begin
  create policy "demo read products" on public.products for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo write products" on public.products for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo read customers" on public.customers for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo write customers" on public.customers for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo read suppliers" on public.suppliers for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo write suppliers" on public.suppliers for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo read orders" on public.orders for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo write orders" on public.orders for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo read order items" on public.order_items for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo write order items" on public.order_items for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo read inventory movements" on public.inventory_movements for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo write inventory movements" on public.inventory_movements for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo read cashier sessions" on public.cashier_sessions for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "demo write cashier sessions" on public.cashier_sessions for all using (true) with check (true);
exception when duplicate_object then null; end $$;
