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

const DEFAULT_SITE_DATA = {
	site_title: '',
	site_url: '',
	latest_post: null,
	latest_comment: null
};

class Provider extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			app: {
				sites: props.sites,
				secondsToRefresh: REFRESH_SECONDS,
				activeSiteId: '0',
				shouldRefresh: true
			},
			siteData: {
				'0': DEFAULT_SITE_DATA
			}
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
		return (
			<AppContext.Provider value={ this.state.app }>
				<ActiveSiteContext.Provider
					value={ this.state.siteData[this.state.app.activeSiteId] ||
						DEFAULT_SITE_DATA }
				>
					<SiteStats setActiveSite={this.setActiveSiteId} />
				</ActiveSiteContext.Provider>
			</AppContext.Provider>
		);
	}
}

export default Provider;
