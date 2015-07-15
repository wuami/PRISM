SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

-- --------------------------------------------------------

--
-- Table structure for table `mouse_interactions`
--

CREATE TABLE IF NOT EXISTS `mouse_interactions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `userid` int(10) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_events` int(10) NOT NULL,
  `total_move_time` int(10) NOT NULL,
  `avg_move_velocity` float NOT NULL,
  `mouse_move_position` longtext NOT NULL,
  `mouse_move_time` longtext NOT NULL,
  `total_mouse_clicks` int(10) NOT NULL,
  `total_drag_time` int(10) NOT NULL,
  `mouse_drag_position` longtext NOT NULL,
  `mouse_drag_time` longtext NOT NULL,
  `avg_drag_velocity` float NOT NULL,
  `user_screen_width` int(10) NOT NULL,
  `user_screen_height` int(10) NOT NULL,
  `current_page` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8017 ;

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE IF NOT EXISTS `user_data` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `timestamp` longtext NOT NULL,
  `heart_rate` longtext NOT NULL,
  `light` longtext NOT NULL,
  `total_steps` longtext NOT NULL,
  `walk_steps` longtext NOT NULL,
  `run_steps` longtext NOT NULL,
  `walk_freq` longtext NOT NULL,
  `step_status` longtext NOT NULL,
  `speed` longtext NOT NULL,
  `distance` longtext NOT NULL,
  `calories` longtext NOT NULL,
  `latitude` longtext NOT NULL,
  `longitude` longtext NOT NULL,
  `peak2peak` longtext NOT NULL,
  `upload_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `accelx` longtext NOT NULL,
  `accely` longtext NOT NULL,
  `accelz` longtext NOT NULL,
  `rotata` longtext NOT NULL,
  `rotatb` longtext NOT NULL,
  `rotatc` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=341 ;

-- --------------------------------------------------------

--
-- Table structure for table `user_insights`
--

CREATE TABLE IF NOT EXISTS `user_insights` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `userid` int(10) NOT NULL,
  `insight` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time_taken` int(20) NOT NULL,
  `total_spells` int(10) NOT NULL,
  `total_undos` int(10) NOT NULL,
  `total_backs` int(10) NOT NULL,
  `total_redos` int(10) NOT NULL,
  `total_enters` int(10) NOT NULL,
  `key_details` longtext NOT NULL,
  `key_press_time` longtext NOT NULL,
  `keybigram_details` longtext NOT NULL,
  `keybigram_timediff` longtext NOT NULL,
  `happiness_level` int(2) NOT NULL DEFAULT '5',
  `energy_level` int(2) NOT NULL DEFAULT '5',
  `relax_level` int(2) NOT NULL DEFAULT '5',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=389 ;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `sha1key` varchar(512) NOT NULL,
  `role` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `consent` int(2) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=59 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
