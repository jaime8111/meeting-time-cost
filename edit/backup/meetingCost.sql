-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 13, 2014 at 01:56 PM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `meetcost`
--
CREATE DATABASE IF NOT EXISTS `meetcost` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `meetcost`;

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE IF NOT EXISTS `meetings` (
  `id` int(9) NOT NULL AUTO_INCREMENT,
  `owner` varchar(22) NOT NULL,
  `meetDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `attenders` int(3) NOT NULL,
  `status` int(1) NOT NULL,
  `averageRate` float DEFAULT NULL,
  `ratePeriod` int(1) NOT NULL,
  `estimatedSeconds` int(6) NOT NULL,
  `meetSeconds` int(6) NOT NULL,
  `favourite` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `owner`, `meetDate`, `attenders`, `status`, `averageRate`, `ratePeriod`, `estimatedSeconds`, `meetSeconds`, `favourite`, `deleted`) VALUES
(5, '1400686582593-4bd1', '2014-05-22 03:28:43', 3, 1, 15000, 3, 25, 0, 0, NULL),
(6, '1400686582593-4bd1', '2014-06-11 17:18:06', 10, 1, 30000, 3, 10, 9, 1, NULL),
(10, '1400686582593-4bd1', '2014-06-11 18:21:01', 2, 1, 10, 1, 60, 4, NULL, NULL),
(11, '1400686582593-4bd1', '2014-06-11 12:23:17', 2, 1, 25, 1, 600, 0, NULL, NULL),
(12, '1402482292976-be5e', '2014-06-11 12:52:28', 5, 1, 25, 1, 600, 5, NULL, NULL),
(13, '1400686582593-4bd1', '2014-06-11 17:20:14', 5, 1, 25, 1, 600, 2, NULL, NULL),
(14, '1400686582593-4bd1', '2014-06-11 12:56:55', 5, 1, 5, 1, 300, 1, NULL, NULL),
(15, '1402497086984-0384', '2014-06-11 16:32:04', 2, 1, 25, 1, 60, 0, NULL, NULL),
(16, '1402497086984-0384', '2014-06-11 16:34:34', 10, 1, 22, 1, 60, 0, NULL, NULL),
(17, '1402497544944-6e2d', '2014-06-11 16:39:25', 10, 1, 25, 1, 60, 0, NULL, NULL),
(18, '1402482292976-be5e', '2014-06-11 17:50:36', 2, 1, 258, 2, 600, 13, NULL, NULL),
(19, '1400686582593-4bd1', '2014-06-11 18:23:50', 2, 1, 25, 1, 480, 0, NULL, NULL),
(20, '1402563346383-4a84', '2014-06-12 10:56:37', 5, 1, 25, 1, 60, 6, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `meetingstatus`
--

CREATE TABLE IF NOT EXISTS `meetingstatus` (
  `id` int(1) NOT NULL,
  `type` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `meetingstatus`
--

INSERT INTO `meetingstatus` (`id`, `type`) VALUES
(1, 'paused'),
(2, 'progress'),
(3, 'finished');

-- --------------------------------------------------------

--
-- Table structure for table `rateperiods`
--

CREATE TABLE IF NOT EXISTS `rateperiods` (
  `id` int(1) NOT NULL,
  `type` varchar(15) NOT NULL,
  `rate` int(5) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rateperiods`
--

INSERT INTO `rateperiods` (`id`, `type`, `rate`) VALUES
(1, 'hourly', 1),
(2, 'monthly', 160),
(3, 'yearly', 1680);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
