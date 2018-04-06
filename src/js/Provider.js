/* eslint camelcase: 0 */
import React from 'react';
import get from 'lodash.get';

import SiteStats from './SiteStats';

import { setActiveSiteId, setRefreshTimer } from './store/actions';
import effects from './store/effects';
import reducer from './store/reducer';
import { getSecondsToRefresh } from './store/selectors';
import { REFRESH_SECONDS } from './constants';
import { AppContext, ActiveSiteContext } from './Context';

class Provider extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			sites: props.sites,
			secondsToRefresh: REFRESH_SECONDS,
			siteData: {
				'0': {
					site_title: '',
					site_url: '',
					latest_post: null,
					latest_comment: null
				}
			},
			activeSiteId: '0',
			shouldRefresh: true
		};
		this.getState = this.getState.bind( this );
		this.dispatch = this.dispatch.bind( this );
		this.setActiveSiteId = this.setActiveSiteId.bind( this );
		this.tick = this.tick.bind( this );
	}

	componentDidMount() {
		this.dispatch( setActiveSiteId( this.props.sites[0].id ) );
		this.startTicker();
	}

	componentWillUpdate( prevProps, nextState ) {
		this.maybeStopTicker( nextState );
	}

	getState() {
		return Object.assign({}, this.state );
	}

	setActiveSiteId( siteId ) {
		this.dispatch( setActiveSiteId( siteId ) );
	}

	dispatch( action )  {
		this.setState(
			( state ) => reducer( state, action ),
			() => this.triggerEffect( action )
		);
	}

	triggerEffect( action ) {
		if ( action.type in effects ) {
			effects[action.type](
				action,
				{
					dispatch: this.dispatch,
					getState: this.getState
				}
			);
		}
	}

	startTicker() {
		this.ticker = setInterval( this.tick, 1000 );
	}

	tick() {
		this.dispatch(
			setRefreshTimer( getSecondsToRefresh( this.getState() ) - 1 )
		);
	}

	maybeStopTicker( nextState ) {
		if ( false !== this.props.shouldRefresh && false === nextState.shouldRefresh ) {
			clearInterval( this.ticker );
		}
	}

	render() {
		const state = this.getState();

		const appValue = {
			...state,
			setActiveSite: this.setActiveSiteId
		};

		const activeSiteValue = {
			...state.siteData[state.activeSiteId],
			activeSiteCreatedDate: state.activeSiteCreatedDate
		};

		return (
			<AppContext.Provider value={appValue}>
				<ActiveSiteContext.Provider value={ activeSiteValue } >
					<SiteStats />
				</ActiveSiteContext.Provider>
			</AppContext.Provider>
		);
	}
}

export default Provider;
