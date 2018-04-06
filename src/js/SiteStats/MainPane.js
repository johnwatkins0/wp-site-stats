/* eslint camelcase: 0 */
import React from 'react';
import format from 'date-fns/format';
import get from 'lodash.get';

import { ActiveSiteContext, AppContext } from '../Context';

import { getCommentExcerpt } from '../utils/getCommentExcerpt';

export const Header = () => (
	<ActiveSiteContext.Consumer>
		{( site ) => site && (
			<header className="MainPane__header">
				<h2 dangerouslySetInnerHTML={ { __html: site.site_title || '&nbsp;' } } />
				<div className="MainPane__site-info">
					<div>
						<span className="MainPane__site-info-key">
							URL:
						</span>
						{' '}
						<a href={site.site_url}>
							{site.site_url}
						</a>
					</div>
					{site.createdDate && <div>
						<span className="MainPane__site-info-key">
							Created:
						</span>
						{' '}
						{format( site.createdDate, 'MMMM D, YYYY' )}
					</div>}
				</div>
			</header>
		)}
	</ActiveSiteContext.Consumer>
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

export const Stats = ()  => (
	<ActiveSiteContext.Consumer>
		{({ post_count, user_count, page_count, comment_count }) => (
			<section className="MainPane__section">
				<h3>By the Numbers</h3>
				<div  className="MainPane__stats">
					<Stat title="Posts" number={get( post_count, 'publish', '-' )} />
					<Stat title="Pages" number={get( page_count, 'publish', '-' )} />
					<Stat title="Users" number={user_count || '-'} />
					<Stat title="Comments" number={get( comment_count, 'approved', '-' )} />
				</div>
			</section>
		)}
	</ActiveSiteContext.Consumer>
);

export const LatestPost = () => (
	<ActiveSiteContext.Consumer>
		{({ latest_post }) => latest_post && (
			<section className="MainPane__section MainPane__latest-post">
				<h3>
					Latest Post
				</h3>
				<div className="MainPane__latest-post-link">
					<a
						href={latest_post.link}
						dangerouslySetInnerHTML={
							{
								__html: latest_post.title.rendered || '(no title)'
							}
						}
					/>
				</div>
			</section>
		)}
	</ActiveSiteContext.Consumer>
);

export const LatestComment = () => (
	<ActiveSiteContext.Consumer>
		{({ latest_comment }) => latest_comment && (
			<section className="MainPane__section MainPane__latest-comment">
				<h3>
					Latest Comment
				</h3>
				<div className="MainPane__latest-comment-link">
					<a href={latest_comment.link}>
						{
							`${latest_comment.author_name} 
							on ${format( latest_comment.date, 'MMMM D, YYYY' )}
							at ${format( latest_comment.date, 'h:mm aa' )}`
						}
					</a>
				</div>
			</section>
		)}
	</ActiveSiteContext.Consumer>
);

export const Footer = () => (
	<AppContext.Consumer>
		{ ( { shouldRefresh, secondsToRefresh } ) => {
			if ( ! shouldRefresh ) {
				return null;
			}

			return (
				<footer className="MainPane__footer">
					Refreshing in {secondsToRefresh} second{1 === secondsToRefresh ? '' : 's'}.
				</footer>
			);
		}}
	</AppContext.Consumer>
);

const MainPane = () => (
	<article className="MainPane">
		<Header />
		<Stats />
		<LatestPost />
		<LatestComment />
		<Footer />
	</article>
);

export default MainPane;
