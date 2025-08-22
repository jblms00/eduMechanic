-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 05, 2025 at 01:05 PM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u327374461_edumechanic_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `3d_models`
--

CREATE TABLE `3d_models` (
  `model_id` bigint(150) NOT NULL,
  `title` varchar(250) NOT NULL,
  `description` text NOT NULL,
  `banner` text NOT NULL,
  `file` text NOT NULL,
  `video` text NOT NULL,
  `datetime_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `3d_models`
--

INSERT INTO `3d_models` (`model_id`, `title`, `description`, `banner`, `file`, `video`, `datetime_created`) VALUES
(1, 'Engine Oil Replacement', '', 'videos_engineoil.webp', 'simulation-1.glb', 'SIMULATION 1 FINAL.mp4', '2025-02-19 09:50:54'),
(2, 'Replacement of Spark Plug ', '', 'videos_sparkplug.webp', 'simulation-2.glb', 'SIMULATION 2 FINAL (2).mp4', '2025-02-19 09:50:54'),
(3, 'Periodic Maintenance of Drive Train', '', 'videos_sparkplug.webp', 'simulation-3.glb', 'SIMULATION 3 FINAL.mp4', '2025-03-04 20:45:56'),
(148382, 'Periodic Maintenance of Brake System', '', 'videos_breakpads.webp', 'simulation-4.glb', '0-02-06-e7589c5bbea29480d6a070b414c5abb648b8c1f2426930bba7a02f76788b1e39_b5902cd48e111b72.mp4', '2025-02-25 18:43:01'),
(148383, 'Brake Pads and Rotors Replacement', '', 'videos_tuneup.webp', 'simulation-5.glb', 'SIMULATION 5 FINAL.mp4', '2025-02-25 18:43:01');

-- --------------------------------------------------------

--
-- Table structure for table `account_verification`
--

CREATE TABLE `account_verification` (
  `verification_id` bigint(150) NOT NULL,
  `user_id` bigint(150) NOT NULL,
  `verification_code` text NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_verification`
--

INSERT INTO `account_verification` (`verification_id`, `user_id`, `verification_code`, `is_verified`) VALUES
(164003, 972828, '960430', 1),
(164368, 123411, '642027', 1);

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `activity_id` bigint(150) NOT NULL,
  `reading_id` bigint(150) NOT NULL,
  `activity_title` text NOT NULL,
  `passing_percentage` enum('10','20','30','40','50','60','70','80','90','100') NOT NULL,
  `activity_number` int(50) NOT NULL,
  `activity_due_date` date NOT NULL,
  `datetime_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`activity_id`, `reading_id`, `activity_title`, `passing_percentage`, `activity_number`, `activity_due_date`, `datetime_created`) VALUES
(100001, 161179, 'Pre-delivery Inspection', '100', 1, '2025-01-30', '2025-01-17 20:13:25'),
(100002, 384128, 'Periodic Maintenance of Automotive Engine', '100', 1, '2025-01-30', '2025-01-17 20:13:25'),
(100003, 437106, 'Periodic Maintenance of Drive Train', '100', 1, '2025-01-30', '2025-01-17 20:13:25'),
(100004, 554400, 'Periodic Maintenance of Suspension System', '100', 1, '2025-01-30', '2025-01-17 20:13:25'),
(100005, 772570, 'Periodic Maintenance of Steering System', '100', 1, '2025-01-30', '2025-01-17 20:13:25'),
(100006, 933143, 'Periodic Maintenance of Brake System', '100', 1, '2025-01-30', '2025-01-17 20:13:25'),
(979451, 471482, 'Periodic Maintenance of Sample', '100', 1, '2025-03-07', '2025-03-03 14:00:51');

-- --------------------------------------------------------

--
-- Table structure for table `activity_attempts`
--

CREATE TABLE `activity_attempts` (
  `activity_attempt_id` bigint(150) NOT NULL,
  `user_id` bigint(150) NOT NULL,
  `activity_id` bigint(150) NOT NULL,
  `datetime_attempted` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_attempts`
--

INSERT INTO `activity_attempts` (`activity_attempt_id`, `user_id`, `activity_id`, `datetime_attempted`) VALUES
(148856, 123411, 100001, '2025-03-02 19:22:27'),
(232095, 123411, 979451, '2025-03-03 14:03:45'),
(900489, 2018192765, 100001, '2025-03-04 21:20:30'),
(991936, 123411, 100005, '2025-03-04 21:05:06');

-- --------------------------------------------------------

--
-- Table structure for table `activity_items`
--

CREATE TABLE `activity_items` (
  `item_id` bigint(150) NOT NULL,
  `activity_id` bigint(150) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `item_image` text NOT NULL,
  `correct_position` int(100) NOT NULL,
  `sketchfab_code` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_items`
--

INSERT INTO `activity_items` (`item_id`, `activity_id`, `item_name`, `item_image`, `correct_position`, `sketchfab_code`) VALUES
(34, 100001, 'Air Compressor', 'air_compressor.png', 89120, 'bd66e6faefbb4dc5a06105d4a04d5b9a'),
(35, 100001, 'Multimeter', 'multimeter.png', 752357, 'd0b60e4fe8bf4d67a59e76da157cdaef'),
(36, 100001, 'Cross Wrench', 'cross_wrench.png', 494429, '2c135201029744d98680ec7c086baedb'),
(37, 100001, 'Wheel Balance', 'wheel_balance.png', 215073, 'a63c645f928f4e978bb3f7c85129748a'),
(38, 100001, 'Jumper Cable', 'jumper_cable.png', 592077, 'd00a57da1f674a6e874e5665487f2697'),
(39, 100002, 'Air Filter', 'air_filter.png', 315169, 'c845e240394f49bba6500b35919e885a'),
(40, 100002, 'Car Radiator', 'car_radiator.png', 799615, '7694147996f54ee28d58d81566440b8e'),
(41, 100002, 'Motor Oil', 'motor_oil.png', 52566, '5f20b627716e4960bf48b4f80b0be05a'),
(42, 100002, 'Exhaust Manifold', 'exhaust_manifold.png', 863987, '2c859b615d024e968e3196f5c631f91c'),
(43, 100002, 'Turbo Charger', 'turbo_charger.png', 162236, '414dd8615bb24b798807fd187cedfe73'),
(44, 100003, 'Gearshift', 'gearshift.png', 219220, '5c078ceab6984dcc882d66db3011ec5e'),
(45, 100003, 'Crankshaft', 'crankshaft.png', 609393, 'a1e1bc2fd1fe412ba624146b142c0017'),
(46, 100003, 'Car Engine', 'car_engine.png', 389306, '2c4ddc62fe5f43bca2fe363ed26db087'),
(47, 100003, 'Piston', 'piston.png', 118352, 'cfb248c17ba8438190f1c5cd035b282a'),
(48, 100003, 'Spark Plug', 'spark_plug.png', 423841, '306c0031ba8445a79897fa060791758a'),
(49, 100004, 'Car Disc', 'car_disc.png', 764149, '5feda9dbf20a49cf9fd29d550e55e4b9'),
(50, 100004, 'Car-Clamp', 'c-clamp.png', 549225, '4f962f22ade04438be9030f5e985c664'),
(51, 100004, 'Pedals', 'pedals.png', 453677, '6b3ae68d5f71439f9e153d3ad714d6de'),
(52, 100004, 'Car Jack Stand', 'car_jack_stand.png', 620713, '8269a1918e9c4a78bb95bd2f3dd50259'),
(53, 100004, 'Plier', 'plier.png', 742532, '42dd9a7e5d794d5980e9eb21409adff3'),
(54, 100005, 'Car Suspension', 'car_suspension.png', 850523, '108faf69976747c09a21968727a13255'),
(55, 100005, 'Shock Absorber', 'shock_absorber.png', 25019, '738b4c584dbb4c179e4f0fe4a3b2649b'),
(56, 100005, 'Rims', 'rims.png', 573525, 'a05676d2db9e4b7a92d7d1fe49113ece'),
(57, 100005, 'Bolts', 'bolts.png', 792569, 'a7b0477b8d774449b30da896033c6060'),
(58, 100005, 'Nuts', 'nuts.png', 242269, 'a7b0477b8d774449b30da896033c6060'),
(59, 100006, 'Electric Drill', 'electric_drill.png', 833640, 'f1adc448f867466eacdeda5510d95855'),
(60, 100006, 'Car Muffler', 'car_muffler.png', 441394, '2c859b615d024e968e3196f5c631f91c'),
(61, 100006, 'Wrench', 'wrench.png', 706052, '81578532781542c590668ab67d1121e9'),
(62, 100006, 'Chassis', 'chassis.png', 206078, 'b9a014b3795d4e0c836eb3ccf888a893'),
(63, 100006, 'Fuel Nozzle', 'fuel_nozzle.png', 912234, '5343a980106c41609a4ba34786d8a088'),
(142299, 979451, 'Compressor', 'air_compressor.png', 489789, ''),
(247543, 979451, 'Wheel Balance', 'wheel_balance.png', 325757, 'a63c645f928f4e978bb3f7c85129748a'),
(797247, 979451, 'Cross Wrench', 'cross_wrench.png', 851114, '345d5eb5c5cc4c2bad8ab4a7aa25dce7');

--
-- Triggers `activity_items`
--
DELIMITER $$
CREATE TRIGGER `generate_correct_position` BEFORE INSERT ON `activity_items` FOR EACH ROW BEGIN
    SET NEW.`correct_position` = LPAD(FLOOR(RAND() * 1000000), 6, '0');
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin_data`
--

CREATE TABLE `admin_data` (
  `admin_id` bigint(150) NOT NULL,
  `admin_name` text NOT NULL,
  `admin_email` text NOT NULL,
  `admin_photo` text NOT NULL DEFAULT 'default-profile.png',
  `admin_password` text NOT NULL,
  `datetime_created` datetime NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_data`
--

INSERT INTO `admin_data` (`admin_id`, `admin_name`, `admin_email`, `admin_photo`, `admin_password`, `datetime_created`, `is_verified`) VALUES
(972828, 'Ron Weasley', 'admin@admin.com', 'ADMIN-972828-PHOTO-2025-03-05-00-20-55.png', 'YWRtaW4=', '2025-01-01 10:53:31', 1);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `quiz_id` bigint(150) NOT NULL,
  `quiz_title` text NOT NULL,
  `reading_id` bigint(150) NOT NULL,
  `passing_percentage` enum('10','20','30','40','50','60','70','80','90','100') NOT NULL,
  `quiz_number` int(11) NOT NULL,
  `quiz_duration` time NOT NULL,
  `quiz_due_date` date NOT NULL,
  `datetime_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `quiz_title`, `reading_id`, `passing_percentage`, `quiz_number`, `quiz_duration`, `quiz_due_date`, `datetime_created`) VALUES
(312321, 'Perform Pre-delivery Inspection', 161179, '100', 1, '00:02:00', '2025-01-17', '2025-01-15 17:35:21'),
(523420, 'Perform Periodic Maintenance of Automotive Engine', 384128, '100', 1, '00:02:00', '2025-01-17', '2025-01-15 17:35:21'),
(894639, 'Perform Periodic Maintenance of Suspension System', 554400, '100', 1, '00:02:00', '2025-01-17', '2025-01-15 17:35:21'),
(894640, 'Perform Periodic Maintenance of Steering System', 772570, '100', 1, '00:02:00', '2025-01-17', '2025-01-15 17:35:21'),
(894641, 'Perform Periodic Maintenance of Drive Train', 437106, '100', 1, '00:02:00', '2025-01-17', '2025-01-15 17:35:21'),
(894642, 'Perform Periodic Maintenance of Brake System', 933143, '100', 1, '00:02:00', '2025-01-17', '2025-01-15 17:35:21');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `attempt_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `quiz_id` bigint(20) NOT NULL,
  `datetime_attempted` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questionnaire`
--

CREATE TABLE `quiz_questionnaire` (
  `questionnaire_id` bigint(150) NOT NULL,
  `quiz_id` bigint(150) NOT NULL,
  `question` text NOT NULL,
  `choices` text NOT NULL,
  `answer` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questionnaire`
--

INSERT INTO `quiz_questionnaire` (`questionnaire_id`, `quiz_id`, `question`, `choices`, `answer`) VALUES
(12345, 312321, 'Technician A says that a pre-delivery inspection focuses only on the external structure of the vehicle. Technician B says that a pre-delivery inspection focuses on both internal and external structure of the vehicle. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'b'),
(23456, 312321, 'Technician A says that the alignment of headlights is part of the pre-delivery inspection. Technician B says that the brightness of headlights is also part of the pre-delivery inspection. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(34567, 312321, 'Technician A says that in order to find unusual noises coming from the car\'s suspension or chassis, the car must do test drive as part of a pre-delivery check. Technician B says that test-driving aims to attest brake operation and steering alignment only. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(44237, 523420, 'Technician A says the performance during warm-up and cold starting is impacted by fuel volatility. Technician B says at higher elevations, gasoline must have less volatility for best results. Who is correct?', 'a. Technician A 1||b. Technician B 2||c. Both A and B 3||d. Neither A nor 4', 'a'),
(45678, 312321, 'Technician A says the vehicle\'s gaskets, pipes, and mufflers are needed to check in the braking system. Technician B says the vehicle\'s linings, drums, disc pads, and discs are needed to check in the exhaust system. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'd'),
(46823, 523420, 'Technician A says a turbocharger\'s low boost can be a sign of an air leak in the ducting or intercooler. Technician B says A clogged or broken catalyst can cause a turbocharger to produce excessive boost. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'c'),
(51460, 523420, 'Technician A says the injectors ensure an even supply of fuel via a fuel pressure regulator. Technician B says a malfunctioning fuel pressure regulator can produce inadequate fuel efficiency. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'c'),
(56789, 312321, 'Technician A says the coolant level of fluid is within the high and low markers. Technician B says the coolant level in the coolant reservoir tank should be in equilibrium state. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'b'),
(59817, 523420, 'Technician A says vapor lock arises when fuel evaporates extremely in high temperatures. Technician B says cold weather needs fewer volatile gasoline for better performance. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'a'),
(67890, 312321, 'Technician A says the electrical wiring in the boot should be inspected for any loose connections, cuts, or patches. Technician B says wiring checks are not included except an electrical issue is observed. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(67891, 312321, 'Technician A says that checking windshield washer systems for correct nozzle alignment and spray direction is significant. Technician B says the only things that need to be checked are the motor\'s operation and the washer level of fluid. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(77375, 523420, 'Technician A says the Antiknock Index (AKI) is calculated as the average of the Research Octane Number (RON) and the Motor Octane Number (MON). Technician B says that the formula of Antiknock Index (AKI) is (R+M)/2. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'c'),
(78901, 312321, 'Technician A says that a steering wheel should be examined for excessive movement and reactivity as part of a pre-delivery check. Technician B says that steering inspections does not include checking refrigerant levels and compressor. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(79486, 523420, 'Technician A says a supercharger is driven by a belt connected to the engine\'s crankshaft. Technician B says supercharger can generate energy from exhaust gases to run a turbine. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'a'),
(80017, 523420, 'Technician A says a fuel pump delivers fuel from the tank to the engine at the correct pressure. Technician B says a clogged fuel filter can limit fuel flow and diminish engine performance. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'c'),
(81991, 523420, 'Technician A says unusual sounds coming from the gasoline pump could possibly be caused by too much sludge in the fuel tank. Technician B says visible fuel tank sludge can be a sign of fuel injector damage. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'c'),
(82570, 523420, 'Technician A says use any kind of oil can be used, if the engine is low oil level. Technician B says use just the oil that the manufacturer recommends. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'b'),
(89012, 312321, 'Technician A says during a safety inspection, the mirrors\' clarity and rigidity are assessed ensuring a clear rear vision. Technician B says that the primary objective of mirror inspections is to make sure side mirrors adhere to the size and placement regulations set down by law. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(90123, 312321, 'Technician A says that PDI checklist varies depending on manufacturer. Technician B says that PDI checklist is a set of issues of the vehicle to adhere to manufacturer\'s guidelines. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98839, 523420, 'Technician A says fuel lines supports high-pressure and corrosive fuel in the delivery of gasoline. Technician B says fuel lines keeps contaminants away from engine. Who is correct?', 'a. Technician A ||b. Technician B ||c. Both A and B ||d. Neither A nor B', 'a'),
(98845, 894639, 'According to Technician A, using stiffer urethane the suspension’s bushings enhance the vehicle’s handling and road-holding capacity. Technician B, stronger bushings are beneficial. In certain FWD automobiles, remove the torque steer. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98846, 894639, 'According to Technician A, the main way shock absorbers work is by absorbing spring movement, which guarantees a stable ride. According to Technician B, shock absorbers, sometimes referred to as dampers, regulate the suspension system’s excessive bouncing but do not really absorb shocks. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'b'),
(98847, 894639, 'According to Technician A, a weak suspension spring can result in a decrease in traction when accelerating. According to Technician B, a weak suspension spring can result in inadequate braking force. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98848, 894639, 'According to Technician A, rear suspensions with leaf springs may experience an axle tramp. Technician B claims that the purpose of an anti-sway bar is to restrict tramps on wheels. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(98849, 894639, 'According to Technician A, shock absorbers ought to be examined for worn and loose mounting bolts mounting bushings. According to Technician B, it is necessary to inspect the struts and shock absorbers for spilling oil. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98850, 894639, 'When talking of coil spring types, Technician A, coil springs with a linear rate have equal distances from one coil to another. Technician B claims that a spring with a changeable rate may have a cylindrical form with coils that are not evenly spaced.', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98851, 894639, 'When a vehicle’s front wheels are turned left front coil is fitted with front struts, a chattering movement and noise are produced by the spring: According to Technician A, the strut has internal flaws and needs to be replaced the strut. Technician B states that the upper strut bearing and the mount are flawed. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98852, 894639, 'According to Technician A, the suspension switch must be switched off prior to lifting any part of the electrical air suspension vehicle. According to Technician B, the ignition switch shouldn’t be switched on in any area of an electronic vehicle, the air suspension is increased. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98853, 894639, 'As a bounce test is being performed, Technician A asserts that pushing the bumper two or three times down while carrying a lot of weight is applied to the vehicle’s corners. According to Technician B, one free upward bounce ought to halt the movement of the vertical chassis if the shock proper spring control is provided by an absorber or strut.', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'b'),
(98854, 894639, 'According to Technician A, rattling on imperfections in the road may result from worn shock absorbers, grommets, or bushings. According to Technician B, control arm bushings that are worn out or dry could result in a squeaking sound on uneven pavement. Who is right?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98855, 894640, 'Technician A the steering gearbox transfers motion to the steering linkage when a motorist rotates the steering wheel. According to Technician B, the steering linkage rotates the wheels on its own without the assistance of a gearbox. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'a'),
(98856, 894640, 'Technician A, the steering arms are connected to the gear output shaft by steering linkages. According to Technician B, the steering arms aid in wheel rotation and are a component of the steering knuckle. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'c'),
(98857, 894640, 'Tie-rods, according to Technician A, are the last link between the steering linkage and steering knuckles. According to Technician B, power steering systems are the only ones that use tie-rods. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'a'),
(98858, 894640, 'Technician A, parallelogram steering requires more parts than rack and pinion steering. According to Technician B, the tie-rod location is the only difference between the two systems’ operations. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'a'),
(98859, 894640, 'Technician A, Haltenberger linkages replace parallelogram linkages with long tie-rods and a Pitman arm. According to Technician B, the front suspension can move without bump steer thanks to cross steer connections. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'c'),
(98860, 894640, 'Wheel direction is controlled by the rack, which is moved by the pinion gear, according to Technician A. Instead, according to Technician B, the rack rotates the pinion. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'a'),
(98861, 894640, 'Power steering systems, according to Technician A, lessen the force needed to turn the steering wheel. According to Technician B, power steering only works at high speeds. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'a'),
(98862, 894640, 'Technician A, integral piston systems help steer by using pressure lines and a power-steering pump. According to Technician B, only electronic steering uses integral piston systems. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and', 'a'),
(98863, 894640, 'Technician A, most power-steering pumps are powered by belts and crankshaft pulleys. According to Technician B, serpentine belts are frequently found in contemporary automobiles. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'c'),
(98864, 894640, 'Electric power steering pumps, according to Technician A, enable the system to turn off when not in use. According to Technician B, these pumps are always in operation. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Not both A and B', 'a'),
(98865, 894641, 'What is the primary function of a vehicles transmission system?', 'a. To generate power for the engine || b. To control speed and torque while transferring power to the wheels || c. To provide electrical power to the vehicle’s accessories || d. To lubricate engine components', 'b'),
(98866, 894641, 'Technician A says excessive noise in neutral with the clutch engaged may be due to worn or dry bearings. Technician B says that worn synchronizers will cause difficulty in shifting gears. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98867, 894641, 'What is a common symptom of a failing clutch system?', 'a. Overheating engine || b. Slipping, pulling, or chattering during gear shifts || c. Unresponsive brake pedal || d. Unstable idle speed', 'b'),
(98868, 894641, 'Technician A says an automatic transmission uses planetary gears to change gear ratios. Technician B says a manual transmission uses synchronizers to help smooth gear changes. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98869, 894641, 'What is the final step when installing a transmission back into a vehicle?', 'a. Tighten bolts according to the manufacturer’s torque specifications || b. Leave guide pins in place for reinforcement || c. Use excessive force to fit misaligned parts || d. Skip lubrication for the new components', 'a'),
(98870, 894641, 'Technician A says a reverse idler gear allows the vehicle to move in reverse. Technician B says a reverse idler gear is used in both manual and automatic transmissions. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(98871, 894641, 'Technician A says that in a manual transmission, the clutch must be fully disengaged to change gears smoothly. Technician B says that shifting gears without disengaging the clutch will not cause damage. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(98872, 894641, 'During a transmission fluid level inspection, what should be done to ensure accuracy?', 'a. Check the fluid level when the vehicle is on a slope || b. Inspect the fluid while the vehicle is running and warmed up || c. Drain all the fluid before checking || d. Use engine oil as a substitute for transmission fluid', 'b'),
(98873, 894641, 'What should be checked if a transmission is leaking fluid?', 'a. Battery voltage || b. Engine air filter || c. Seals, gaskets, or damaged transmission casing || d. Coolant reservoir', 'c'),
(98874, 894641, 'Technician A says an automatic transmission uses planetary gears to change gear ratios. Technician B says a manual transmission uses synchronizers to help smooth gear changes. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98875, 894642, 'Technician A says drum brakes use a self-energizing effect to enhance braking force. Technician B says drum brakes rely only on hydraulic pressure to stop the vehicle. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(98876, 894642, 'Technician A says brake shoe return springs help retract the brake shoes after braking. Technician B says brake shoe return springs are only found in disc brake systems. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(98877, 894642, 'Technician A says a worn brake drum can cause brake pulsation. Technician B says a worn brake drum should be resurfaced or replaced if it exceeds its service limit. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'c'),
(98878, 894642, 'Technician A says that excessive heat buildup in a brake drum can lead to brake fade. Technician B says heat buildup in a brake drum has no effect on braking performance. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(98879, 894642, 'Technician A says brake pad wear indicators are designed to alert drivers when pads need replacement. Technician B says brake pad wear indicators will automatically adjust the brake pad position. Who is correct?', 'a. Technician A || b. Technician B || c. Both A and B || d. Neither A nor B', 'a'),
(98880, 894642, 'What is the primary function of a brake shoe return spring in a drum brake system?', 'a. To provide additional braking force || b. To retract the brake shoes after braking || c. To help lubricate the drum surface || d. To keep the wheel cylinder in position', 'b'),
(98881, 894642, 'What should be done before reinstalling a brake drum after maintenance?', 'a. Clean the drum and inspect for wear || b. Apply a thick layer of grease to the drum surface || c. Remove the wheel cylinder || d. Soak the drum in brake fluid for better performance', 'a'),
(98882, 894642, 'When inspecting drum brakes, deep grooves on the drum surface typically indicate:', 'a. The drum is in good condition || b. The drum needs to be resurfaced or replaced || c. The brake shoes are new and need to wear in || d. The drum should be painted to prevent corrosion', 'b'),
(98883, 894642, 'A common cause of brake noise in drum brake systems is:', 'a. Worn brake shoes || b. Too much brake fluid in the system || c. Overinflated tires || d. Loose engine mounts', 'a'),
(98884, 894642, 'If a customer complains of a \"soft\" or \"spongy\" brake pedal, a technician should first check for:', 'a. Air in the brake fluid || b. Worn-out brake drums || c. Low engine coolant || d. A faulty alternator', 'a');

-- --------------------------------------------------------

--
-- Table structure for table `readings_lessons`
--

CREATE TABLE `readings_lessons` (
  `reading_id` bigint(150) NOT NULL,
  `lesson_title` text NOT NULL,
  `lesson_learnings` text NOT NULL,
  `lesson_content` text NOT NULL,
  `lesson_media` text NOT NULL,
  `lesson_level` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `datetime_added` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `readings_lessons`
--

INSERT INTO `readings_lessons` (`reading_id`, `lesson_title`, `lesson_learnings`, `lesson_content`, `lesson_media`, `lesson_level`, `datetime_added`) VALUES
(161179, 'Pre-delivery Inspection', 'Define Pre-Delivery Inspection., Enumerate the list of vehicle checklist in a pre-delivery inspection., Identify the category of the PDI Checklist for inspecting the vehicle’s function., Know the importance of pre-delivery inspection.', '../assets/uploads/PERFORM-PRE-DELIVERY.pdf', 'rdb1.webp', 'Beginner', '2024-12-21 15:26:31'),
(384128, 'Periodic Maintenance of Automotive Engine', 'Define the chemical composition of gasoline, know the effects of gasoline volatility in automotive engines, identify the fuel tank components and their functions, implement safety precautions and proper cleaning process of fuel-injection system, perform fuel tank servicing procedures, determine engine oil level, explain the maintenance of superchargers and turbochargers.', '../assets/uploads/PERFORM-PERIODIC-MAINTENANCE-OF-AUTOMOTIVE-ENGINE.pdf', 'rdb2.webp', 'Beginner', '2024-12-21 15:26:31'),
(437106, 'Periodic Maintenance of Drive Train', 'Know how car clutches work and how to maintain them., Explain the difference between manual and automatic transmissions., Describe the operation and upkeep of transaxles and manual transmissions., Diagnose and fix problems with transaxles and manual transmissions.', '../assets/uploads/PERFORM-PERIODIC-MAINTENANCE-OF-DRIVE-TRAIN.pdf', 'rdi1.webp', 'Intermediate', '2024-12-21 15:26:31'),
(554400, 'Periodic Maintenance of Suspension System', 'Determine the purpose of struts and shock absorbers and explain their fundamental structure., Determine the elements that make up a MacPherson strut system and explain how it works., Determine the purpose of stabilizers and bushings. Conduct a general examination of the front suspension., List the three fundamental kinds of rear suspensions and understand how they affect tire wear and traction., Determine the different kinds of springs and their purposes where in the rear-axle chassis they are located., Explain the benefits and how the three work. fundamental suspension systems with electronic control: active; adaptive; and level control., Describe how electronic suspension parts work including sensors; air compressors; control modules; electronic shock absorbers; air shocks; and electrical struts., Determine which parts make up a car\'s suspension system., Describe the procedures for carrying out routine suspension system maintenance., Use appropriate inspection methods to guarantee the best possible suspension performance.', '../assets/uploads/PERFORM-PERIODIC-MAINTENANCE-OF-SUSPENSION-SYSTEM.pdf', 'rda1.webp', 'Advanced', '2024-12-21 15:26:31'),
(756224, 'Multiple Lessons Sample', ' Lesson Learning #1', '../assets/uploads/67c7c61712f0e-script-pub.pdf', '67c7c61712f03-drivetrain.jpg', 'Intermediate', '2025-03-05 03:33:43'),
(772570, 'Periodic Maintenance of Steering System', 'List the common parts of a steering system as well as their roles., List the fundamental kinds of steering linkage systems., Determine the parts of a rack and pinion steering configuration and explain its purpose., Explain the purpose and workings of steering the steering column and the gearbox., Explain the different power-steering services and designs., Check the power-steering system in general, Examine and maintain the components of the steering linkage., Power steering pumps should be inspected and maintained., Know the correct methods for maintaining and examining the steering system., Gain the knowledge and abilities necessary to identify and resolve typical steering problems., Highlight how crucial routine maintenance in maintaining the performance and safety of your car.', '../assets/uploads/PERFORM-PERIODIC-MAINTENANCE-OF-STEERING-SYSTEM.pdf', 'rda2.webp', 'Advanced', '2024-12-21 15:26:31'),
(933143, 'Periodic Maintenance of Brake System', 'List the common parts of a steering system as well as their roles., List the fundamental kinds of steering linkage systems., Determine the parts of a rack and pinion steering configuration and explain its purpose., Explain the purpose and workings of steering the steering column and the gearbox., Explain the different power-steering services and designs., Check the power-steering system in general, Examine and maintain the components of the steering linkage., Power steering pumps should be inspected and maintained., Know the correct methods for maintaining and examining the steering system., Gain the knowledge and abilities necessary to identify and resolve typical steering problems., Highlight how crucial routine maintenance in maintaining the performance and safety of your car.', '../assets/uploads/67c771d8930d2-thesis-3_Group-Amabayon-Langit-Perez.pdf', '67c771d896e80-brake diagram.jpg', 'Beginner', '2024-12-21 15:26:31');

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `user_id` bigint(150) NOT NULL,
  `user_first_name` text NOT NULL,
  `user_last_name` text NOT NULL,
  `user_email` text NOT NULL,
  `user_photo` text NOT NULL DEFAULT 'default-profile.png',
  `user_password` text NOT NULL,
  `datetime_created` datetime NOT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`user_id`, `user_first_name`, `user_last_name`, `user_email`, `user_photo`, `user_password`, `datetime_created`, `is_verified`) VALUES
(123411, 'John', 'Doe', 'johndoe@gmail.com', 'USR-123411-PHOTO-2025-03-04-23-42-13.png', 'YWRtaW4=', '2025-01-15 21:40:36', 1),
(2017452398, 'Adrian', 'Dela Cruz', 'adrian.delacruz92@gmail.com', 'default-profile.png', 'YWRtaW4=', '2025-02-19 09:42:05', 1),
(2017458312, 'Bea', 'Santiago', 'bea.santiago24@yahoo.com', 'default-profile.png', 'R28jNTgzMTI=', '2025-02-19 09:43:40', 0),
(2018192765, 'Carlo', 'Reyes', 'carlo.reyes88@outlook.com', 'default-profile.png', 'RXMjOTI3NjU=', '2025-02-19 09:43:40', 1),
(2019876543, 'Diane', 'Villanueva', 'diane.villanueva16@gmail.com', 'default-profile.png', 'VmEjNzY1NDM=', '2025-02-19 21:25:13', 0),
(2020134872, 'Edgar', 'Castillo', 'edgar.castillo74@yahoo.com', 'default-profile.png', 'TG8jMzQ4NzI=', '2025-02-19 21:25:14', 0),
(2020193586, 'Fiona', 'Ramirez', 'fiona.ramirez31@outlook.com', 'default-profile.png', 'RXojOTM1ODY=', '2025-02-19 21:25:14', 0),
(2021039475, 'Gregorio', 'Navarro', 'gregorio.navarro55@gmail.com', 'default-profile.png', 'Um8jMzk0NzU=', '2025-02-19 21:25:14', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_scores`
--

CREATE TABLE `user_scores` (
  `score_id` bigint(150) NOT NULL,
  `task_id` bigint(150) NOT NULL,
  `user_id` bigint(150) NOT NULL,
  `score` int(50) NOT NULL,
  `score_percentage` int(100) NOT NULL,
  `task_type` enum('quiz','activity') NOT NULL,
  `datetime_added` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_scores`
--

INSERT INTO `user_scores` (`score_id`, `task_id`, `user_id`, `score`, `score_percentage`, `task_type`, `datetime_added`) VALUES
(366803, 100001, 2018192765, 10, 100, 'activity', '2025-03-04 21:20:30'),
(543952, 100001, 123411, 10, 100, 'activity', '2025-03-02 19:22:27'),
(606580, 100005, 123411, 10, 100, 'activity', '2025-03-04 21:05:06'),
(970738, 979451, 123411, 6, 100, 'activity', '2025-03-03 14:03:45');

-- --------------------------------------------------------

--
-- Table structure for table `video_demonstration`
--

CREATE TABLE `video_demonstration` (
  `video_id` bigint(150) NOT NULL,
  `video_title` varchar(150) NOT NULL,
  `video_img` text NOT NULL,
  `video_url` text NOT NULL,
  `datetime_added` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `video_demonstration`
--

INSERT INTO `video_demonstration` (`video_id`, `video_title`, `video_img`, `video_url`, `datetime_added`) VALUES
(1, 'Engine Oil Replacement ', 'videos_engineoil.webp', 'https://www.youtube.com/watch?v=SgIGgew3wAQ', '2025-03-03 09:13:27'),
(2, 'Replacement of Spark Plug ', 'videos_sparkplug.webp', 'https://www.youtube.com/watch?v=6j2lRjicBmU', '2025-03-03 09:44:54'),
(3, 'Engine Tune Up', 'videos_tuneup.webp', 'https://www.youtube.com/watch?v=AAGyoRkkRgE', '2025-01-01 13:52:40'),
(4, 'Suspension System Components Replacement', 'videos_suspension.webp', 'https://www.youtube.com/watch?v=qTDzLGJtU_Q', '2025-01-01 13:52:40'),
(5, 'Brake Pads and Rotors Replacement ', 'videos_breakpads.webp', 'https://www.youtube.com/watch?v=B4fgqlDl_80', '2025-01-01 13:52:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `3d_models`
--
ALTER TABLE `3d_models`
  ADD PRIMARY KEY (`model_id`);

--
-- Indexes for table `account_verification`
--
ALTER TABLE `account_verification`
  ADD PRIMARY KEY (`verification_id`);

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`);

--
-- Indexes for table `activity_attempts`
--
ALTER TABLE `activity_attempts`
  ADD PRIMARY KEY (`activity_attempt_id`);

--
-- Indexes for table `activity_items`
--
ALTER TABLE `activity_items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `admin_data`
--
ALTER TABLE `admin_data`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`quiz_id`),
  ADD KEY `fk_quiz_reading_id` (`reading_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`attempt_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quiz_questionnaire`
--
ALTER TABLE `quiz_questionnaire`
  ADD PRIMARY KEY (`questionnaire_id`),
  ADD KEY `fk_questionnaire_quiz_id` (`quiz_id`);

--
-- Indexes for table `readings_lessons`
--
ALTER TABLE `readings_lessons`
  ADD PRIMARY KEY (`reading_id`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_scores`
--
ALTER TABLE `user_scores`
  ADD PRIMARY KEY (`score_id`);

--
-- Indexes for table `video_demonstration`
--
ALTER TABLE `video_demonstration`
  ADD PRIMARY KEY (`video_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `3d_models`
--
ALTER TABLE `3d_models`
  MODIFY `model_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=971800;

--
-- AUTO_INCREMENT for table `account_verification`
--
ALTER TABLE `account_verification`
  MODIFY `verification_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=969345;

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `activity_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=979452;

--
-- AUTO_INCREMENT for table `activity_attempts`
--
ALTER TABLE `activity_attempts`
  MODIFY `activity_attempt_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=995450;

--
-- AUTO_INCREMENT for table `activity_items`
--
ALTER TABLE `activity_items`
  MODIFY `item_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=953732;

--
-- AUTO_INCREMENT for table `admin_data`
--
ALTER TABLE `admin_data`
  MODIFY `admin_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=972831;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=894643;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `attempt_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=533082;

--
-- AUTO_INCREMENT for table `quiz_questionnaire`
--
ALTER TABLE `quiz_questionnaire`
  MODIFY `questionnaire_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98885;

--
-- AUTO_INCREMENT for table `readings_lessons`
--
ALTER TABLE `readings_lessons`
  MODIFY `reading_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=933145;

--
-- AUTO_INCREMENT for table `user_data`
--
ALTER TABLE `user_data`
  MODIFY `user_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2021253747;

--
-- AUTO_INCREMENT for table `user_scores`
--
ALTER TABLE `user_scores`
  MODIFY `score_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=997828;

--
-- AUTO_INCREMENT for table `video_demonstration`
--
ALTER TABLE `video_demonstration`
  MODIFY `video_id` bigint(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=763340;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `fk_quiz_reading_id` FOREIGN KEY (`reading_id`) REFERENCES `readings_lessons` (`reading_id`);

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_data` (`user_id`),
  ADD CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`);

--
-- Constraints for table `quiz_questionnaire`
--
ALTER TABLE `quiz_questionnaire`
  ADD CONSTRAINT `fk_questionnaire_quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
