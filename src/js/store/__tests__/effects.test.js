import set from 'lodash.set';

import effects from '../effects';
import {
	receiveSites,
	setActiveSiteId,
	fetchSiteData,
	receiveSiteData,
	fetchSiteDataFromBackupEndpoint,
	setSitesWithNoSelfEndpoint
} from '../actions';
import sites from '../../test-data/sites.json';
import siteData from '../../test-data/activeSite.json';

const mockFetchResponse = ( jsonData ) => ({
	json: () => new Promise( ( resolve ) => {
		resolve( jsonData );
	}),
	ok: true
});

const getFetchMock = ( data ) => () => new Promise( ( resolve ) => {
	resolve( mockFetchResponse( data ) );
});

const mockNonOkFetchResponse = () => ({
	ok: false
});

const getNonOkFetchMock = () => () => new Promise( ( resolve ) => {
	resolve( mockNonOkFetchResponse() );
});

const getErrorFetchMock = () => () => new Promise( ( resolve, reject ) => {
	reject({
		message: 'Failed to fetch'
	});
});

describe( 'effects', () => {
	describe( 'SET_ACTIVE_SITE_ID', () => {
		it( 'initiates refetching of data', () => {
			const dispatch = jest.fn();

			effects.SET_ACTIVE_SITE_ID(
				{ siteId: sites[0].id },
				{ dispatch }
			);

			expect( dispatch )
				.toHaveBeenCalledWith({
					type: 'FETCH_SITE_DATA',
					siteId: sites[0].id
				});
		});
	});

	describe( 'FETCH_SITE_DATA', () => {
		const action = { siteId: sites[0].id };
		const state = { sites };

		it ( 'should receive data from a `self` endpoint', async() => {
			const fetchMock = getFetchMock( siteData );
			set( global, 'fetch', fetchMock );
			set( global, 'wpApiSettings', {});

			const dispatch = jest.fn();
			effects.FETCH_SITE_DATA(
				action,
				{
					dispatch,
					getState: () => state
				}
			);

			const response = await fetchMock();
			const receivedData = await response.json();

			expect( dispatch ).toHaveBeenCalledWith(
				receiveSiteData({
					[action.siteId]: receivedData
				})
			);
		});

		it( 'should handle a non-ok request', async() => {
			const goodFetchMock = getFetchMock( siteData );
			const badFetchMock = () => new Promise( ( resolve ) => {
				resolve({ ok: false, statusText: 'Not Found' });
			});
			set( global, 'fetch', badFetchMock );
			set( global, 'wpApiSettings', {});

			const dispatch = jest.fn();
			const backupFetch = jest.fn();
			effects.FETCH_SITE_DATA(
				action,
				{
					dispatch,
					getState: () => state
				}
			);

			const response = await badFetchMock();
			expect( dispatch ).toHaveBeenCalledWith(
				fetchSiteDataFromBackupEndpoint( action.siteId )
			);
		});

		it( 'should handle a site already found to be non-ok', async() => {
			const dispatch = jest.fn();
			const backupFetch = jest.fn();
			effects.FETCH_SITE_DATA(
				action,
				{
					dispatch,
					getState: () => ({
						app: {
							noSelfEndpointSites: [ sites[0].id ]
						}
					})
				}
			);

			expect( dispatch ).toHaveBeenCalledWith({
				type: 'FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT',
				siteId: sites[0].id
			});
		});

		it( 'should handle a failed fetch', async() => {
			const fetchMock = getErrorFetchMock( siteData );
			set( global, 'fetch', fetchMock );
			set( global, 'wpApiSettings', {});

			const dispatch = jest.fn();

			effects.FETCH_SITE_DATA(
				action,
				{
					dispatch,
					getState: () => state
				}
			);

			try {
				const response = await fetchMock();
			} catch ( e ) {}

			expect( dispatch ).toHaveBeenCalledWith({
				type: 'SET_SHOULD_REFRESH',
				shouldRefresh: false
			});
		});
	});

	describe( 'FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT', () => {
		const action = { siteId: sites[0].id };
		const state = { sites };

		it( 'should receive data from a backup endpoint', async() => {
			const fetchMock = getFetchMock( siteData );
			set( global, 'fetch', fetchMock );
			set( global, 'wpApiSettings', {});

			const dispatch = jest.fn();
			effects.FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT(
				action,
				{
					dispatch,
					getState: () => state
				}
			);

			const response = await fetchMock();
			const receivedData = await response.json();

			expect( dispatch ).toHaveBeenCalledWith(
				receiveSiteData({
					[action.siteId]: receivedData
				})
			);
		});

		it( 'should handle a non-ok response', async() => {
			const fetchMock = getNonOkFetchMock( siteData );
			set( global, 'fetch', fetchMock );
			set( global, 'wpApiSettings', {});

			const dispatch = jest.fn();

			effects.FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT(
				action,
				{
					dispatch,
					getState: () => state
				}
			);

			const response = await fetchMock();
			expect( dispatch ).toHaveBeenCalledWith({
				type: 'SET_SHOULD_REFRESH',
				shouldRefresh: false
			});
		});

		it( 'should handle a failed fetch', async() => {
			const fetchMock = getErrorFetchMock( siteData );
			set( global, 'fetch', fetchMock );
			set( global, 'wpApiSettings', {});

			const dispatch = jest.fn();

			effects.FETCH_SITE_DATA_FROM_BACKUP_ENDPOINT(
				action,
				{
					dispatch,
					getState: () => state
				}
			);

			try {
				const response = await fetchMock();
			} catch ( e ) {}

			expect( dispatch ).toHaveBeenCalledWith({
				type: 'SET_SHOULD_REFRESH',
				shouldRefresh: false
			});
		});
	});

	describe( 'SET_REFRESH_TIMER', () => {
		it( 'should initiate a refetch', () => {
			const dispatch = jest.fn();

			effects.SET_REFRESH_TIMER(
				{ secondsToRefresh: 0 },
				{
					dispatch,
					getState: () => ({
						app: {
							activeSiteId: '1'
						}
					})
				}
			);

			expect( dispatch ).toHaveBeenCalledWith({
				type: 'FETCH_SITE_DATA',
				siteId: '1'
			});
		});
	});

	describe( 'ADD_SITE_TO_NO_SELF_ENDPOINT_LIST', () => {
		it( 'should add a site to the list', () => {
			const dispatch = jest.fn();

			effects.ADD_SITE_TO_NO_SELF_ENDPOINT_LIST(
				{ siteId: sites[0].id },
				{
					dispatch,
					getState: () => ({
						app: {
							noSelfEndpointSites: [ 44 ]
						}
					})
				}
			);

			expect( dispatch )
				.toHaveBeenCalledWith(
					setSitesWithNoSelfEndpoint([ 44, sites[0].id ])
				);
		});
	});
});

