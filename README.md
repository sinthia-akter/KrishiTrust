# KrishiTrust - Trust Between Farmer, Market & Government

**An agricultural marketplace and service platform connecting farmers, buyers and local service providers in Bangladesh.**

> **Course:** Software Project Design and Development Lab
> **Course Code:** CSE0613316
> **Project type:** Group project

---

## Team Members (Group-06)

| Name                    | ID             |
|-------------------------|----------------|
| Samiha Tasnim           | *174 |
| Samina Akter Sinthia    | *202 |
| A.K.M Pervez Mosharraf  | *205 |
| Sumaya Jannat           | *212 |

---

## About the Project

KrishiTrust ("trust in agriculture") lets farmers sell their crops directly to buyers without middlemen, builds trust through a **verification system**, and protects farmers' privacy until a deal is agreed.

Anyone can browse crops and find verified agricultural stores without logging in. Buyers must register to negotiate or buy, and farmers must register (and be verified) to sell.

### Main ideas

- **Public marketplace:** crop listings and the store finder are open to everyone.
- **Verified farmers only:** a self-registered farmer stays *pending* until a UDC agent or admin verifies them.
- **Privacy first:** a farmer's phone number and NID are never shown publicly. The buyer sees the phone only after a negotiation is accepted or an order is placed.
- **Negotiation:** buyers and farmers exchange messages and price offers in a chat room.
- **Bulk (multi-farmer) orders:** a buyer can take **one product from at most 3 farmers** in a single order.
- **Role-based access:** every role has its own portal, and the server enforces who can do what.

---

## Features

### Public (no login)
- Browse live crop listings (farmer name, district, crop, quantity, price)
- Search and filter crops and stores
- Store finder showing verified stores only
- Register with a role dropdown (Farmer, Buyer, Store Owner)

### Farmer
- Publish crop listings (verified farmers only)
- Negotiate with buyers and accept offers
- Confirm, reject and ship orders in Order Tracking
- See bulk orders they are part of (Aggregation)
- Respond to buyer requirements with "I can supply"
- Dashboard with live listings, earnings and pending bids

### Buyer
- Browse crops, negotiate, or buy at the listed price
- Place a single order or a **multi-farmer bulk order (max 3 farmers per product)**
- Post procurement requirements and see which farmers can supply
- Track orders and confirm delivery
- Dashboard with active orders, total purchased and savings

### UDC Agent
- Register farmers in person (a temporary password is generated)
- Verify or reject self-registered farmers
- View applications and monthly service reports

### Admin
- Create staff accounts (UDC, Bank, Government, Store)
- Block and unblock users (takes effect immediately)
- Platform dashboard with alerts, user list and KPIs
- Store registry (verify, flag, reinstate)
- Analytics and system health pages

### Store Owner
- Register a store, which appears in the public Store Finder once verified by an admin

---

## Technology Stack

| Layer         | Technology                                                       |
|---------------|------------------------------------------------------------------|
| Frontend      | HTML, CSS, vanilla JavaScript (pages are built with `innerHTML`) |
| Backend       | PHP 8 (plain PHP, no framework)                                  |
| Database      | MySQL, accessed through PDO                                      |
| Communication | `fetch()` calls returning JSON                                   |
| Local server  | XAMPP (Apache + MySQL)                                           |

---

## How It Works

```
Browser (HTML shell + JS builds the page)
        |  fetch() through the api() helper
        v
PHP files in api/   (check role, validate input, run SQL)
        v
MySQL database
```

Each page has a small HTML file that only loads scripts. A matching JS file builds the page and calls PHP files in the `api/` folder, which read or write MySQL and return JSON.

Most features are split into small PHP files by job (create, read, change), each with its own access rule:

| Feature | Files |
|---------|-------|
| Crops | `crop_create.php`, `crop_mine.php`, `crops_public.php` |
| Negotiations | `neg_open.php`, `neg_get.php`, `neg_send.php` |
| Orders | `order_create.php`, `orders_list.php`, `order_status.php` |
| Bulk orders | `bulk_create.php`, `bulk_list.php`, `agg_mine.php` |
| Requirements | `req_create.php`, `req_mine.php`, `req_close.php`, `req_open.php`, `req_offer.php` |
| Dashboards | `buyer_stats.php`, `farmer_stats.php`, `admin_stats.php` |

---

## User Roles and Login

| Role | Logs in with | How the account is created |
|------|--------------|----------------------------|
| Farmer | Mobile number + password | Self-signup, or registered by a UDC agent |
| Buyer | Mobile number + password | Self-signup |
| Store Owner | Email + password | Self-signup, or created by admin |
| UDC Agent, Bank, Government | Email + password | Created by admin |
| Admin | Email + password | Created manually in the database (see setup) |

Accounts created with a temporary password (UDC-registered farmers and staff made by the admin) are forced to change it on first login.

---

## Project Structure

```
krishitrust/
├── api/                        PHP backend (one small file per job)
│   ├── config.php              session, PDO connection, out(), require_login()
│   ├── login.php, logout.php, me.php
│   ├── farmer_signup.php, buyer_signup.php, store_signup.php
│   ├── farmer_register.php     UDC registers a farmer
│   ├── farmers_list.php, farmer_verify.php
│   ├── crop_*.php, crops_public.php, stores_*.php, store_*.php
│   ├── neg_*.php, order*.php, bulk_*.php, req_*.php
│   ├── *_stats.php, analytics_stats.php, system_health.php
│   ├── user_*.php, users_list.php, password_change.php
│   └── udc_*.php, agg_mine.php
├── database/
│   └── krishitrust.sql         database structure (import this)
├── portal-common.js            page guard, api() helper, page shell
├── theme.js                    light/dark mode
├── style.css                   shared styles
├── index.html + landing.js     home page
├── login.html + login.js
├── register.html + register.js
└── *.html + *.js               one pair per page (dashboards, orders, etc.)
```

