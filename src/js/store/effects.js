import get from 'lodash.get';

import {
	receiveSites,
	setActiveSiteId,
	fetchSiteData,
	receiveSiteData,
	fetchSiteDataFromBackupEndpoint,
	setRefreshTimer,
	addSiteToNoSelfEndpointList,
	setSitesWithNoSelfEndpoint,
	setShouldRefresh
} from './actions';
import {
	getAllSiteData,
	getSites,
	getSite,
	getActiveSiteId,
	getSitesWithNoSelfEndpoint,
	siteHasNoSelfEndpoint
} from './selectors';

const SITES_REST_PATH = 'johnwatkins/v1/site-stats/';

const effects = {
	START_FETCHING_SITES: async( action, { dispatch }) => {
		const excludeParam = action.excludedSites ?
			`?exclude=${action.excludedSites}` :
			'';
		const root = get( global, [ 'wpApiSettings', 'root' ], false );
		const response = await fetch( `${root}${SITES_REST_PATH}${excludeParam}` );
		const sites = await response.json();
		dispatch( receiveSites( sites ) );
	},

	// Set the initial active site to the first in the list.
	RECEIVE_SITES: ( action, { getState, dispatch }) => {
		const sites = getSites( getState() );
		dispatch( setActiveSiteId( sites[0].id ) );
	},

	SET_ACTIVE_SITE_ID: ( action, { dispatch }) => {
		dispatch( fetchSiteData( action.siteId ) );
	},

	FETCH_SITE_DATA: async( action, { getState, dispatch }) => {
		const state = getState();

		if ( siteHasNoSelfEndpoint( state, action.siteId ) ) {
			dispatch( fetchSiteDataFromBackupEndpoint( action.siteId ) );
			return;
		}

		const { domain, path } = getSite( state, action.siteId );
		const url = `//${domain}${path}wp-json/${SITES_REST_PATH}self`;
		let response;

		// Fetch from the site's own endpoint to prevent calls to switch_to_blog.
		// This requires that this plugin be active on that site. If the plugin is
		// not active, the backup fetch function (which doesn't require this plugin
		// to be active) is dispatched.
		// TO-DO: Remember failures and don't run the same request again.
		try {
			response = await fetch( url );
		} catch ( e ) {
			if ( 'Failed to fetch' === e.message ) {
				dispatch( setShouldRefresh( false ) );
			}
			return;
		}

		if ( ! response.ok && 'Not Found' === response.statusText ) {
			dispatch( addSiteToNoSelfEndpointList( action.siteId ) );
			dispatch( fetchSiteDataFromBackupEndpoint( action.siteId ) );
			return;
		}

		const data = await response.json();

		dispatch( receiveSiteData({
			...getAllSiteData( state ),
			[action.siteId]: data
		}) );
	},

	FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT: async( action, { getState, dispatch }) => {
		const root = get( global, [ 'wpApiSettings', 'root' ], false );
		const url = `${root}${SITES_REST_PATH}${action.siteId}`;
		let response;

		// Try to fetch from a site where this plugin may not be activated.
		try {
			response = await fetch( url );
		} catch ( e ) {
			if ( 'Failed to fetch' === e.message ) {
				dispatch( setShouldRefresh( false ) );
			}
			return;
		}

		if ( ! response.ok ) {

			// Give up if a backup fetch fails.
			// TO-DO: A more fine-tuned way to handle this.
			dispatch( setShouldRefresh( false ) );
			return;
		}

		const data = await response.json();
		dispatch( receiveSiteData({
			...getAllSiteData( getState() ),
			[action.siteId]: data
		}) );
	},

	SET_REFRESH_TIMER: ( action, { getState, dispatch }) => {
		if ( 1 > action.secondsToRefresh ) {
			dispatch( fetchSiteData( getActiveSiteId( getState() ) ) );
		}
	},

	ADD_SITE_TO_NO_SELF_ENDPOINT_LIST: ( action, { getState, dispatch }) => {
		const sites = getSitesWithNoSelfEndpoint( getState() );

		if ( -1 === sites.indexOf( action.siteId ) ) {
			dispatch( setSitesWithNoSelfEndpoint( sites.concat([ action.siteId ]) ) );
		}
	}
};

export default effects;
