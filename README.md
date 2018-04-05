# wp-site stats

A WordPress plugin providing a frontend widget showing stats about sites in a multisite network.

Note: This plugin has only been tested in a *subdirectory* WordPress multisite installation. It may not be ready for a subdomain installation.

## Install

1. Clone this repository into your wp-content/plugins directory.
2. In this plugin's directory, run `composer install` and `yarn`.

## Usage

### Shortcode

The plugin makes a `[site-stats]` shortcode available.

#### Attributes

##### `exclude`

A comma-separated list of network site IDs to exclude.

### Widget

The plugin provides a "Sites Stats" widget available to drop into a any widgetized area. Note: In a widgetized area with a narrow width (such as a sidebar), the widget's display might not be optimal.

### WordPress 5.0 block (Gutenberg)

The widget is available as a block to be added via the WordPress >5.0 editor. Find the block called "Site Stats." Note: The block will only display on the front end. You will see a placeholder block in the editor. This may change when the React/ReactDOM versions are updated to >16.3.0 in the officially released Gutenberg plugin.
