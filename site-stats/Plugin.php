<?php
/**
 * Plugin.php
 *
 * @package johnwatkins/site-stats
 */

namespace JohnWatkins\SiteStats;

/**
 * Performs plugin initialization.
 */
class Plugin {
	const PROD             = false;
	const VERSION          = '0.0.1';
	const VENDOR           = 'johnwatkins';
	const TEXT_DOMAIN      = 'site-stats';
	const FILTER_NAMESPACE = self::VENDOR . '__' . self::TEXT_DOMAIN . '__';

	/**
	 * Initiates the plugin.
	 */
	public function __construct() {
		new Sites_Endpoint();
		new Site_Endpoint();
		add_action( 'template_redirect', [ __CLASS__, 'maybe_block_assets' ] );
		add_action( 'init', [ __CLASS__, 'register_assets' ] );
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_assets' ] );
		add_action( 'widgets_init', [ __CLASS__, 'register_widget' ] );
		add_action( 'init', [ __CLASS__, 'register_block' ] );
		add_shortcode( self::TEXT_DOMAIN, [ __CLASS__, 'render_app_root' ] );
	}

	/**
	 * Registers scripts and styles.
	 */
	public static function register_assets() {
		$dist = self::get_dist_directory();
		$min  = self::PROD ? '.min' : '';

		wp_register_style(
			self::TEXT_DOMAIN,
			$dist . self::TEXT_DOMAIN . "$min.css",
			[],
			self::VERSION
		);

		wp_register_script(
			self::TEXT_DOMAIN,
			$dist . self::TEXT_DOMAIN . "$min.js",
			[ 'wp-api-request' ],
			self::VERSION,
			true
		);

		wp_register_style(
			self::TEXT_DOMAIN . '-editor',
			$dist . self::TEXT_DOMAIN . "-editor$min.css",
			[ 'wp-edit-blocks' ]
		);

		wp_register_script(
			self::TEXT_DOMAIN . '-editor',
			$dist . self::TEXT_DOMAIN . "-editor$min.js",
			[ 'wp-blocks', 'wp-element' ]
		);
	}

	/**
	 * Enqueues plugin assets that are not blocked.
	 */
	public static function enqueue_assets() {
		/**
		 * Filters whether to enqueue this plugin's style.
		 *
		 * @param bool Yes or no.
		 */
		if ( apply_filters( self::FILTER_NAMESPACE . 'enqueue_style', true ) ) {
			wp_enqueue_style( self::TEXT_DOMAIN );
		}

		/**
		 * Filters whether to enqueue this plugin's script.
		 *
		 * @param bool Yes or no.
		 */
		if ( apply_filters( self::FILTER_NAMESPACE . 'enqueue_script', true ) ) {
			wp_enqueue_script( self::TEXT_DOMAIN );
		}
	}

	/**
	 * Maybe adds filters to prevent assets from loading.
	 */
	public static function maybe_block_assets() {
		global $post;

		if ( is_singular() && strpos( $post->post_content, 'data-' . self::TEXT_DOMAIN ) ) {
			// The data attribute is hardcoded.
			return;
		}

		if ( is_singular() && has_shortcode( $post->post_content, self::TEXT_DOMAIN ) ) {
			// The shortcode is present.
			return;
		}

		if ( is_active_widget( false, false, Widget::ID_BASE ) ) {
			// The widget is active on the current page.
			return;
		}

		add_filter( self::FILTER_NAMESPACE . 'enqueue_style', '__return_false' );
		add_filter( self::FILTER_NAMESPACE . 'enqueue_script', '__return_false' );
	}

	/**
	 * Gets the plugin's dist/ directory URL, whether this package is installed as a plugin
	 * or in a theme via composer. If the package is in neither of those places and the filter
	 * is not used, this whole thing will fail.
	 *
	 * @return string The URL.
	 */
	public static function get_dist_directory() {
		/**
		 * Filters the URL location of the /dist directory.
		 *
		 * @param string The URL.
		 */
		$dist = apply_filters( self::FILTER_NAMESPACE . 'dist', null );

		if ( ! empty( $dist ) ) {
			return $dist;
		}

		if ( file_exists( dirname( dirname( __DIR__ ) . '/plugins' ) ) ) {
			return plugin_dir_url(
				dirname( __DIR__ ) . '/' . self::TEXT_DOMAIN . '.php'
			) . 'dist/';
		}

		$composer_dir = get_template_directory_uri() . '/vendor/';
		$dist         = $composer_dir . self::VENDOR . '/' . self::TEXT_DOMAIN . '/dist/';
		return $dist;
	}

	/**
	 * Registers the plugin's widget.
	 */
	public static function register_widget() {
		register_widget( __NAMESPACE__ . '\\Widget' );
	}

	/**
	 * Adds the editor block.
	 */
	public static function register_block() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type(
			self::VENDOR . '/' . self::TEXT_DOMAIN,
			[
				'editor_script' => self::TEXT_DOMAIN . '-editor',
				'editor_style'  => self::TEXT_DOMAIN . '-editor',
			]
		);
	}

	/**
	 * Callback for the shortcode.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string Rendered HTML.
	 */
	public static function render_app_root( $atts = [] ) {
		$atts    = is_array( $atts ) ? $atts : [];
		$exclude = sanitize_text_field( $atts['exclude'] ?? '' );

		$exclude_string = implode(
			',',
			array_map( 'trim', explode( ',', $exclude ) )
		);

		$exclude_data_attr = ! empty( $exclude_string )
			? ' data-exclude="' . esc_attr( $exclude_string ) . '"'
			: '';

		return '<div data-' . self::TEXT_DOMAIN . "$exclude_data_attr></div>";
	}
}
