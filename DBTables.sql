-- phpMyAdmin SQL Dump
-- version 4.0.9
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2016 at 02:11 PM
-- Server version: 5.6.14
-- PHP Version: 5.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `audu`
--
CREATE DATABASE IF NOT EXISTS `audu` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `audu`;

-- --------------------------------------------------------

--
-- Table structure for table `tracks`
--

CREATE TABLE IF NOT EXISTS `tracks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `artist` varchar(32) NOT NULL,
  `length` int(11) NOT NULL,
  `genre` varchar(32) NOT NULL,
  `url` varchar(128) NOT NULL,
  `rating` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `tracks`
--

INSERT INTO `tracks` (`id`, `name`, `artist`, `length`, `genre`, `url`, `rating`) VALUES
(1, 'testName', '', 0, 'Rap', 'https://soundcloud.com/madeintyo/uber-everywhere-prod-k-swisha', 0),
(2, 'testName', '', 0, 'Rap', 'https://soundcloud.com/soulection/sam-gellaitry-temple-short-stories-out-february-17th', 0),
(3, 'Test', '', 0, '', 'https://soundcloud.com/kodak-black/skrt', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`) VALUES
(1, 'Bob'),
(2, 'Jerry'),
(3, 'Ron');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
