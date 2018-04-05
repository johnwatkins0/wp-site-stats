/* eslint camelcase: 0 */
import React from 'react';
import format from 'date-fns/format';
import get from 'lodash.get';


export const getCommentExcerpt = ( comment ) => {
	const words = comment.split( ' ' );
	if ( 15 > words.length ) {
		return words.join( ' ' );
	}

	return `${words.slice( 0, 15 ).join( ' ' )} ...`;
};

export const Header = ({ site_title, site_url, activeSiteCreatedDate }) => (
	<header className="MainPane__header">
		<h2 dangerouslySetInnerHTML={ { __html: site_title || '&nbsp;' } } />
		<div className="MainPane__site-info">
			<div>
				<span className="MainPane__site-info-key">
					URL:
				</span>
				{' '}
				<a href={site_url}>
					{site_url}
				</a>
			</div>
			<div>
				<span className="MainPane__site-info-key">
					Created:
				</span>
				{' '}
				{format( activeSiteCreatedDate, 'MMMM D, YYYY' )}
			</div>
		</div>
	</header>
);

export const Stat = ({ title, number = '' }) => (
	<div className="MainPane__stat-container">
		<div className="MainPane__stat">
			<h4 className="MainPane__stat-title">
				{title}
			</h4>
			<div className="MainPane__stat-number">
				{number}
			</div>
		</div>
	</div>
);

export const Stats = ({ post_count, page_count, user_count, comment_count })  => (
	<section className="MainPane__section">
		<h3>By the Numbers</h3>
		<div  className="MainPane__stats">
			<Stat title="Posts" number={get( post_count, 'publish', '-' )} />
			<Stat title="Pages" number={get( page_count, 'publish', '-' )} />
			<Stat title="Users" number={user_count || '-'} />
			<Stat title="Comments" number={get( comment_count, 'approved', '-' )} />
		</div>
	</section>
);

export const LatestPost = ({ link, title = '' }) => (
	<section className="MainPane__section MainPane__latest-post">
		<h3>
			Latest Post
		</h3>
		<div className="MainPane__latest-post-link">
			<a
				href={link}
				dangerouslySetInnerHTML={
					{
						__html: title.rendered || '(no title)'
					}
				}
			/>
		</div>
	</section>
);

export const LatestComment = ({ link, author_name = '', date }) => (
	<section className="MainPane__section MainPane__latest-comment">
		<h3>
			Latest Comment
		</h3>
		<div className="MainPane__latest-comment-link">
			<a href={link}>
				{
					`${author_name} 
					on ${format( date, 'MMMM D, YYYY' )}
					at ${format( date, 'h:mm aa' )}`
				}
			</a>
		</div>
	</section>
);

export const Footer = ({ shouldRefresh, secondsToRefresh }) => {
	if ( ! shouldRefresh ) {
		return null;
	}

	return (
		<footer className="MainPane__footer">
			Refreshing in {secondsToRefresh} second{1 === secondsToRefresh ? '' : 's'}.
		</footer>
	);
};

const MainPane = ({
	site_title = '&nbsp;',
	site_url,
	user_count,
	post_count,
	page_count,
	latest_post,
	latest_comment,
	comment_count,
	activeSiteCreatedDate,
	secondsToRefresh,
	shouldRefresh
}) => (
	<article className="MainPane">
		<Header { ...{ site_title, site_url, activeSiteCreatedDate } } />
		<Stats { ...{ post_count, page_count, user_count, comment_count } } />
		<LatestPost { ...latest_post } />
		<LatestComment { ...latest_comment } />
		<Footer { ...{ shouldRefresh, secondsToRefresh } } />
	</article>
);

export default MainPane;
