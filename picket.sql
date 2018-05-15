/*
 Navicat Premium Data Transfer

 Source Server         : mysql-local
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : picket

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 05/15/2018 21:32:33 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `activity`
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `activity_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(255) NOT NULL,
  `activity_type` varchar(255) NOT NULL,
  `begin_date` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  `end_date` datetime NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `venue_code` varchar(255) NOT NULL,
  PRIMARY KEY (`activity_id`),
  KEY `FK3gi2uwd7x5tvb4ypceaw3k4u8` (`venue_code`),
  CONSTRAINT `FK3gi2uwd7x5tvb4ypceaw3k4u8` FOREIGN KEY (`venue_code`) REFERENCES `venue` (`venue_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `activity_order`
-- ----------------------------
DROP TABLE IF EXISTS `activity_order`;
CREATE TABLE `activity_order` (
  `order_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `begin_date` datetime NOT NULL,
  `is_payed` bit(1) DEFAULT NULL,
  `order_state` varchar(255) NOT NULL,
  `order_type` varchar(255) NOT NULL,
  `order_value` double NOT NULL,
  `pay_account_id` varchar(255) DEFAULT NULL,
  `place_date` datetime NOT NULL,
  `seat_num` int(11) NOT NULL,
  `unit_price` double DEFAULT NULL,
  `activity_id` bigint(20) NOT NULL,
  `member_email` varchar(255) NOT NULL,
  `venue_code` varchar(255) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FKkxfgoe3vyhgvi0h0ed679wtu3` (`activity_id`),
  KEY `FKhoaus94ycmcx81u6c28w3lua0` (`member_email`),
  KEY `FK2fllxaj7fdm15at8vruqdicd` (`venue_code`),
  CONSTRAINT `FK2fllxaj7fdm15at8vruqdicd` FOREIGN KEY (`venue_code`) REFERENCES `venue` (`venue_code`),
  CONSTRAINT `FKhoaus94ycmcx81u6c28w3lua0` FOREIGN KEY (`member_email`) REFERENCES `member` (`email`),
  CONSTRAINT `FKkxfgoe3vyhgvi0h0ed679wtu3` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `comment`
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) NOT NULL,
  `comment_date` datetime NOT NULL,
  `username` varchar(255) NOT NULL,
  `activity_id` bigint(20) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `FKp8drp02sj1opbtgvgub8ijlbh` (`activity_id`),
  CONSTRAINT `FKp8drp02sj1opbtgvgub8ijlbh` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `manger`
-- ----------------------------
DROP TABLE IF EXISTS `manger`;
CREATE TABLE `manger` (
  `manager_id` varchar(255) NOT NULL,
  `money` double NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `member`
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `email` varchar(255) NOT NULL,
  `level` int(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `point` int(11) DEFAULT NULL,
  `sign_date` datetime DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `valid` varchar(255) DEFAULT NULL,
  `validate_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `payment_account`
-- ----------------------------
DROP TABLE IF EXISTS `payment_account`;
CREATE TABLE `payment_account` (
  `account_id` varchar(255) NOT NULL,
  `money` double NOT NULL,
  `password` varchar(255) NOT NULL,
  `pay_method` varchar(255) NOT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `seat_price`
-- ----------------------------
DROP TABLE IF EXISTS `seat_price`;
CREATE TABLE `seat_price` (
  `seat_price_id` varchar(255) NOT NULL,
  `area_code` int(11) NOT NULL,
  `area_name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `seat_column` int(11) NOT NULL,
  `seat_id` varchar(255) NOT NULL,
  `seat_row` int(11) NOT NULL,
  `sold` bit(1) DEFAULT NULL,
  `venue_code` varchar(255) NOT NULL,
  `activity_id` bigint(20) NOT NULL,
  `activity_order_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`seat_price_id`),
  KEY `FK8x08yitieppwvehdeiupdabpy` (`activity_id`),
  KEY `FKbuu1xau4dfkblk9pfyp32ssay` (`activity_order_id`),
  CONSTRAINT `FK8x08yitieppwvehdeiupdabpy` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`activity_id`),
  CONSTRAINT `FKbuu1xau4dfkblk9pfyp32ssay` FOREIGN KEY (`activity_order_id`) REFERENCES `activity_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ticket`
-- ----------------------------
DROP TABLE IF EXISTS `ticket`;
CREATE TABLE `ticket` (
  `ticket_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(255) NOT NULL,
  `area_name` varchar(255) NOT NULL,
  `begin_time` datetime NOT NULL,
  `is_used` bit(1) DEFAULT NULL,
  `seat_column` int(11) NOT NULL,
  `seat_id` varchar(255) NOT NULL,
  `seat_row` int(11) NOT NULL,
  `venue_code` varchar(255) NOT NULL,
  `venue_name` varchar(255) NOT NULL,
  `activity_order_id` bigint(20) NOT NULL,
  `member_email` varchar(255) NOT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `FKr0od6f164x9t6qqvh5u0vnxps` (`member_email`),
  KEY `FK8xtvd9rh9ppo6ux0pcxhv0vg6` (`activity_order_id`),
  CONSTRAINT `FK8xtvd9rh9ppo6ux0pcxhv0vg6` FOREIGN KEY (`activity_order_id`) REFERENCES `activity_order` (`order_id`),
  CONSTRAINT `FKawrsi275fq5i4mrp4kpp4ywwf` FOREIGN KEY (`activity_order_id`) REFERENCES `activity_order` (`order_id`),
  CONSTRAINT `FKr0od6f164x9t6qqvh5u0vnxps` FOREIGN KEY (`member_email`) REFERENCES `member` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `venue`
-- ----------------------------
DROP TABLE IF EXISTS `venue`;
CREATE TABLE `venue` (
  `venue_code` varchar(255) NOT NULL,
  `area_graph_url` varchar(255) NOT NULL,
  `detail` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `in_check` bit(1) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `money` double DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `pay_money` double NOT NULL,
  `seat_graph_url` varchar(255) NOT NULL,
  `sign_date` datetime NOT NULL,
  `tick_sales` double NOT NULL,
  `un_pay_date` datetime DEFAULT NULL,
  `venue_name` varchar(255) NOT NULL,
  PRIMARY KEY (`venue_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `venue_check`
-- ----------------------------
DROP TABLE IF EXISTS `venue_check`;
CREATE TABLE `venue_check` (
  `venue_code` varchar(255) NOT NULL,
  `area_graph_url` varchar(255) NOT NULL,
  `check_time` datetime NOT NULL,
  `check_type` varchar(255) NOT NULL,
  `detail` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `in_check` bit(1) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `seat_graph_url` varchar(255) NOT NULL,
  `venue_name` varchar(255) NOT NULL,
  PRIMARY KEY (`venue_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `venue_message`
-- ----------------------------
DROP TABLE IF EXISTS `venue_message`;
CREATE TABLE `venue_message` (
  `venue_message_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `body` varchar(255) NOT NULL,
  `need_display` bit(1) DEFAULT NULL,
  `titile` varchar(255) NOT NULL,
  `venue_code` varchar(255) NOT NULL,
  PRIMARY KEY (`venue_message_id`),
  KEY `FKd1yrkd5iq09jyafp6hn6btrpx` (`venue_code`),
  CONSTRAINT `FKd1yrkd5iq09jyafp6hn6btrpx` FOREIGN KEY (`venue_code`) REFERENCES `venue` (`venue_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `voucher`
-- ----------------------------
DROP TABLE IF EXISTS `voucher`;
CREATE TABLE `voucher` (
  `voucher_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discount_money` double NOT NULL,
  `is_used` bit(1) DEFAULT NULL,
  `least_date` datetime NOT NULL,
  `least_money` double NOT NULL,
  `member_email` varchar(255) NOT NULL,
  PRIMARY KEY (`voucher_id`),
  KEY `FK75go0hvhfpfr7e89osvqbs1cy` (`member_email`),
  CONSTRAINT `FK75go0hvhfpfr7e89osvqbs1cy` FOREIGN KEY (`member_email`) REFERENCES `member` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `voucher_type`
-- ----------------------------
DROP TABLE IF EXISTS `voucher_type`;
CREATE TABLE `voucher_type` (
  `voucher_type_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `discount_money` double NOT NULL,
  `least_money` double NOT NULL,
  `need_point` int(11) NOT NULL,
  PRIMARY KEY (`voucher_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
