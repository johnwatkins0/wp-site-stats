import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Provider from '../Provider';

import sites from '../test-data/sites.json';

Enzyme.configure({adapter: new Adapter() });

describe( 'SiteSelector', () => {
    it( 'renders', () => {
        const tree = renderer.create(
            <Provider
                sites={sites}
            />
        ).toJSON();
        expect( tree ).toMatchSnapshot();
    });

    it( 'starts ticking', ( done ) => {
        const wrapper = shallow(
            <Provider
                sites={sites}
            />
        );

        setTimeout( () => {
            expect( wrapper.state().secondsToRefresh ).toEqual( 59 );
            done();
        }, 1001 );
    });

    it( 'can stop ticking', ( done ) => {
        const wrapper = shallow(
            <Provider
                sites={sites}
            />
        );

        wrapper.setState({ shouldRefresh: false });

        setTimeout( () => {
            expect( wrapper.state().secondsToRefresh ).toEqual( 60 );
            done();
        }, 1001 );
    });
})
;
