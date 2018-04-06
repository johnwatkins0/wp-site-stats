import React from 'react';
import get from 'lodash';

import MainPane from './MainPane';
import SiteSelector from './SiteSelector';

import Context from '../Context';

const SiteStats = ({ setActiveSiteId }) => (
	<div className="SiteStats">
		<div className="SiteStats__header">
			<h1>Site Stats</h1>
			<Context.Consumer>
				{({ sites, activeSiteId }) => (
					<SiteSelector
						sites={sites}
						activeSiteId={activeSiteId}
						setActiveSite={setActiveSiteId}
					/>
				)}
			</Context.Consumer>
		</div>
		<div className="SiteStats__body">
			<Context.Consumer>
				{({
					siteData,
					activeSiteId,
					shouldRefresh,
					secondsToRefresh,
					activeSiteCreatedDate
					}) => (
					<MainPane
						{...siteData[activeSiteId]}
						shouldRefresh={shouldRefresh}
						secondsToRefresh={secondsToRefresh}
						activeSiteCreatedDate={activeSiteCreatedDate}
					/>
				)}
			</Context.Consumer>
		</div>
	</div>
);

export default SiteStats;
