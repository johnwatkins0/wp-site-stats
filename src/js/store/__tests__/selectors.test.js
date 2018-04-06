import {
	getSite,
	getSites,
	getAllSiteData,
	getSiteData,
	getActiveSiteId,
	getSiteCreatedDate,
	getSecondsToRefresh,
	getShouldRefresh
} from '../selectors';

import sites from '../../test-data/sites.json';
import siteData from '../../test-data/activeSite.json';

const mockState = {
	app: {
		sites,
		activeSiteId: sites[0].id,
		shouldRefresh: true,
		secondsToRefresh: 45
	},
	siteData: {
		444: { foo: 'bar' },
		[sites[0].id]: siteData
	}
};

test( 'getSite selector', () => {
	expect(
		getSite( mockState, sites[0].id )
	).toMatchObject( sites[0]);
});

test( 'getSite selector can find nothing', () => {
	expect(
		getSite({}, sites[0].id )
	).toMatchObject({});
});

test( 'getSites selector', () => {
	expect(
		getSites( mockState )
	).toEqual( sites );
});

test( 'getAllSiteData selector', () => {
	expect(
		getAllSiteData( mockState )
	).toMatchObject(
		{
			444: { foo: 'bar' },
			[sites[0].id]: siteData
		}
	);
});

test( 'getActiveSiteId selector', () => {
	expect(
		getActiveSiteId( mockState )
	).toEqual( sites[0].id );
});

test( 'getSiteCreatedDate selector', () => {
	expect(
		getSiteCreatedDate( mockState, sites[0].id )
	).toBe( mockState.app.sites[0].registered );
});

test( 'getSecondsToRefresh selector', () => {
	expect(
		getSecondsToRefresh( mockState )
	).toEqual( 45 );
});

test( 'getShouldRefresh selector', () => {
	expect(
		getShouldRefresh( mockState )
	).toEqual( true );
});


