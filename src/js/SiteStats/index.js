import React from 'react';
import get from 'lodash';

import MainPane from './MainPane';
import SiteSelector from './SiteSelector';

import { Context } from '../Provider';

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
					/>
				)}
			</Context.Consumer>
		</div>
	</div>
);

export default SiteStats;
