import React from 'react';

import { AppContext } from '../Context';

const SiteSelector = () => (
	<AppContext.Consumer>
		{ ({ activeSiteId, sites, setActiveSite }) => (
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
