import { REFRESH_SECONDS } from '../constants';
import { getSiteCreatedDate } from './selectors';

/**
 * Reducer handling all changes to app state.
 *
 * @param {Object} state Current state.
 * @param {Object} action Action object.
 * @return {Object} The next state.
 */
function reducer( state = {}, action = {}) {
	switch ( action.type ) {
		case 'SET_ACTIVE_SITE_ID': {
			return {
				...state,
				app: {
					...state.app,
					activeSiteId: action.siteId
				}
			};
		}

		case 'RECEIVE_SITE_DATA': {
			return {
				...state,
				app: {
					...state.app,
					secondsToRefresh: REFRESH_SECONDS
				},
				siteData: action.data
			};
		}

		case 'SET_REFRESH_TIMER': {
			return {
				...state,
				app: {
					...state.app,
					secondsToRefresh: action.secondsToRefresh
				}
			};
		}

		case 'SET_SITES_WITH_NO_SELF_ENDPOINT': {
			return {
				...state,
				app: {
					...state.app,
					noSelfEndpointSites: action.noSelfEndpointSites
				}
			};
		}

		case 'SET_SHOULD_REFRESH': {
			return {
				...state,
				app: {
					...state.app,
					shouldRefresh: action.shouldRefresh
				}
			};
		}
	}

	return state;
}

export default reducer;
