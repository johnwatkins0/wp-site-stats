<?php
/**
 * Site_Endpoint.php
 *
 * @package johnwatkins/site-stats
 */

namespace JohnWatkins\SiteStats;

/**
 * Sets up an endpoint for stats about a site.
 */
class Site_Endpoint {
	const ENDPOINT_VERSION = 'v1';
	const NAMESPACE        = Plugin::VENDOR . '/' . self::ENDPOINT_VERSION;

	/**
	 * Adds hook callbacks.
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
	}

	/**
	 * Registers the plugin's REST routes.
	 */
	public static function register_routes() {
		register_rest_route(
			Plugin::VENDOR . '/' . self::ENDPOINT_VERSION,
			'/' . Plugin::TEXT_DOMAIN . '/(?P<id>[\d]+|self)',
			[
				'args' => [
					'id' => [
						'description' => __( 'Unique identifier for the object.' ),
						'type'        => [ 'string', 'integer' ],
					],
				],
				[
					'methods'  => \WP_REST_Server::READABLE,
					'callback' => [ __CLASS__, 'get_site' ],
				],
			]
		);
	}

	/**
	 * Gets the number of users registered to the current site.
	 *
	 * @return int The user count.
	 */
	public static function get_user_count() {
		$user_query = new \WP_User_Query(
			[
				'count_total' => true,
			]
		);

		return $user_query->get_total();
	}

	/**
	 * Gets the latest post on the current site.
	 *
	 * @param \WP_REST_Request $request The current request.
	 * @return object A REST-formatted post object.
	 */
	public static function get_latest_post( \WP_REST_Request $request ) {
		static $posts_controller;

		$latest_post_query = new \WP_Query( [ 'posts_per_page' => 1 ] );

		if ( empty( $latest_post_query ) || empty( $latest_post_query->posts[0] ) ) {
			return [];
		}

		// Convert post data to REST format.
		$posts_controller = empty( $posts_controller )
			? new \WP_REST_Posts_Controller( 'post', $request )
			: $posts_controller;

		return $posts_controller->prepare_item_for_response(
			$latest_post_query->posts[0],
			$request
		)->data;
	}

	/**
	 * Returns the last comment made to any post on a site.
	 *
	 * @param \WP_REST_Request $request The current request.
	 * @return \WP_Comment|false The latest comment or false if no comments.
	 */
	public static function get_latest_comment( $request ) {
		static $comments_controller;

		$comment_query = new \WP_Comment_Query(
			[
				'number' => 1,
			]
		);

		if ( empty( $comment_query ) || empty( $comment_query->comments ) ) {
			return false;
		}

		$comments_controller = empty( $comments_controller )
			? new \WP_REST_Comments_Controller()
			: $comments_controller;

		return $comments_controller->prepare_item_for_response(
			$comment_query->comments[0],
			$request
		)->data;
	}

	/**
	 * Assembles statistics from the current site.
	 *
	 * @param \WP_REST_Request $request The current request.
	 * @param int|string       $site_id The site ID.
	 * @return array The assembled stats.
	 */
	public static function get_site_stats( \WP_REST_Request $request, $site_id ) {
		$stats['site_title']     = get_bloginfo();
		$stats['site_url']       = get_bloginfo( 'url' );
		$stats['user_count']     = self::get_user_count();
		$stats['post_count']     = wp_count_posts( 'post' );
		$stats['page_count']     = wp_count_posts( 'page' );
		$stats['comment_count']  = wp_count_comments();
		$stats['latest_post']    = self::get_latest_post( $request );
		$stats['latest_comment'] = self::get_latest_comment( $request );

		/**
		 * Filters site stats supplied to the site-stats REST endpoint.
		 *
		 * @param $stats An associative array of stats.
		 * @param $site_id The ID of the site.
		 */
		return apply_filters( Plugin::FILTER_NAMESPACE . 'site_stats', $stats, $site_id );
	}

	/**
	 * Returns a REST response containing stats from the current site.
	 *
	 * @param \WP_REST_Request $request The current request.
	 * @return \WP_REST_Response The response object.
	 */
	public static function get_site( \WP_REST_Request $request ) {
		$args    = $request->get_params();
		$site_id = $args['id'];

		// If the ID is 'self', the site's enpoint is being accessed directly via
		// the site's own doman/path. Otherwise, we switch to that blog and get
		// the requested info.
		if ( 'self' !== $site_id && is_multisite() ) {
			switch_to_blog( $site_id ); // phpcs:disable WordPress.VIP.RestrictedFunctions.switch_to_blog_switch_to_blog
		}

		$site_stats = self::get_site_stats( $request, $site_id );

		// Switch back to current site.
		if ( 'self' !== $site_id && is_multisite() ) {
			restore_current_blog();

		}

		$response = rest_ensure_response( $site_stats );
		return $response;
	}
}
