import React from 'react';

// Using wp.element.render when it's up to date will decrease the
// bundle size by two thirds.
import { render } from 'react-dom';

import App from './App';

const ROOT_SELECTOR = '[data-site-stats]';

const start = ( appRoot ) => {
	render(
		<App excludedSites={appRoot.getAttribute( 'data-exclude' )} />,
		appRoot
	);
};

window.addEventListener( 'load', () => {
	[ ...document.querySelectorAll( ROOT_SELECTOR ) ].forEach( start );
});

