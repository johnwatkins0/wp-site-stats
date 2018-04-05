import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';

import SiteSelector from '../SiteSelector';

import sites from '../../test-data/sites.json';
import activeSite from '../../test-data/activeSite.json';

Enzyme.configure({adapter: new Adapter() });

describe( 'SiteSelector', () => {
	it( 'renders', () => {
		const tree = renderer.create(
			<SiteSelector
				sites={sites}
				activeSiteId={activeSite.id}
				setActiveSite={( id ) => null}
			/>
		).toJSON();
		expect( tree ).toMatchSnapshot();
	});

	it( 'handles a change', () => {
		const setActiveSite = sinon.spy();

        const wrapper = shallow(
            <SiteSelector
				sites={sites}
				activeSiteId={activeSite.id}
				setActiveSite={setActiveSite}
            />
		);

		const mockChangeEvent = { target: { value: '3' } };

		wrapper.find( 'select' ).simulate( 'change', mockChangeEvent );
		expect( setActiveSite.calledOnce ).toEqual( true );
    });

});
