import React from 'react';
import { render } from 'react-dom';
import get from 'lodash.get';

import Provider from './Provider';
import { ROOT_SELECTOR, SITES_REST_PATH } from './constants';

const getExcludedSitesParam = ( appRoot ) => {
	const sites = ( appRoot.getAttribute( 'data-exclude' ) || '' )
		.split( ',' )
		.map( ( item ) => item.trim() )
		.join( ',' );

	return sites ? `?exclude=${sites}` : '';
};

const fetchSites = ( appRoot ) => new Promise( async( resolve, reject ) => {
	const rootUrl = get( window, [ 'wpApiSettings', 'root' ], null );

	if ( null === rootUrl ) {
		reject();
		return;
	}

	let response;
	try {
		response = await fetch(
			`${rootUrl}${SITES_REST_PATH}${getExcludedSitesParam( appRoot )}`
		);
	} catch ( e ) {
		reject();
		return;
	}

	if ( ! response.ok ) {
		reject();
		return;
	}

	const sites = await response.json();
	resolve( sites );
});

const start = async( appRoot ) => {
	let sites;
	try {
		sites = await fetchSites( appRoot );
	} catch ( e ) {
		return;
	}

	render(
		<Provider sites={sites} />,
		appRoot
	);
};

window.addEventListener( 'load', async() => {
	if ( ( ! 'fetch' in window ) ) {
		await import( 'whatwg-fetch' );
	}

	[ ...document.querySelectorAll( ROOT_SELECTOR ) ].forEach( start );
});

