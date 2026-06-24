-- Al Hashem Market POS testing data
-- Run after supabase-schema.sql. This resets demo rows.

truncate table
  delivery_orders,
  payments,
  order_items,
  orders,
  cashier_sessions,
  stock_movements,
  products,
  suppliers,
  product_categories,
  customers,
  branches,
  stores
restart identity cascade;

insert into stores (id,name,phone,address,currency) values
('11111111-1111-1111-1111-111111111111','Al Hashem Market','+961 70 123 456','Main Street, Beirut','USD');

insert into branches (id,store_id,name,address,phone) values
('22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','Main Branch','Main Street, Beirut','+961 70 123 456');

insert into product_categories (id,store_id,name,sort_order) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','11111111-1111-1111-1111-111111111111','Dairy',1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','11111111-1111-1111-1111-111111111111','Bakery',2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','11111111-1111-1111-1111-111111111111','Groceries',3),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','11111111-1111-1111-1111-111111111111','Beverages',4),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5','11111111-1111-1111-1111-111111111111','Snacks',5),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6','11111111-1111-1111-1111-111111111111','Household',6);

insert into suppliers (id,store_id,name,phone,email,address,balance) values
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','11111111-1111-1111-1111-111111111111','Fresh Distribution','+961 1 000 111','fresh@example.com','Beirut',0),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','11111111-1111-1111-1111-111111111111','Daily Goods Trading','+961 1 000 222','daily@example.com','Mount Lebanon',125.50),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3','11111111-1111-1111-1111-111111111111','Home Care Supplies','+961 1 000 333','homecare@example.com','Beirut',0);

insert into products (id,store_id,category_id,supplier_id,name,sku,barcode,unit,cost_price,sell_price,stock_qty,low_stock_qty,tax_rate) values
('cccccccc-cccc-cccc-cccc-ccccccccccc1','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','Milk 1L','DAI-001','5281000000011','piece',0.82,1.35,42,10,0),
('cccccccc-cccc-cccc-cccc-ccccccccccc2','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','Fresh Bread','BAK-001','5281000000028','piece',0.40,0.85,31,8,0),
('cccccccc-cccc-cccc-cccc-ccccccccccc3','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','Rice 5kg','GRO-001','5281000000035','bag',5.80,7.50,14,5,0),
('cccccccc-cccc-cccc-cccc-ccccccccccc4','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','Water 6x1.5L','BEV-001','5281000000042','pack',1.40,2.25,64,12,0),
('cccccccc-cccc-cccc-cccc-ccccccccccc5','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','Tuna Can','GRO-002','5281000000059','piece',0.72,1.10,7,10,0),
('cccccccc-cccc-cccc-cccc-ccccccccccc6','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','Potato Chips','SNK-001','5281000000066','piece',0.43,0.90,22,10,0),
('cccccccc-cccc-cccc-cccc-ccccccccccc7','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3','Dish Soap','HOU-001','5281000000073','piece',1.10,1.95,18,6,0),
('cccccccc-cccc-cccc-cccc-ccccccccccc8','11111111-1111-1111-1111-111111111111','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','Cola 330ml','BEV-002','5281000000080','can',0.35,0.75,80,20,0);

insert into customers (id,store_id,name,phone,email,address,notes) values
('dddddddd-dddd-dddd-dddd-dddddddddd01','11111111-1111-1111-1111-111111111111','Walk-in Customer',null,null,null,'Default POS customer'),
('dddddddd-dddd-dddd-dddd-dddddddddd02','11111111-1111-1111-1111-111111111111','Nour Haddad','+961 70 123 456','nour@example.com','Hamra, Beirut','Online delivery customer'),
('dddddddd-dddd-dddd-dddd-dddddddddd03','11111111-1111-1111-1111-111111111111','Karim Mansour','+961 71 987 654','karim@example.com','Achrafieh, Beirut','Pickup customer');

insert into orders (id,store_id,branch_id,customer_id,order_no,source,status,subtotal,discount_total,tax_total,delivery_fee,grand_total,payment_status,notes,created_at) values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','dddddddd-dddd-dddd-dddd-dddddddddd01','POS-TEST-1001','pos','completed',12.05,0,0,0,12.05,'paid','Testing completed POS sale',now() - interval '2 hours'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','dddddddd-dddd-dddd-dddd-dddddddddd02','WEB-TEST-1001','online','accepted',7.70,0,0,1.50,9.20,'unpaid','Testing online delivery order',now() - interval '45 minutes'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','dddddddd-dddd-dddd-dddd-dddddddddd03','WEB-TEST-1002','online','new',4.25,0,0,0,4.25,'unpaid','Testing pickup order',now() - interval '20 minutes');

insert into order_items (order_id,product_id,product_name,qty,unit_price,cost_price,line_total) values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1','cccccccc-cccc-cccc-cccc-ccccccccccc1','Milk 1L',2,1.35,0.82,2.70),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1','cccccccc-cccc-cccc-cccc-ccccccccccc3','Rice 5kg',1,7.50,5.80,7.50),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1','cccccccc-cccc-cccc-cccc-ccccccccccc6','Potato Chips',2,0.90,0.43,1.80),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2','cccccccc-cccc-cccc-cccc-ccccccccccc4','Water 6x1.5L',2,2.25,1.40,4.50),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2','cccccccc-cccc-cccc-cccc-ccccccccccc6','Potato Chips',2,0.90,0.43,1.80),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3','cccccccc-cccc-cccc-cccc-ccccccccccc2','Fresh Bread',5,0.85,0.40,4.25);

insert into payments (order_id,method,amount,reference,paid_at) values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1','cash',12.05,'CASH-TEST-1001',now() - interval '2 hours');

insert into delivery_orders (order_id,driver_name,customer_address,delivery_fee,status,cash_collected,created_at) values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2','Unassigned','Hamra, Beirut',1.50,'pending',9.20,now() - interval '40 minutes');

insert into stock_movements (product_id,movement_type,qty_change,note,created_at) values
('cccccccc-cccc-cccc-cccc-ccccccccccc1','opening',42,'Opening stock',now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-ccccccccccc2','opening',31,'Opening stock',now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-ccccccccccc3','opening',14,'Opening stock',now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-ccccccccccc4','opening',64,'Opening stock',now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-ccccccccccc5','opening',7,'Opening stock low stock test',now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-ccccccccccc6','opening',22,'Opening stock',now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-ccccccccccc7','opening',18,'Opening stock',now() - interval '1 day'),
('cccccccc-cccc-cccc-cccc-ccccccccccc8','opening',80,'Opening stock',now() - interval '1 day');

insert into cashier_sessions (branch_id,cashier_name,opening_cash,expected_cash,actual_cash,difference,status,opened_at) values
('22222222-2222-2222-2222-222222222222','Demo Cashier',100.00,112.05,null,null,'open',now() - interval '3 hours');