---

## Database

Main tables:

| Table | Purpose |
|-------|---------|
| `users` | Every login account and its role |
| `farmers` | Farmer profile, NID and verification status |
| `buyers` | Buyer company details |
| `crops` | Crop listings and remaining stock |
| `negotiations`, `negotiation_messages` | Negotiation rooms and their chat |
| `orders` | Orders (including each farmer's share of a bulk order) |
| `bulk_orders` | Groups the orders of one multi-farmer purchase |
| `requirements`, `requirement_offers` | Buyer requirements and farmer offers |
| `stores` | Store registry shown in the Store Finder |

---

## Installation and Setup (XAMPP)

### 1. Requirements
- XAMPP with **PHP 8+**, Apache and MySQL
- A modern browser

### 2. Copy the project
Place the project folder here:

```
C:\xampp\htdocs\krishitrust\
```

### 3. Start the servers
Open the XAMPP Control Panel and start **Apache** and **MySQL**.

### 4. Create the database
1. Open `http://localhost/phpmyadmin`.
2. Create a database named `krishitrust` (collation `utf8mb4_unicode_ci`).
3. Click **Import** and choose `database/krishitrust.sql`.

### 5. Check the connection
`api/config.php` uses the XAMPP defaults:

```php
host: localhost   database: krishitrust   user: root   password: (empty)
```

Change these if your MySQL setup is different.

### 6. Create the first admin account
Admin accounts cannot be created through the website. Generate a password hash:

```
php -r "echo password_hash('YourStrongPassword123', PASSWORD_DEFAULT);"
```

Then run this in phpMyAdmin, replacing the hash:

```sql
INSERT INTO users (name, email, password, role, status)
VALUES ('Admin', 'admin@krishitrust.com', 'PASTE_HASH_HERE', 'admin', 'active');
```

### 7. Open the site

```
http://localhost/krishitrust/index.html
```

Always open the site through `http://localhost/`, not by double-clicking the HTML files, because PHP only runs through Apache.

---

## Try It Out (suggested flow)

1. Open the home page and browse crops and stores without logging in.
2. Register a **farmer** with the role dropdown. The farmer cannot sell yet.
3. Log in as **admin**, open Farmer Verification and verify the farmer.
4. Log in as the farmer and publish a crop.
5. Register a **buyer**, open Browse Crops, click **Negotiate** and make an offer.
6. As the farmer, accept the offer. The buyer can now see the phone number and place an order.
7. Try a **bulk order** with three farmers, and notice a fourth is blocked.
8. The farmer confirms and ships. The buyer confirms delivery.
9. Check the admin dashboard for live numbers, and block a user.

Use a different browser for each role. Sessions are shared inside one browser.

---

## Security Measures

| Concern | How it is handled |
|---------|-------------------|
| Passwords | Stored with `password_hash()` and checked with `password_verify()` |
| SQL injection | Every query uses PDO prepared statements |
| XSS | Saved text is escaped before it is placed in the page |
| Access control | `require_login(['role'])` at the top of each API file. The page guard only hides pages, the server is the real protection |
| Blocked users | Status is checked on every request, so a block takes effect immediately |
| Price tampering | The browser sends only ids and quantities. Prices are read from the database |
| Overselling | Orders run in a transaction with `SELECT ... FOR UPDATE` on the crop row |
| Half-saved data | Multi-step saves use transactions and roll back on failure |
| Private data | Phone numbers and NIDs are never in public APIs. NIDs are masked in lists |
| Temporary passwords | Users must change them before anything else works |

---

## Project Status

### Fully connected to the database
Accounts and login, registration, farmer verification, crop listings, public Browse Crops and Store Finder, negotiations, orders and order tracking, multi-farmer bulk orders, buyer requirements, dashboards (buyer, farmer, admin), user management, store registry, analytics, system health and UDC pages.

### Designed but still using demo data (planned for the next phase)
Agricultural loans, disaster relief, and the bank and government portals:
`agri-loan`, `loan-applications`, `loan-oversight`, `portfolio`, `bank`, `disaster-relief`, `disaster-management`, `government`, `issue-notice`, `district-reports`, `subsidy-allocation`, `store-inspection`.

The Bengali voice guide (`bangla.js`) is not connected to the database.

---

## Known Limitations

- Payments are not implemented. Orders record the agreed price only.
- Distance to stores is not calculated (it needs GPS).
- Chat updates by refreshing every few seconds, not real-time sockets.
- The project is built for local use with XAMPP. Before a real deployment: use HTTPS, a dedicated database user instead of `root`, and turn off PHP error display.

---

## Future Work

- Agricultural loan flow (farmer applies, bank reviews, government oversees)
- Disaster relief reporting and review
- Online payment integration
- SMS or in-app notifications
- Real-time chat

---

## Acknowledgements

Developed as a group project for **CSE0613316 — Software Project Design and Development Lab**.
