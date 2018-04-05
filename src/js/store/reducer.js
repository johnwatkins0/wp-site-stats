import { REFRESH_SECONDS } from '../App';

/**
 * Reducer handling all changes to app state.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @return {Object} The next state.
 */
function reducer( state = {}, action = {}) {
	switch ( action.type ) {
		case 'START_FETCHING_SITES': {
			return {
				...state,
				fetchingSites: true
			};
		}

		case 'RECEIVE_SITES': {
			return {
				...state,
				fetchingSites: false,
				sites: action.sites
			};
		}

		case 'SET_ACTIVE_SITE_ID': {
			return {
				...state,
				activeSiteId: action.siteId
			};
		}

		case 'RECEIVE_SITE_DATA': {
			return {
				...state,
				siteData: action.data,
				secondsToRefresh: REFRESH_SECONDS
			};
		}

		case 'SET_REFRESH_TIMER': {
			return {
				...state,
				secondsToRefresh: action.secondsToRefresh
			};
		}

		case 'SET_SITES_WITH_NO_SELF_ENDPOINT': {
			return {
				...state,
				noSelfEndpointSites: action.noSelfEndpointSites
			};
		}

		case 'SET_SHOULD_REFRESH': {
			return {
				...state,
				shouldRefresh: action.shouldRefresh
			};
		}
	}

	return state;
}

export default reducer;
