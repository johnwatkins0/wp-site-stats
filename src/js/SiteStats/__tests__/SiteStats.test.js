import React from 'react';
import renderer from 'react-test-renderer';

import SiteStats from '../SiteStats';

import sites from '../../test-data/sites.json';
import activeSite from '../../test-data/activeSite.json';

test( 'SiteStats component', () => {
	const tree = renderer.create(
		<SiteStats
			loading={false}
			sites={sites}
			activeSite={activeSite}
			activeSiteId={activeSite.id}
			setActiveSiteId={( id ) => null}
		/>
	).toJSON();
	expect( tree ).toMatchSnapshot();
});
