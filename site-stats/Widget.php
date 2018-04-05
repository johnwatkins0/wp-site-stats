<?php
/**
 * Widget.php
 *
 * @package johnwatkins/site-stats
 */

namespace JohnWatkins\SiteStats;

/**
 * Makes the app available to widgetized areas.
 */
class Widget extends \WP_Widget {
	const ID_BASE = Plugin::FILTER_NAMESPACE . 'widget';

	/**
	 * Initializes the widget.
	 */
	public function __construct() {
		parent::__construct(
			self::ID_BASE,
			'Site Stats',
			[
				'classname'   => 'widget_' . self::ID_BASE,
				'description' => __(
					'A widget displaying information about sites in the network.'
				),
			]
		);
	}

	/**
	 * The widget edit form.
	 *
	 * @param array $instance Data passed to this instance.
	 */
	public function form( $instance = [] ) {
		$exclude = empty( $instance['exclude'] ) ? '' : $instance['exclude'];
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'exclude' ) ); ?>">
				<?php echo esc_attr( 'Exclude:' ); ?>
			</label> 
			<input
				class="widefat"
				id="<?php echo esc_attr( $this->get_field_id( 'exclude' ) ); ?>"
				name="<?php echo esc_attr( $this->get_field_name( 'exclude' ) ); ?>"
				type="text"
				value="<?php echo esc_attr( $exclude ); ?>"
			/>
			<?php esc_html_e( 'A comma-separated list of site IDs to exclude.' ); ?>
		</p>
		<?php
	}

	/**
	 * Echoes the widget content.
	 *
	 * @param array $args Display arguments.
	 * @param array $instance The settings for the particular instance of the widget.
	 */
	public function widget( $args = [], $instance = [] ) {
		// phpcs:disable WordPress.XSS.EscapeOutput.OutputNotEscaped
		echo $args['before_widget'];
		echo Plugin::render_app_root( $instance );
		echo $args['after_widget'];
		// phpcs:enable WordPress.XSS.EscapeOutput.OutputNotEscaped
	}
}
