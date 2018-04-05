<?php
/**
 * Plugin Name: WP Site Stats
 * Plugin URI: https://www.github.com/johnwatkins0/site-stats
 * Description: A WordPress plugin providing a frontend widget showing stats about sites in a multisite network.
 * Version: 0.0.1
 * Author: John Watkins <johnwatkins0@gmail.com>
 * Text Doman: site-stats
 *
 * @package johnwatkins0/site-stats
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require __DIR__ . '/vendor/autoload.php';
	new JohnWatkins\SiteStats\Plugin();
}
