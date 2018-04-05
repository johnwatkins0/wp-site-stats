<?php
/**
 * Sites_Endpoint.php
 *
 * @package johnwatkins/site-stats
 */

namespace JohnWatkins\SiteStats;

/**
 * Sets up an endpoint for sites in the network.
 */
class Sites_Endpoint {
	const ENDPOINT_VERSION = 'v1';
	const NAMESPACE        = Plugin::VENDOR . '/' . self::ENDPOINT_VERSION;

	/**
	 * Adds hook callbacks.
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ __CLASS__, 'register_route' ] );
	}

	/**
	 * Registers the REST route.
	 */
	public static function register_route() {
		register_rest_route(
			self::NAMESPACE,
			'/' . Plugin::TEXT_DOMAIN,
			[
				[
					'methods'  => \WP_REST_Server::READABLE,
					'callback' => [ __CLASS__, 'get_sites' ],
					'args'     => self::get_collection_params(),
				],
			]
		);
	}

	/**
	 * Returns accepted parameters for the get_sites method.
	 *
	 * @return array An array of parameter details.
	 */
	public static function get_collection_params() {
		return [
			'exclude' => [
				'description'       => __( 'Exclude specified sites.' ),
				'type'              => 'string',
				'default'           => '',
				'sanitize_callback' => 'sanitize_text_field',
				'validate_callback' => 'rest_validate_request_arg',
			],
		];
	}

	/**
	 * Returns the REST response for multiple sites.
	 *
	 * @param \WP_REST_Request $request The current request.
	 * @return \WP_REST_Response The REST response.
	 */
	public static function get_sites( \WP_REST_Request $request ) {
		$args = $request->get_params();

		// Handle a non-multisite environment.
		if ( ! function_exists( 'get_sites' ) ) {
			$response = rest_ensure_response(
				[
					(object) [
						'id'         => '0',
						'domain'     => preg_replace( '/^https?:\/\//', '', get_site_url() ),
						'path'       => '/',
						'registered' => '',
					],
				]
			);
			return $response;
		}

		$sites = get_sites(
			[
				'site__not_in' => $args['exclude'],
			]
		);

		$prepared_sites = array_map(
			function( $site ) {
					return (object) [
						'id'         => $site->blog_id,
						'domain'     => $site->domain,
						'path'       => $site->path,
						'registered' => $site->registered,
					];
			}, $sites
		);

		$response = rest_ensure_response( $prepared_sites );
		return $response;
	}
}
