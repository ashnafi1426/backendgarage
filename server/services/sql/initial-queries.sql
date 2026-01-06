
CREATE TABLE employee (
  employee_id SERIAL PRIMARY KEY,
  employee_email VARCHAR(255) UNIQUE NOT NULL,
  employee_active_status INTEGER DEFAULT 1,
  employee_added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================================================
   TABLE 2: employee_info
========================================================= */
CREATE TABLE employee_info (
  employee_info_id SERIAL PRIMARY KEY,
  employee_id INTEGER UNIQUE,
  employee_first_name VARCHAR(255),
  employee_last_name VARCHAR(255),
  employee_phone VARCHAR(255),
  CONSTRAINT fk_employee_info_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(employee_id)
    ON DELETE CASCADE
);

/* =========================================================
   TABLE 3: employee_pass
========================================================= */
CREATE TABLE employee_pass (
  employee_pass_id SERIAL PRIMARY KEY,
  employee_id INTEGER UNIQUE,
  employee_password_hashed VARCHAR(255),
  CONSTRAINT fk_employee_pass_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(employee_id)
    ON DELETE CASCADE
);

/* =========================================================
   TABLE 4: company_roles
========================================================= */
CREATE TABLE company_roles (
  company_role_id SERIAL PRIMARY KEY,
  company_role_name VARCHAR(255)
);

INSERT INTO company_roles (company_role_name)
VALUES ('Admin'), ('Manager'), ('Employee');

/* =========================================================
   TABLE 5: employee_role
========================================================= */
CREATE TABLE employee_role (
  employee_role_id SERIAL PRIMARY KEY,
  employee_id INTEGER UNIQUE,
  company_role_id INTEGER,
  CONSTRAINT fk_employee_role_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(employee_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_employee_role_company
    FOREIGN KEY (company_role_id)
    REFERENCES company_roles(company_role_id)
);

/* =========================================================
   TABLE 6: customer_identifier
========================================================= */
CREATE TABLE customer_identifier (
  customer_id SERIAL PRIMARY KEY,
  customer_email VARCHAR(255) UNIQUE,
  customer_phone_number VARCHAR(255) UNIQUE,
  customer_added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_hash VARCHAR(255)
);

/* =========================================================
   TABLE 7: customer_info
========================================================= */
CREATE TABLE customer_info (
  customer_info_id SERIAL PRIMARY KEY,
  customer_id INTEGER UNIQUE,
  customer_first_name VARCHAR(255),
  customer_last_name VARCHAR(255),
  customer_active_status INTEGER DEFAULT 1,
  CONSTRAINT fk_customer_info_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer_identifier(customer_id)
    ON DELETE CASCADE
);

/* =========================================================
   TABLE 8: customer_vehicle_info
========================================================= */
CREATE TABLE customer_vehicle_info (
  vehicle_id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  vehicle_year INTEGER,
  vehicle_make VARCHAR(255),
  vehicle_model VARCHAR(255),
  vehicle_type VARCHAR(255),
  vehicle_mileage INTEGER,
  vehicle_tag VARCHAR(255),
  vehicle_serial_number VARCHAR(255),
  vehicle_color VARCHAR(255),
  CONSTRAINT fk_vehicle_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer_identifier(customer_id)
    ON DELETE CASCADE
);

/* =========================================================
   TABLE 9: common_services
========================================================= */
CREATE TABLE common_services (
  service_id SERIAL PRIMARY KEY,
  service_name VARCHAR(255),
  service_description VARCHAR(255)
);

/* =========================================================
   TABLE 10: orders
========================================================= */
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  employee_id INTEGER,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_hash VARCHAR(255),
  order_status VARCHAR(255),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id)
    REFERENCES customer_identifier(customer_id),
  CONSTRAINT fk_orders_employee
    FOREIGN KEY (employee_id)
    REFERENCES employee(employee_id)
);

/* =========================================================
   TABLE 11: order_info
========================================================= */
CREATE TABLE order_info (
  order_info_id SERIAL PRIMARY KEY,
  order_id INTEGER UNIQUE,
  order_total_price INTEGER,
  order_estimated_completion_date TIMESTAMP,
  order_completion_date TIMESTAMP,
  order_additional_requests VARCHAR(255),
  order_additional_requests_completed INTEGER,
  CONSTRAINT fk_order_info_order
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE
);

/* =========================================================
   TABLE 12: order_services
========================================================= */
CREATE TABLE order_services (
  order_service_id SERIAL PRIMARY KEY,
  order_id INTEGER,
  service_id INTEGER,
  service_completed INTEGER DEFAULT 0,
  CONSTRAINT fk_order_services_order
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order_services_service
    FOREIGN KEY (service_id)
    REFERENCES common_services(service_id)
);

/* =========================================================
   TABLE 13: order_status
========================================================= */
CREATE TABLE order_status (
  order_status_id SERIAL PRIMARY KEY,
  order_id INTEGER UNIQUE,
  order_status INTEGER,
  CONSTRAINT fk_order_status_order
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE
);
