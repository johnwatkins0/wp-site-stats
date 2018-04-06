import React from 'react';
import get from 'lodash.get';

import SiteStats from './SiteStats';

import { setActiveSiteId, setRefreshTimer } from './store/actions';
import effects from './store/effects';
import reducer from './store/reducer';
import { getSecondsToRefresh } from './store/selectors';
import { REFRESH_SECONDS } from './constants';

export const Context = React.createContext();

class Provider extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			sites: props.sites,
			secondsToRefresh: REFRESH_SECONDS,
			siteData: {
				'0': {}
			},
			setActiveSiteId: '0'
		};
		this.getState = this.getState.bind( this );
		this.dispatch = this.dispatch.bind( this );
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
			<Context.Provider value={this.state}>
				<SiteStats
					setActiveSite={( siteId ) => {
						this.dispatch( setActiveSiteId( siteId ) );
					}}
				/>
			</Context.Provider>
		);
	}
}

export default Provider;
