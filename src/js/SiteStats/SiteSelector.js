import React from 'react';

import { AppContext } from '../Context';

const SiteSelector = ({ setActiveSite }) => (
	<AppContext.Consumer>
		{ ({ activeSiteId, sites }) => (
			<label>
				Sites:{' '}
				<select
					className="SiteSelector"
					value={activeSiteId}
					onChange={event => {
						setActiveSite( event.target.value );
					}}
				>

					{sites.map( ({ id, domain, path }) => (
						<option
							key={id}
							value={id}
						>
							{`${domain}${path}`}
						</option>
					) )}
				</select>
			</label>
		)}
	</AppContext.Consumer>
);

export default SiteSelector;
