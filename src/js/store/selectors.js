import get from 'lodash.get';
import find from 'lodash.find';

/**
 * Gets a site from the state object.
 *
 * @param {Object} state A state object.
 * @param {number|string} siteId A numeric site ID.
 * @return {Object|undefined} The found site or undefined.
 */
export const getSite = ( state, siteId ) =>
	find( get( state, [ 'app', 'sites' ], []), { id: siteId }) || {};

/**
 * Gets the sites array.
 *
 * @param {Object} state A state object.
 * @return {array} The sites.
 */
export const getSites = ( state ) =>
	get( state, [ 'app', 'sites' ], []);

/**
 * Gets the object holding saved site data.
 *
 * @param {Object} state A state object.
 * @return {Object} The saved site data.
 */
export const getAllSiteData = ( state ) =>
	get( state, 'siteData', {});

/**
 * Gets the ID of the currently active site.
 *
 * @param {Object} state A state object.
 * @return {number} The active site ID.
 */
export const getActiveSiteId = ( state ) =>
	get( state, [ 'app', 'activeSiteId' ], 0 );

/**
 * Gets the date a site was created.
 *
 * @param {Object} state A state object.
 * @param {number} siteId A site ID.
 * @return {string|null} The date or null.
 */
export const getSiteCreatedDate = ( state, siteId ) =>
	get( getSite( state, siteId ), 'registered', null );

/**
 * Gets the list of sites whose self end point has failed.
 *
 * @param {Object} state A state object.
 * @return {array} The list of sites.
 */
export const getSitesWithNoSelfEndpoint = ( state ) =>
	get( state, [ 'app', 'noSelfEndpointSites' ], []);

/**
 * Returns whether a site is known to have no self endpoint.
 *
 * @param {Object} state A state object.
 * @param {number|string} siteId A site ID.
 * @return {bool} Whether the site is in the no-self-endpoint list.
 */
export const siteHasNoSelfEndpoint = ( state, siteId ) =>
	-1 < getSitesWithNoSelfEndpoint( state ).indexOf( siteId );

/**
 * Returns the number of seconds until the active site autorefreshes.
 *
 * @param {Object} state A state object.
 * @return The number of seconds.
 */
export const getSecondsToRefresh = ( state ) =>
	get( state, [ 'app', 'secondsToRefresh' ]);


/**
 * Returns whether the app should keep refreshing data.
 *
 * @param {Object} state A state object.
 * @return {bool} Yes or no.
 */
export const getShouldRefresh = ( state ) =>
	get( state, [ 'app', 'shouldRefresh' ], true );
