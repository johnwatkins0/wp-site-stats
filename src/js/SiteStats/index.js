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
				{( state ) => (
					<SiteSelector
						sites={state.sites}
						activeSiteId={state.activeSiteId}
						setActiveSite={setActiveSiteId}
					/>
				)}
			</Context.Consumer>
		</div>
		<div className="SiteStats__body">
			<Context.Consumer>
				{( state ) => (
					<MainPane
						{...state.siteData[state.activeSiteId]}
						shouldRefresh={state.shouldRefresh}
						secondsToRefresh={state.secondsToRefresh}
					/>
				)}
			</Context.Consumer>
		</div>
	</div>
);

export default SiteStats;
