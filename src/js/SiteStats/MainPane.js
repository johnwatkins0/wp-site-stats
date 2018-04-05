/* eslint camelcase: 0 */
import React from 'react';
import format from 'date-fns/format';
import get from 'lodash.get';

const getCommentExcerpt = ( comment ) => {
	const words = comment.split( ' ' );
	if ( 15 > words.length ) {
		return words.join( ' ' );
	}

	return `${words.slice( 0, 15 ).join( ' ' )} ...`;
};

const Stat = ({ title, number }) => (
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

const MainPane = ({
	site_title = '&nbsp;',
	site_url,
	user_count = '-',
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
		<header className="MainPane__header">
			<h2 dangerouslySetInnerHTML={ { __html: site_title } } />
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
		<section className="MainPane__section">
			<h3>By the Numbers</h3>
			<div  className="MainPane__stats">
				<Stat title="Posts" number={get( post_count, 'publish', '-' )} />
				<Stat title="Pages" number={get( page_count, 'publish', '-' )} />
				<Stat title="Users" number={user_count} />
				<Stat title="Comments" number={get( comment_count, 'approved', '-' )} />
			</div>
		</section>
		<section className="MainPane__section MainPane__latest-post">
			<h3>
				Latest Post
			</h3>
			<div className="MainPane__latest-post-link">
				<a
					href={get( latest_post, 'link', '' )}
					dangerouslySetInnerHTML={
						{
							__html: get(
								latest_post, [ 'title', 'rendered' ], '&nbsp'
							) || '(no-title)'
						}
					}
				/>
			</div>
		</section>
		<section className="MainPane__section MainPane__latest-comment">
			<h3>
				Latest Comment
			</h3>
			<div className="MainPane__latest-comment-link">
				<a href={ get( latest_comment, 'link' )}>
					{
						get( latest_comment, 'author_name', false ) &&
						`${latest_comment.author_name} `
					}
					{
						get( latest_comment, 'date', false ) &&
						`on ${format( latest_comment.date, 'MMMM D, YYYY' )}
						at ${format( latest_comment.date, 'h:mm aa' )}`
					}
				</a>
			</div>
		</section>
		{shouldRefresh && <footer className="MainPane__footer">
			Refreshing in {secondsToRefresh} second{1 === secondsToRefresh ? '' : 's'}.
		</footer>}
	</article>
);

export default MainPane;
