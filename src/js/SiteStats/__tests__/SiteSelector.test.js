import React from 'react';
import renderer from 'react-test-renderer';

import SiteSelector from '../SiteSelector';

import sites from '../../test-data/sites.json';
import activeSite from '../../test-data/activeSite.json';

test( 'SiteSelector component', () => {
	const tree = renderer.create(
		<SiteSelector
			sites={sites}
			activeSiteId={activeSite.id}
			setActiveSiteId={( id ) => noop}
		/>
	).toJSON();
	expect( tree ).toMatchSnapshot();
});
