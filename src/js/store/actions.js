/**
 * Returns an action object indicating an active site ID is being set.
 *
 * @param {number} siteId A site ID.
 * @return {Object} An action object.
 */
export const setActiveSiteId = ( siteId )  => ({
	type: 'SET_ACTIVE_SITE_ID',
	siteId
});

/**
 * Returns an action object indicating a site's data is being fetched.
 *
 * @param {number} siteId A site ID.
 * @return {Object} An action object.
 */
export const fetchSiteData = ( siteId )=> ({
	type: 'FETCH_SITE_DATA',
	siteId
});

/**
 * Returns an action object indicating a site's data has been received.
 *
 * @param {Object} data Site data.
 * @return {Object} An action object.
 */
export const receiveSiteData = ( data ) => ({
	type: 'RECEIVE_SITE_DATA',
	data
});

/**
 * Returns an action object indicating a site's data is being fetched.
 *
 * @param {number} siteId A site ID.
 * @return {Object} An action object.
 */
export const fetchSiteDataFromBackupEndpoint = ( siteId )=> ({
	type: 'FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT',
	siteId
});

/**
 * Returns an action object indicating whether data should keep refreshing.
 *
 * @param {boolean} shouldRefresh Yes or no.
 * @return {Object} An action object.
 */
export const setShouldRefresh = ( shouldRefresh ) => ({
	type: 'SET_SHOULD_REFRESH',
	shouldRefresh
});

/**
 * Sets the number of seconds until the next refresh.
 *
 * @param {number} secondsToRefresh The number of seconds until a refresh.
 * @return {Object} An action object.
 */
export const setRefreshTimer = ( secondsToRefresh ) => ({
	type: 'SET_REFRESH_TIMER',
	secondsToRefresh
});

/**
 * Add a site to the list of sites whose self endpoints failed.
 *
 * @param {string|number} siteId A numeric site ID.
 * @return {Object} An action object.
 */
export const addSiteToNoSelfEndpointList = ( siteId ) => ({
	type: 'ADD_SITE_TO_NO_SELF_ENDPOINT_LIST',
	siteId
});

/**
 * Sets the array of sites whose self endpoint failed.
 *
 * @param {array} sites A list of site IDS.
 * @return {Object} An action object.
 */
export const setSitesWithNoSelfEndpoint = ( sites ) => ({
	type: 'SET_SITES_WITH_NO_SELF_ENDPOINT',
	noSelfEndpointSites: sites
});
