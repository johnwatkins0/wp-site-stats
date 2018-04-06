import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import MainPane, { Header } from '../MainPane';

import activeSite from '../../test-data/activeSite.json';

describe( 'MainPane component', () => {
	it ( 'renders correctly', () => {
		const tree = renderer.create(
			<MainPane
				{...activeSite}
				shouldRefresh={true}
			/>
		).toJSON();
		expect( tree ).toMatchSnapshot();
	});

	it ( 'renders correctly with no footer', () => {
		const tree = renderer.create(
			<MainPane
				{...activeSite}
				shouldRefresh={false}
			/>
		).toJSON();
		expect( tree ).toMatchSnapshot();
	});
});

