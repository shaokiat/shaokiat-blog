-- Toy schema for the SQL Cheatsheet and Practice Questions pages.
-- Run once against any Postgres 15+.
-- Every query on those pages runs against this data.

drop table if exists order_items, orders, products, customers cascade;

create table customers (
  id          bigint primary key generated always as identity,
  name        text not null,
  email       text not null unique,
  country     text not null,
  created_at  timestamptz not null
);

create table products (
  id        bigint primary key generated always as identity,
  name      text not null,
  category  text not null,
  price     numeric(10,2) not null
);

create table orders (
  id           bigint primary key generated always as identity,
  customer_id  bigint not null references customers(id),
  status       text not null check (status in ('pending','paid','refunded')),
  metadata     jsonb not null default '{}',
  created_at   timestamptz not null
);

create table order_items (
  id          bigint primary key generated always as identity,
  order_id    bigint not null references orders(id) on delete cascade,
  product_id  bigint not null references products(id),
  quantity    int not null check (quantity > 0),
  unit_price  numeric(10,2) not null
);

insert into customers (name, email, country, created_at) values
  ('Amara Okafor',  'amara@example.com', 'SG', '2026-08-02'),
  ('Ben Tan',       'ben@example.com',   'SG', '2026-08-11'),
  ('Chen Wei',      'chen@example.com',  'MY', '2026-09-01'),
  ('Divya Rao',     'divya@example.com', 'IN', '2026-09-02'),
  ('Elena Fischer', 'elena@example.com', 'DE', '2026-07-20'),
  ('Farid Hassan',  'farid@example.com', 'MY', '2026-09-03');  -- never orders

insert into products (name, category, price) values
  ('Aeron Chair',    'furniture',   1200.00),
  ('Standing Desk',  'furniture',    800.00),
  ('Desk Lamp',      'furniture',     90.00),
  ('Mech Keyboard',  'electronics',  150.00),
  ('27" Monitor',    'electronics',  400.00),
  ('USB-C Hub',      'electronics',   60.00),
  ('Espresso Beans', 'pantry',        25.00),
  ('Tea Sampler',    'pantry',        18.00);  -- never ordered

insert into orders (customer_id, status, metadata, created_at) values
  (1, 'paid',     '{"source":"mobile"}', '2026-06-05'),
  (1, 'paid',     '{"source":"web"}',    '2026-06-25'),
  (2, 'paid',     '{"source":"mobile"}', '2026-07-03'),
  (3, 'paid',     '{"source":"web"}',    '2026-07-15'),
  (1, 'refunded', '{"source":"web"}',    '2026-08-01'),
  (4, 'paid',     '{"source":"mobile"}', '2026-08-04'),
  (2, 'paid',     '{"source":"web"}',    '2026-08-20'),
  (5, 'paid',     '{"source":"mobile"}', '2026-09-01'),
  (3, 'paid',     '{"source":"mobile"}', '2026-09-02'),
  (4, 'paid',     '{"source":"web"}',    '2026-09-03'),
  (5, 'pending',  '{"source":"web"}',    '2026-09-04');

insert into order_items (order_id, product_id, quantity, unit_price) values
  (1, 1, 1, 1200.00), (1, 3, 2,   90.00),
  (2, 4, 1,  150.00), (2, 6, 2,   60.00),
  (3, 2, 1,  800.00), (3, 5, 1,  400.00),
  (4, 5, 2,  400.00),
  (5, 1, 1, 1200.00),
  (6, 2, 1,  800.00), (6, 3, 1,   90.00),
  (7, 5, 1,  400.00), (7, 4, 1,  150.00),
  (8, 7, 4,   25.00),
  (9, 1, 1, 1200.00), (9, 5, 1,  400.00),
  (10, 2, 2, 800.00), (10, 6, 1,  60.00),
  (11, 8, 2,  18.00);
