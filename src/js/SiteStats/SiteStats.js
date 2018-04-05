import React from 'react';

import MainPane from './MainPane';
import SiteSelector from './SiteSelector';

const SiteStats = ({
	sites,
	activeSiteId,
	activeSite,
	setActiveSite,
	activeSiteCreatedDate,
	secondsToRefresh,
	shouldRefresh
}) => (
	<div className="SiteStats">
		<div className="SiteStats__header">
			<h1>Site Stats</h1>
			{0 < sites.length && <SiteSelector
				sites={sites}
				activeSiteId={activeSiteId}
				setActiveSite={setActiveSite}
			/>}
		</div>
		<div className="SiteStats__body">
			<MainPane
				{...activeSite}
				activeSiteCreatedDate={activeSiteCreatedDate}
				shouldRefresh={shouldRefresh}
				secondsToRefresh={secondsToRefresh}
			/>
		</div>
	</div>
);

export default SiteStats;
