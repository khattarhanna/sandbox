-- Al Hashem Market POS Supabase schema
-- MVP/demo policies are intentionally open for browser-based testing.
-- Before production, replace these policies with authenticated role-based access.

create extension if not exists pgcrypto;

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  branch text,
  currency text default 'USD',
  tax_rate numeric default 0,
  delivery_fee numeric default 0,
  minimum_delivery_order numeric default 0,
  created_at timestamptz default now()
);

create table if not exists suppliers (
  id text primary key,
  name text not null,
  contact text,
  phone text,
  balance numeric default 0,
  created_at timestamptz default now()
);

create table if not exists products (
  id text primary key,
  sku text unique not null,
  name text not null,
  category text not null,
  price numeric not null default 0,
  cost numeric not null default 0,
  stock integer not null default 0,
  low_stock integer not null default 0,
  supplier_id text references suppliers(id) on delete set null,
  emoji text default '🛍️',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists customers (
  id text primary key,
  name text not null,
  phone text,
  address text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists drivers (
  id text primary key,
  name text not null,
  phone text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists cashier_sessions (
  id text primary key,
  cashier text not null,
  status text not null default 'Open',
  opening_cash numeric default 0,
  actual_cash numeric,
  difference numeric,
  opened_at timestamptz default now(),
  closed_at timestamptz
);

create table if not exists orders (
  id text primary key,
  channel text not null check (channel in ('POS','Online')),
  order_type text,
  customer_name text,
  phone text,
  address text,
  status text not null default 'New',
  subtotal numeric default 0,
  discount numeric default 0,
  tax numeric default 0,
  delivery_fee numeric default 0,
  total numeric default 0,
  payment_method text,
  driver_id text references drivers(id) on delete set null,
  cashier_session_id text references cashier_sessions(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  product_name text not null,
  qty integer not null,
  unit_price numeric not null,
  line_total numeric not null,
  created_at timestamptz default now()
);

create table if not exists stock_movements (
  id text primary key,
  product_id text references products(id) on delete set null,
  type text not null,
  qty integer not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists purchase_orders (
  id text primary key,
  supplier_id text references suppliers(id) on delete set null,
  status text default 'Draft',
  total numeric default 0,
  created_at timestamptz default now()
);

create table if not exists purchase_order_items (
  id text primary key,
  purchase_order_id text references purchase_orders(id) on delete cascade,
  product_id text references products(id) on delete set null,
  qty integer not null,
  unit_cost numeric not null,
  line_total numeric not null
);

alter table stores enable row level security;
alter table suppliers enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table drivers enable row level security;
alter table cashier_sessions enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table stock_movements enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_items enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['stores','suppliers','products','customers','drivers','cashier_sessions','orders','order_items','stock_movements','purchase_orders','purchase_order_items']
  loop
    execute format('drop policy if exists anon_all on %I', t);
    execute format('create policy anon_all on %I for all using (true) with check (true)', t);
  end loop;
end $$;

insert into suppliers (id, name, contact, phone, balance) values
('sup-1','Fresh Distribution','Rami','+961 70 000 111',220),
('sup-2','Daily Goods Co.','Maya','+961 71 000 222',0)
on conflict (id) do nothing;

insert into drivers (id, name, phone, active) values
('d-1','Ali','+961 76 111 222',true),
('d-2','Hassan','+961 78 333 444',true)
on conflict (id) do nothing;

insert into products (id, sku, name, category, price, cost, stock, low_stock, supplier_id, emoji, active) values
('p-1','BAR-1001','Water 1.5L','Beverages',0.75,0.38,84,20,'sup-1','💧',true),
('p-2','BAR-1002','Cola Can','Beverages',1.25,0.62,44,12,'sup-1','🥤',true),
('p-3','SNK-2001','Potato Chips','Snacks',1.10,0.52,29,10,'sup-2','🍟',true),
('p-4','DRY-3001','Milk 1L','Dairy',1.65,0.98,18,8,'sup-1','🥛',true),
('p-5','BAK-4001','Arabic Bread Pack','Bakery',0.90,0.45,34,14,'sup-2','🥖',true),
('p-6','HOM-5001','Dish Soap','Household',2.40,1.35,11,8,'sup-2','🧼',true),
('p-7','FRZ-6001','Frozen Fries','Frozen',3.25,2.05,9,10,'sup-1','❄️',true),
('p-8','PER-7001','Shampoo','Personal Care',4.50,2.65,16,6,'sup-2','🧴',true)
on conflict (id) do nothing;
