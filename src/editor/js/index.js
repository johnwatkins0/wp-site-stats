import App from '../../js/App';

const { registerBlockType, InspectorControls } = wp.blocks;

registerBlockType( 'johnwatkins/site-stats', {
    title: 'Site Stats',
    category: 'widgets',
    edit({ attributes, setAttributes, isSelected}) {
        const { excludedSites } = attributes;

        const controls = (
            <InspectorControls key="controls">
                <div className="site-stats-inspector">
                    <h2>Excluded sites</h2>
                    <label>
                        <input
                            type="text"
                            placeholder="Enter site IDs"
                            value={excludedSites}
                            onChange={event => {
                                setAttributes({
                                    excludedSites: event.target.value
                                });
                            }}
                        />
                        <span className="site-stats-inspector__label-text">
                            Enter a comma-separated list of site IDs to exclude.
                        </span>
                    </label>
                </div>
            </InspectorControls>
        );

        return [
            controls,
            (
                <div class="site-stats-placeholder">
                    Preview this post to view the widget in action.
                </div>
            )
        ];

    },
    save({ attributes }) {
        const dataAttributes = {};

        if ( attributes.excludedSites ) {
            dataAttributes['data-exclude'] = attributes.excludedSites
                .split( ',' )
                .map( item => item.trim() )
                .join( ',' );
        }

        return (
            <div
                data-site-stats
                {...dataAttributes}
            />
        );
    },
    useOnce: true
});
