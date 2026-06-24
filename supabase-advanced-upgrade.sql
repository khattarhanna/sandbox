-- Advanced upgrade for Al Hashem Market POS
-- Run after supabase-schema.sql. Safe to run multiple times.

create extension if not exists pgcrypto;

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  full_name text not null,
  email text,
  role text not null check (role in ('admin','manager','cashier','stock_controller','driver','viewer')) default 'cashier',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  supplier_id uuid references suppliers(id),
  po_no text unique,
  status text not null check (status in ('draft','ordered','partially_received','received','cancelled')) default 'draft',
  subtotal numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  received_at timestamptz
);

create table if not exists purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid references purchase_orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  qty_ordered numeric(12,2) not null default 0,
  qty_received numeric(12,2) not null default 0,
  unit_cost numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0
);

create table if not exists refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  reason text not null,
  restock boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  delivery_fee numeric(12,2) not null default 0,
  minimum_order numeric(12,2) not null default 0,
  is_active boolean not null default true
);

create table if not exists branch_stock_transfers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  from_branch_id uuid references branches(id),
  to_branch_id uuid references branches(id),
  qty numeric(12,2) not null,
  status text not null check (status in ('draft','sent','received','cancelled')) default 'draft',
  created_at timestamptz not null default now()
);

alter table app_users enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_items enable row level security;
alter table refunds enable row level security;
alter table delivery_zones enable row level security;
alter table branch_stock_transfers enable row level security;

do $$ begin
  create policy demo_all_app_users on app_users for all using (true) with check (true);
  create policy demo_all_purchase_orders on purchase_orders for all using (true) with check (true);
  create policy demo_all_purchase_order_items on purchase_order_items for all using (true) with check (true);
  create policy demo_all_refunds on refunds for all using (true) with check (true);
  create policy demo_all_delivery_zones on delivery_zones for all using (true) with check (true);
  create policy demo_all_branch_stock_transfers on branch_stock_transfers for all using (true) with check (true);
exception when duplicate_object then null; end $$;

insert into app_users (store_id,full_name,email,role)
select id,'Admin User','admin@alhashem.test','admin' from stores limit 1
on conflict do nothing;

insert into delivery_zones (store_id,name,delivery_fee,minimum_order)
select id,'Nearby Zone',1.50,5.00 from stores limit 1
on conflict do nothing;
