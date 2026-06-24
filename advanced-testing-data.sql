-- Advanced demo data for Al Hashem Market POS
-- Run after supabase-schema.sql, testing-data.sql, and supabase-advanced-upgrade.sql.

insert into app_users (store_id,full_name,email,role) values
('11111111-1111-1111-1111-111111111111','Admin User','admin@alhashem.test','admin'),
('11111111-1111-1111-1111-111111111111','Manager User','manager@alhashem.test','manager'),
('11111111-1111-1111-1111-111111111111','Cashier User','cashier@alhashem.test','cashier'),
('11111111-1111-1111-1111-111111111111','Stock Controller','stock@alhashem.test','stock_controller'),
('11111111-1111-1111-1111-111111111111','Driver User','driver@alhashem.test','driver')
on conflict do nothing;

insert into delivery_zones (store_id,name,delivery_fee,minimum_order) values
('11111111-1111-1111-1111-111111111111','Nearby Zone',1.50,5.00),
('11111111-1111-1111-1111-111111111111','City Zone',2.50,10.00),
('11111111-1111-1111-1111-111111111111','Far Zone',4.00,20.00)
on conflict do nothing;

insert into purchase_orders (id,store_id,supplier_id,po_no,status,subtotal,notes,created_at) values
('99999999-9999-9999-9999-999999999901','11111111-1111-1111-1111-111111111111','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1','PO-TEST-1001','ordered',28.00,'Demo purchase order for beverages',now() - interval '1 day'),
('99999999-9999-9999-9999-999999999902','11111111-1111-1111-1111-111111111111','bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2','PO-TEST-1002','received',58.00,'Demo received grocery purchase',now() - interval '2 days')
on conflict do nothing;

insert into purchase_order_items (purchase_order_id,product_id,product_name,qty_ordered,qty_received,unit_cost,line_total) values
('99999999-9999-9999-9999-999999999901','cccccccc-cccc-cccc-cccc-ccccccccccc4','Water 6x1.5L',20,0,1.40,28.00),
('99999999-9999-9999-9999-999999999902','cccccccc-cccc-cccc-cccc-ccccccccccc3','Rice 5kg',10,10,5.80,58.00)
on conflict do nothing;

insert into refunds (order_id,amount,reason,restock,created_at) values
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',1.80,'Returned potato chips',true,now() - interval '30 minutes')
on conflict do nothing;
