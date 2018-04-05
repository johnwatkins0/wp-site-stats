import {
	setActiveSiteId,
	fetchSiteData,
	fetchSiteDataFromBackupEndpoint,
	receiveSiteData
} from '../actions';

import sites from '../../test-data/sites.json';
import activeSite from '../../test-data/activeSite.json';

test( 'setActiveSiteId action', () => {
	expect( setActiveSiteId( 55 ) ).toMatchObject({
		type: 'SET_ACTIVE_SITE_ID',
		siteId: 55
	});
});

test( 'fetchSiteData action', () => {
	expect( fetchSiteData( 66 ) ).toMatchObject({
		type: 'FETCH_SITE_DATA',
		siteId: 66
	});
});

test( 'fetchSiteDataFromBackupEndpoint action', () => {
	expect( fetchSiteDataFromBackupEndpoint( 777 ) ).toMatchObject({
		type: 'FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT',
		siteId: 777
	});
});

test( 'receiveSiteData action', () => {
	expect( receiveSiteData( activeSite ) ).toMatchObject({
		type: 'RECEIVE_SITE_DATA',
		data: activeSite
	});
});
