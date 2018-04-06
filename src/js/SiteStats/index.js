import React from 'react';
import get from 'lodash';

import MainPane from './MainPane';
import SiteSelector from './SiteSelector';

import { AppContext } from '../Context';

const SiteStats = ({ setActiveSiteId }) => (
	<div className="SiteStats">
		<div className="SiteStats__header">
			<h1>Site Stats</h1>
			<AppContext.Consumer>
				{({ sites, activeSiteId }) => (
					<SiteSelector
						sites={sites}
						activeSiteId={activeSiteId}
						setActiveSite={setActiveSiteId}
					/>
				)}
			</AppContext.Consumer>
		</div>
		<div className="SiteStats__body">
			<MainPane />
		</div>
	</div>
);

export default SiteStats;
