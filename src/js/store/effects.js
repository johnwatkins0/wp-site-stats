import get from 'lodash.get';

import {
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
	siteHasNoSelfEndpoint,
	getSiteCreatedDate
} from './selectors';
import { SITES_REST_PATH } from '../constants';

const effects = {

	/**
	 * Refetches site data when a new active site is set.
	 */
	SET_ACTIVE_SITE_ID: ( action, { dispatch }) => {
		dispatch( fetchSiteData( action.siteId ) );
	},

	/**
	 * Dispatches results of site data fetches.
	 */
	FETCH_SITE_DATA: async( action, { getState, dispatch }) => {
		const state = getState();

		if ( siteHasNoSelfEndpoint( state, action.siteId ) ) {

			// This function's fetch has already failed for this site.
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

	/**
	 * Dispatches results of backup site data fetches.
	 */
	FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT: async( action, { getState, dispatch }) => {
		const root = get( global, [ 'wpApiSettings', 'root' ], false );
		const url = `${root}${SITES_REST_PATH}${action.siteId}`;
		let response;

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
		data.createdDate = getSiteCreatedDate( getState(), action.siteId );

		dispatch(
			receiveSiteData({
				...getAllSiteData( getState() ),
				[action.siteId]: data
			})
		);
	},

	/**
	 * Refetches site data if the timer is below one second.
	 */
	SET_REFRESH_TIMER: ( action, { getState, dispatch }) => {
		if ( 1 > action.secondsToRefresh ) {
			dispatch(
				fetchSiteData( getActiveSiteId( getState() ) )
			);
		}
	},

	/**
	 * Add a site to the list of sites with no working `self` REST endpoint.
	 */
	ADD_SITE_TO_NO_SELF_ENDPOINT_LIST: ( action, { getState, dispatch }) => {
		const sites = getSitesWithNoSelfEndpoint( getState() );

		if ( -1 === sites.indexOf( action.siteId ) ) {
			dispatch(
				setSitesWithNoSelfEndpoint(
					sites.concat([ action.siteId ])
				)
			);
		}
	}
};

export default effects;
