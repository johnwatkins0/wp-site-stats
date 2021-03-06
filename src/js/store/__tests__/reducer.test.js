import reducer from '../reducer';

import sites from '../../test-data/sites.json';
import siteData from '../../test-data/activeSite.json';

describe( 'reducer', () => {
	it ( 'handles nonmatching action', () => {
		expect(
			reducer(
				{ foo: 'bar' },
				{ type: 'SOME_NONMATCHING_ACTION' }
			)
		).toMatchObject({ foo: 'bar' });
	});

	it ( 'handles no parameters', () => {
		expect(
			reducer()
		).toMatchObject({});
	});

	it( 'handles SET_ACTIVE_SITE_ID', () => {
		expect(
			reducer(
				{ siteId: 555 },
				{
					type: 'SET_ACTIVE_SITE_ID',
					siteId: 666
				}
			)
		).toMatchObject(
			{
				app: {
					activeSiteId: 666
				}
			}
		);
	});

	it( 'handles RECEIVE_SITE_DATA', () => {
		expect(
			reducer(
				{},
				{
					type: 'RECEIVE_SITE_DATA',
					data: siteData
				}
			)
		).toMatchObject({ siteData });
	});

	it( 'handles SET_REFRESH_TIMER', () => {
		expect(
			reducer(
				{},
				{
					type: 'SET_REFRESH_TIMER',
					secondsToRefresh: 45
				}
			)
		).toMatchObject({
			app: {
				secondsToRefresh: 45
			}
		});
	});

	it( 'handles SET_SITES_WITH_NO_SELF_ENDPOINT', () => {
		expect(
			reducer(
				{},
				{
					type: 'SET_SITES_WITH_NO_SELF_ENDPOINT',
					noSelfEndpointSites: [ 4, 5, 77 ]
				}
			)
		).toMatchObject({
			app: {
				noSelfEndpointSites: [ 4, 5, 77 ]
			}
		});
	});

	it ( 'handles SET_SHOULD_REFRESH', () => {
		expect(
			reducer(
				{},
				{
					type: 'SET_SHOULD_REFRESH',
					shouldRefresh: true
				}
			)
		).toMatchObject({
			app: {
				shouldRefresh: true
			}
		});
	});
});
