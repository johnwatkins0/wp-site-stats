import React from 'react';

const SiteSelector = ({ activeSiteId, sites, setActiveSite }) => (
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
);

export default SiteSelector;
