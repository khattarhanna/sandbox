-- Al Hashem Market POS Supabase schema
-- Demo-ready schema for POS, online ordering, delivery, inventory, suppliers, customers, cashier closing, and reports.

create extension if not exists pgcrypto;

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  balance numeric(12,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  category_id uuid references product_categories(id),
  supplier_id uuid references suppliers(id),
  name text not null,
  sku text,
  barcode text,
  unit text not null default 'piece',
  cost_price numeric(12,2) not null default 0,
  sell_price numeric(12,2) not null default 0,
  stock_qty numeric(12,2) not null default 0,
  low_stock_qty numeric(12,2) not null default 5,
  tax_rate numeric(5,2) not null default 0,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  branch_id uuid references branches(id),
  customer_id uuid references customers(id),
  order_no text unique,
  source text not null check (source in ('pos','online','delivery')) default 'pos',
  status text not null check (status in ('draft','new','accepted','preparing','ready','out_for_delivery','completed','cancelled','refunded')) default 'new',
  subtotal numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null default 0,
  payment_status text not null check (payment_status in ('unpaid','partial','paid','refunded')) default 'unpaid',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  qty numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  cost_price numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  method text not null check (method in ('cash','card','mixed','online','wallet')),
  amount numeric(12,2) not null,
  reference text,
  paid_at timestamptz not null default now()
);

create table if not exists delivery_orders (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  driver_name text,
  customer_address text,
  delivery_fee numeric(12,2) not null default 0,
  status text not null check (status in ('pending','assigned','picked_up','out_for_delivery','delivered','failed','cancelled')) default 'pending',
  cash_collected numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  movement_type text not null check (movement_type in ('opening','sale','return','purchase','adjustment','damage')),
  qty_change numeric(12,2) not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists cashier_sessions (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references branches(id),
  cashier_name text not null,
  opening_cash numeric(12,2) not null default 0,
  expected_cash numeric(12,2) not null default 0,
  actual_cash numeric(12,2),
  difference numeric(12,2),
  status text not null check (status in ('open','closed')) default 'open',
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);

insert into stores (name, phone, address) values ('Al Hashem Market', '+961 00 000 000', 'Main Branch') on conflict do nothing;

alter table stores enable row level security;
alter table branches enable row level security;
alter table product_categories enable row level security;
alter table suppliers enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table delivery_orders enable row level security;
alter table stock_movements enable row level security;
alter table cashier_sessions enable row level security;

-- Demo policies for static browser MVP only. Replace before production.
do $$ begin
  create policy demo_all_stores on stores for all using (true) with check (true);
  create policy demo_all_branches on branches for all using (true) with check (true);
  create policy demo_all_categories on product_categories for all using (true) with check (true);
  create policy demo_all_suppliers on suppliers for all using (true) with check (true);
  create policy demo_all_products on products for all using (true) with check (true);
  create policy demo_all_customers on customers for all using (true) with check (true);
  create policy demo_all_orders on orders for all using (true) with check (true);
  create policy demo_all_order_items on order_items for all using (true) with check (true);
  create policy demo_all_payments on payments for all using (true) with check (true);
  create policy demo_all_delivery on delivery_orders for all using (true) with check (true);
  create policy demo_all_stock on stock_movements for all using (true) with check (true);
  create policy demo_all_sessions on cashier_sessions for all using (true) with check (true);
exception when duplicate_object then null; end $$;
