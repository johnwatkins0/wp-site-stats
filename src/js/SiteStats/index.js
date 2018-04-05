import React from 'react';

import SiteStats from './SiteStats';

import { setActiveSiteId } from '../store/actions';
import {
	getSites,
	getSiteData,
	getActiveSiteId,
	getSiteCreatedDate,
	getSecondsToRefresh,
	getShouldRefresh
} from '../store/selectors';

const mapStateToProps = ( state ) => {
	const activeSiteId = getActiveSiteId( state );
	return {
		sites: getSites( state ),
		activeSiteId,
		activeSite: getSiteData( state, activeSiteId ),
		activeSiteCreatedDate: getSiteCreatedDate( state, activeSiteId ),
		secondsToRefresh: getSecondsToRefresh( state ),
		shouldRefresh: getShouldRefresh( state )
	};
};

const mapDispatchToProps = ( dispatch ) => ({
	setActiveSite: ( siteId ) => dispatch( setActiveSiteId( siteId ) )
});

const ConnectedSiteStats = ({ state, dispatch }) => (
	<SiteStats
		{...mapStateToProps( state )}
		{...mapDispatchToProps( dispatch )}
	/>
);

export default ConnectedSiteStats;
