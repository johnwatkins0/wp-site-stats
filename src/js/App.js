import React, { Component, createContext } from 'react';

import SiteStats from './SiteStats';

import { fetchSites, setRefreshTimer } from './store/actions';
import effects from './store/effects';
import reducer from './store/reducer';

export const REFRESH_SECONDS = 60;
const { Provider, Consumer } = createContext();

class App extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			loading: true,
			sites: [],
			secondsToRefresh: REFRESH_SECONDS
		};
		this.dispatch = this.dispatch.bind( this );
		this.tick = this.tick.bind( this );
	}

	componentDidMount() {
		this.dispatch( fetchSites( this.props.excludedSites ) );
		this.startTicker();
	}

	componentWillUpdate( prevProps, nextState ) {
		this.maybeStopTicker( nextState );
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
					getState: () => Object.assign({}, this.state )
				}
			);
		}
	}

	startTicker() {
		this.ticker = setInterval( this.tick, 1000 );
	}

	tick() {
		this.dispatch(
			setRefreshTimer( this.state.secondsToRefresh - 1 )
		);
	}

	maybeStopTicker( nextState ) {
		if ( false !== this.props.shouldRefresh && false === nextState.shouldRefresh ) {
			clearInterval( this.ticker );
		}
	}

	render() {
		return (
			<Provider value={this.state}>
				<Consumer>
					{( state ) => (
						<SiteStats
							state={state}
							dispatch={this.dispatch}
						/>
					)}
				</Consumer>
			</Provider>
		);
	}
}

export default App;
