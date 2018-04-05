import React from 'react';
import renderer from 'react-test-renderer';

import MainPane from '../MainPane';

import activeSite from '../../test-data/activeSite.json';

test( 'MainPane component', () => {
	const tree = renderer.create(
		<MainPane
            {...activeSite}
		/>
	).toJSON();
	expect( tree ).toMatchSnapshot();
});
