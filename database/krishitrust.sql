-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2026 at 08:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `krishitrust`
--

-- --------------------------------------------------------

--
-- Table structure for table `bulk_orders`
--

CREATE TABLE `bulk_orders` (
  `id` int(11) NOT NULL,
  `bulk_code` varchar(30) DEFAULT NULL,
  `buyer_id` int(11) NOT NULL,
  `crop_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bulk_orders`
--

INSERT INTO `bulk_orders` (`id`, `bulk_code`, `buyer_id`, `crop_name`, `created_at`) VALUES
(1, 'KT-BULK-2026-0001', 13, 'Potato', '2026-11-06 09:38:51'),
(2, 'KT-BULK-2026-0002', 13, 'Potato', '2026-11-07 10:38:07');

-- --------------------------------------------------------

--
-- Table structure for table `buyers`
--

CREATE TABLE `buyers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `contact_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `district` varchar(50) NOT NULL,
  `business_type` enum('Retail Buyer','Processing Company','Food Company','Exporter') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buyers`
--

INSERT INTO `buyers` (`id`, `user_id`, `company_name`, `contact_name`, `phone`, `email`, `district`, `business_type`, `created_at`) VALUES
(1, 6, 'globport', 'nothing', '01822222222', 'example@gmail.com', 'Dhaka', 'Food Company', '2026-11-04 18:54:12'),
(2, 13, 'food', 'farid', '01812341234', 'farid@krishitrust.com', 'Dhaka', 'Food Company', '2026-11-06 09:20:15');

-- --------------------------------------------------------

--
-- Table structure for table `crops`
--

CREATE TABLE `crops` (
  `id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `crop_name` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(20) NOT NULL DEFAULT 'Bags',
  `price` decimal(10,2) NOT NULL,
  `quality` varchar(20) NOT NULL,
  `harvest_date` date DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('live','sold','removed') DEFAULT 'live',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `crops`
--

INSERT INTO `crops` (`id`, `farmer_id`, `crop_name`, `quantity`, `unit`, `price`, `quality`, `harvest_date`, `location`, `notes`, `status`, `created_at`) VALUES
(1, 2, 'Lentils', 200.00, 'Bags', 3000.00, 'Grade A', '2026-09-10', 'Barishal', 'nothing just testing', 'live', '2026-11-05 07:22:40'),
(2, 3, 'Aman Rice', 50.00, 'Bags', 1200.00, 'Grade A', '2026-11-02', 'Barishal', '', 'live', '2026-11-05 08:21:59'),
(3, 7, 'Potato', 23.00, 'Bags', 1000.00, 'Grade A', '2026-11-04', 'Barishal', 'The potato is a starchy tuberous vegetable, native to the Andes, widely cultivated worldwide for its nutritional value and versatility.', 'live', '2026-11-06 09:33:06'),
(4, 7, 'Aman Rice', 150.00, 'Bags', 1200.00, 'Grade B', '2026-11-01', 'Barishal', '', 'live', '2026-11-06 09:33:33'),
(5, 8, 'Potato', 0.00, 'Bags', 120.00, 'Grade A', '2026-11-04', 'Slyhet', '', 'sold', '2026-11-06 09:34:26'),
(6, 9, 'Potato', 7.00, 'Bags', 129.00, 'Grade A', '2026-11-03', 'Chattagram', '', 'live', '2026-11-06 09:35:10'),
(7, 8, 'Wheat', 11.00, 'Bags', 1000.00, 'Grade A', '2026-11-01', 'Mymensingh', 'nothing to add', 'live', '2026-11-11 04:46:43'),
(8, 8, 'Jute', 120.00, 'Bags', 1390.00, 'Grade B', '2026-11-04', 'Chittagong', '', 'live', '2026-11-11 04:47:30'),
(9, 8, 'Potato', 50.00, 'Bags', 1000.00, 'Grade B', '2026-11-12', 'Mymensingh', '', 'live', '2026-11-11 06:21:01');

-- --------------------------------------------------------

--
-- Table structure for table `damage_reports`
--

CREATE TABLE `damage_reports` (
  `id` int(11) NOT NULL,
  `report_code` varchar(30) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `farmer_id` int(11) NOT NULL,
  `disaster_type` varchar(50) NOT NULL,
  `crop_name` varchar(50) NOT NULL,
  `affected_area` varchar(50) NOT NULL,
  `estimated_loss` decimal(12,2) NOT NULL DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `relief_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','verified','rejected','paid') NOT NULL DEFAULT 'pending',
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disaster_events`
--

CREATE TABLE `disaster_events` (
  `id` int(11) NOT NULL,
  `title` varchar(120) NOT NULL,
  `disaster_type` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `relief_fund` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` enum('active','closed') NOT NULL DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `farmers`
--

CREATE TABLE `farmers` (
  `id` int(11) NOT NULL,
  `farmer_code` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `nid` varchar(20) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `district` varchar(50) NOT NULL,
  `land_bigha` decimal(8,2) DEFAULT 0.00,
  `primary_crop` varchar(50) DEFAULT NULL,
  `union_name` varchar(100) DEFAULT NULL,
  `status` enum('pending','verified','rejected') DEFAULT 'pending',
  `registered_by` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `farmers`
--

INSERT INTO `farmers` (`id`, `farmer_code`, `full_name`, `nid`, `phone`, `district`, `land_bigha`, `primary_crop`, `union_name`, `status`, `registered_by`, `user_id`, `created_at`) VALUES
(1, 'KT-FRM-00001', 'nafi', '1234567890', '01555555555', 'Sylhet', 5.00, 'Aman Rice', 'nothing', 'verified', 1, NULL, '2026-11-04 13:47:39'),
(2, 'KT-FRM-00002', 'rafiq', NULL, '01322222222', 'Sylhet', 6.00, 'Aman Rice', NULL, 'verified', NULL, 5, '2026-11-04 17:11:16'),
(3, 'KT-FRM-00003', 'farial', '1111111111', '01912345678', 'Chattogram', 79.00, 'Potato', NULL, 'verified', NULL, 7, '2026-11-05 08:10:09'),
(6, 'KT-FRM-00006', 'UDC Test Farmer', '9876543210', '01655555555', 'Sylhet', 2.30, 'Aman Rice', 'any', 'verified', 8, 9, '2026-11-05 08:46:35'),
(7, 'KT-FRM-00007', 'sean', '1234567892', '01512341234', 'Dhaka', 2.00, 'Aman Rice', NULL, 'verified', NULL, 10, '2026-11-06 09:17:37'),
(8, 'KT-FRM-00008', 'jean', '1234567893', '01612341234', 'Dhaka', 6.00, 'Aman Rice', NULL, 'verified', NULL, 11, '2026-11-06 09:18:21'),
(9, 'KT-FRM-00009', 'minato', '1234567894', '01712341234', 'Dhaka', 8.00, 'Aman Rice', NULL, 'verified', NULL, 12, '2026-11-06 09:19:07'),
(10, 'KT-FRM-00010', 'Masud Hossain', '2435454567', '01912341234', 'Rangpur', 0.09, 'Mustard', NULL, 'verified', NULL, 14, '2026-11-06 17:47:38'),
(11, 'KT-FRM-00011', 'aman', NULL, '01765408377', 'Sylhet', 0.00, 'Potato', NULL, 'pending', NULL, 17, '2026-11-11 05:55:01');

-- --------------------------------------------------------

--
-- Table structure for table `negotiations`
--

CREATE TABLE `negotiations` (
  `id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `current_offer` decimal(10,2) NOT NULL,
  `offered_by` enum('buyer','farmer') NOT NULL DEFAULT 'farmer',
  `status` enum('open','accepted','cancelled') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `negotiations`
--

INSERT INTO `negotiations` (`id`, `crop_id`, `buyer_id`, `farmer_id`, `current_offer`, `offered_by`, `status`, `created_at`) VALUES
(1, 2, 6, 3, 1150.00, 'farmer', 'accepted', '2026-11-05 09:07:14'),
(2, 6, 13, 9, 110.00, 'buyer', 'accepted', '2026-11-06 09:35:39'),
(3, 5, 13, 8, 110.00, 'buyer', 'accepted', '2026-11-06 09:35:59'),
(4, 3, 13, 7, 110.00, 'buyer', 'accepted', '2026-11-06 09:36:11'),
(10, 8, 13, 8, 1000.00, 'farmer', 'accepted', '2026-11-11 05:21:15');

-- --------------------------------------------------------

--
-- Table structure for table `negotiation_messages`
--

CREATE TABLE `negotiation_messages` (
  `id` int(11) NOT NULL,
  `negotiation_id` int(11) NOT NULL,
  `sender_role` enum('buyer','farmer') NOT NULL,
  `kind` enum('text','offer','accept') NOT NULL,
  `body` varchar(500) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `negotiation_messages`
--

INSERT INTO `negotiation_messages` (`id`, `negotiation_id`, `sender_role`, `kind`, `body`, `amount`, `created_at`) VALUES
(1, 1, 'farmer', 'offer', 'Listed price', 1200.00, '2026-11-05 09:07:14'),
(2, 1, 'buyer', 'offer', NULL, 120.00, '2026-11-05 09:07:21'),
(3, 1, 'buyer', 'text', 'hello', NULL, '2026-11-05 09:07:31'),
(4, 1, 'buyer', 'offer', NULL, 1100.00, '2026-11-05 09:13:57'),
(5, 1, 'farmer', 'offer', NULL, 1150.00, '2026-11-05 09:22:48'),
(6, 1, 'buyer', 'accept', NULL, 1150.00, '2026-11-05 09:23:00'),
(7, 2, 'farmer', 'offer', 'Listed price', 129.00, '2026-11-06 09:35:39'),
(8, 2, 'buyer', 'offer', NULL, 110.00, '2026-11-06 09:35:50'),
(9, 3, 'farmer', 'offer', 'Listed price', 120.00, '2026-11-06 09:35:59'),
(10, 3, 'buyer', 'offer', NULL, 110.00, '2026-11-06 09:36:05'),
(11, 4, 'farmer', 'offer', 'Listed price', 1000.00, '2026-11-06 09:36:11'),
(12, 4, 'buyer', 'offer', NULL, 110.00, '2026-11-06 09:36:18'),
(13, 4, 'farmer', 'accept', NULL, 110.00, '2026-11-06 09:37:03'),
(14, 3, 'farmer', 'accept', NULL, 110.00, '2026-11-06 09:37:28'),
(15, 2, 'farmer', 'accept', NULL, 110.00, '2026-11-06 09:37:49'),
(16, 10, 'farmer', 'offer', 'Listed price', 1390.00, '2026-11-11 05:21:15'),
(17, 10, 'buyer', 'text', 'hello', NULL, '2026-11-11 05:22:31'),
(18, 10, 'farmer', 'text', 'hi', NULL, '2026-11-11 05:24:30'),
(19, 10, 'buyer', 'offer', NULL, 900.00, '2026-11-11 05:24:50'),
(20, 10, 'farmer', 'offer', NULL, 1000.00, '2026-11-11 05:25:19'),
(21, 10, 'buyer', 'accept', NULL, 1000.00, '2026-11-11 05:25:29');

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` int(11) NOT NULL,
  `notice_type` varchar(50) NOT NULL,
  `target_district` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `issued_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_code` varchar(30) DEFAULT NULL,
  `buyer_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `crop_id` int(11) NOT NULL,
  `negotiation_id` int(11) DEFAULT NULL,
  `crop_name` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `status` enum('placed','confirmed','in_transit','delivered','cancelled') DEFAULT 'placed',
  `expected_delivery` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `bulk_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `buyer_id`, `farmer_id`, `crop_id`, `negotiation_id`, `crop_name`, `quantity`, `unit`, `unit_price`, `total`, `status`, `expected_delivery`, `created_at`, `bulk_id`) VALUES
(1, 'KT-ORD-2026-0001', 6, 3, 2, 1, 'Aman Rice', 100.00, 'Bags', 1150.00, 115000.00, 'delivered', '2026-11-12', '2026-11-05 11:29:34', NULL),
(2, 'KT-ORD-2026-0002', 13, 8, 5, NULL, 'Potato', 10.00, 'Bags', 120.00, 1200.00, 'cancelled', NULL, '2026-11-06 09:38:51', 1),
(3, 'KT-ORD-2026-0003', 13, 9, 6, NULL, 'Potato', 7.00, 'Bags', 129.00, 903.00, 'cancelled', NULL, '2026-11-06 09:38:51', 1),
(4, 'KT-ORD-2026-0004', 13, 8, 5, 3, 'Potato', 4.00, 'Bags', 110.00, 440.00, 'cancelled', NULL, '2026-11-06 10:07:38', NULL),
(6, 'KT-ORD-2026-0006', 13, 8, 5, NULL, 'Potato', 80.00, 'Bags', 120.00, 9600.00, 'delivered', '2026-11-14', '2026-11-07 10:38:07', 2),
(7, 'KT-ORD-2026-0007', 13, 9, 6, NULL, 'Potato', 6.00, 'Bags', 129.00, 774.00, 'cancelled', NULL, '2026-11-07 10:38:07', 2),
(8, 'KT-ORD-2026-0008', 13, 8, 8, 10, 'Jute', 30.00, 'Bags', 1000.00, 30000.00, 'delivered', '2026-11-18', '2026-11-11 05:26:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `requirements`
--

CREATE TABLE `requirements` (
  `id` int(11) NOT NULL,
  `req_code` varchar(30) DEFAULT NULL,
  `buyer_id` int(11) NOT NULL,
  `crop_name` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `budget` decimal(12,2) NOT NULL,
  `deadline` date NOT NULL,
  `quality` varchar(20) NOT NULL,
  `region` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('open','closed') DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `requirements`
--

INSERT INTO `requirements` (`id`, `req_code`, `buyer_id`, `crop_name`, `quantity`, `unit`, `budget`, `deadline`, `quality`, `region`, `notes`, `status`, `created_at`) VALUES
(1, 'KT-REQ-2026-0001', 13, 'Wheat', 30.00, 'Bags', 112334.00, '2026-11-27', 'Grade C', 'Any District', 'lllllllllllllll', 'closed', '2026-11-07 08:22:04'),
(2, 'KT-REQ-2026-0002', 13, 'Aman Rice', 11.00, 'Bags', 11000000.00, '2026-11-28', 'Grade B', 'Rajshahi', '', 'open', '2026-11-11 05:29:24');

-- --------------------------------------------------------

--
-- Table structure for table `requirement_offers`
--

CREATE TABLE `requirement_offers` (
  `id` int(11) NOT NULL,
  `requirement_id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `requirement_offers`
--

INSERT INTO `requirement_offers` (`id`, `requirement_id`, `farmer_id`, `created_at`) VALUES
(1, 1, 8, '2026-11-07 08:24:35'),
(2, 2, 8, '2026-11-11 05:29:54');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `district` varchar(50) NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `products` varchar(150) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `status` enum('pending','verified','suspended') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `owner_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `district`, `area`, `products`, `rating`, `status`, `created_at`, `owner_id`) VALUES
(1, 'Green Agro Store', 'Sylhet', 'Amberkhana', 'Fertilizer & Seeds', 4.9, 'verified', '2026-11-05 07:40:06', NULL),
(2, 'Sylhet Farmers Mart', 'Sylhet', 'Zindabazar', 'Seeds & Pesticides', 4.8, 'verified', '2026-11-05 07:40:06', NULL),
(3, 'Bangladesh Agro Centre', 'Sylhet', 'Mirabazar', 'Agricultural Inputs', 4.7, 'verified', '2026-11-05 07:40:06', NULL),
(4, 'Rangpur Farm Inputs', 'Rangpur', 'Station Road', 'Seeds & Fertilizers', NULL, 'verified', '2026-11-07 08:43:43', NULL),
(5, 'Glob Port Agro', 'Sylhet', 'Amberkhana', 'Seeds & Fertilizers', NULL, 'verified', '2026-11-07 08:47:04', 15),
(6, 'Local Agro Shop', 'Sylhet', 'Mina Bazar', 'Agricultural Inputs', NULL, 'suspended', '2026-11-07 08:52:09', 16);

-- --------------------------------------------------------

--
-- Table structure for table `subsidy_schemes`
--

CREATE TABLE `subsidy_schemes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `allocated` decimal(14,2) NOT NULL DEFAULT 0.00,
  `disbursed` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` enum('active','closed') NOT NULL DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('farmer','buyer','admin','udc','store') NOT NULL,
  `status` enum('pending','active','blocked') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `must_change_password` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `status`, `created_at`, `must_change_password`) VALUES
(1, 'Admin', 'admin@krishitrust.com', NULL, '$2y$10$8h8BLfjpdWhH0rx5gD4kN.H5lGQC8fNJF3GJYZtvSSJcvhBOAPrJu', 'admin', 'active', '2026-11-04 12:46:16', 0),
(5, 'rafiq', NULL, '01322222222', '$2y$10$KuVbbK5bPZ4Kt3hk/26FQeUuN1Ga0aEN1Nh1wHqX7XjNRBq.R09si', 'farmer', 'active', '2026-11-04 17:11:16', 0),
(6, 'nothing', NULL, '01822222222', '$2y$10$YAg0aTfSuU/wWrTAv1MLYO2jW7giNqi94KYjQ/tK7S8gC96JJHzHi', 'buyer', 'active', '2026-11-04 18:54:12', 0),
(7, 'farial', NULL, '01912345678', '$2y$10$ox64sspv4eZC0SIAQdq5keN2Tf0uq9Fr.G6bA.nAhaJPm9xAxUXo6', 'farmer', 'active', '2026-11-05 08:10:08', 0),
(8, 'UDC Agent', 'udc@krishitrust.com', NULL, '$2y$10$0FIEGNYoY45QFNBXmTx6POw/cJyjniH5jxcqkLekqBjPxCsOB/YeO', 'udc', 'active', '2026-11-05 08:34:20', 0),
(9, 'UDC Test Farmer', NULL, '01655555555', '$2y$10$i5MbsmTdJrb.pp9eCRuUXeVOSGivypdx0jYmHBK4NSuiI6sHARjmi', 'farmer', 'active', '2026-11-05 08:46:35', 1),
(10, 'sean', NULL, '01512341234', '$2y$10$FH40bs5RbibDOmoD7L9fme64Rv4.akRA3HsQfx1ZyRs3hf/IODv4.', 'farmer', 'active', '2026-11-06 09:17:37', 0),
(11, 'jean', NULL, '01612341234', '$2y$10$3gdWsd9OD.WeVHYIGv.dm.yLNKBZ9H95WZ35OSv4mhaO6Zgl.ul0q', 'farmer', 'active', '2026-11-06 09:18:21', 0),
(12, 'minato', NULL, '01712341234', '$2y$10$jfbzCGUsY6Mm9Q/gQGWkeu1UdPmcbF1ZDVTNA9q2.2PyIAxY4ov42', 'farmer', 'active', '2026-11-06 09:19:07', 0),
(13, 'farid', NULL, '01812341234', '$2y$10$Bhil86FrPYK.HLcqeASUxuhMwVBWYbFWCjclL1r4Z2CKcxB/7LPJ.', 'buyer', 'active', '2026-11-06 09:20:15', 0),
(14, 'Masud Hossain', NULL, '01912341234', '$2y$10$S3USOOpTXL7P5FW9MEoeRuPnFt6rWJfrAdxUCoxWEUb6zPZsIjs.O', 'farmer', 'active', '2026-11-06 17:47:38', 0),
(15, 'Test Store', 'store1@krishitrust.com', NULL, '$2y$10$PDdoHYPxnoCr.MIDPa9P5eSK8rMLVI3gbv0.9yKJjT7MLwiiAS3xC', 'store', 'active', '2026-11-07 08:04:23', 1),
(16, 'Hasib Ali', 'store2@krishitrust.com', NULL, '$2y$10$aZba6VEXKliini3vzpn4xOB.LSgBbJaI0kznWTieMbNHsb0o6rypm', 'store', 'active', '2026-11-07 08:52:09', 0),
(17, 'aman', NULL, '01765408377', '$2y$10$wzsQk1l6GqhHUm/sdvvpguAjVe44SOxjPK0VK69l3..LjI2ARzXrq', 'farmer', 'active', '2026-11-11 05:55:01', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bulk_orders`
--
ALTER TABLE `bulk_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `buyers`
--
ALTER TABLE `buyers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `crops`
--
ALTER TABLE `crops`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `damage_reports`
--
ALTER TABLE `damage_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `disaster_events`
--
ALTER TABLE `disaster_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `district` (`district`),
  ADD KEY `disaster_type` (`disaster_type`);

--
-- Indexes for table `farmers`
--
ALTER TABLE `farmers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nid` (`nid`),
  ADD UNIQUE KEY `farmer_code` (`farmer_code`);

--
-- Indexes for table `negotiations`
--
ALTER TABLE `negotiations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `crop_id` (`crop_id`,`buyer_id`);

--
-- Indexes for table `negotiation_messages`
--
ALTER TABLE `negotiation_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negotiation_id` (`negotiation_id`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `target_district` (`target_district`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `negotiation_id` (`negotiation_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `bulk_id` (`bulk_id`);

--
-- Indexes for table `requirements`
--
ALTER TABLE `requirements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `requirement_offers`
--
ALTER TABLE `requirement_offers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `requirement_id` (`requirement_id`,`farmer_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `subsidy_schemes`
--
ALTER TABLE `subsidy_schemes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bulk_orders`
--
ALTER TABLE `bulk_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `buyers`
--
ALTER TABLE `buyers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `crops`
--
ALTER TABLE `crops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `damage_reports`
--
ALTER TABLE `damage_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disaster_events`
--
ALTER TABLE `disaster_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `farmers`
--
ALTER TABLE `farmers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `negotiations`
--
ALTER TABLE `negotiations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `negotiation_messages`
--
ALTER TABLE `negotiation_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `requirements`
--
ALTER TABLE `requirements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `requirement_offers`
--
ALTER TABLE `requirement_offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subsidy_schemes`
--
ALTER TABLE `subsidy_schemes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
