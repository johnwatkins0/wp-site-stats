import React from 'react';

import MainPane from './MainPane';
import SiteSelector from './SiteSelector';

const SiteStats = ({ setActiveSite }) => (
	<div className="SiteStats">
		<div className="SiteStats__header">
			<h1>Site Stats</h1>
			<SiteSelector setActiveSite={ setActiveSite } />
		</div>
		<div className="SiteStats__body">
			<MainPane />
		</div>
	</div>
);

export default SiteStats;
