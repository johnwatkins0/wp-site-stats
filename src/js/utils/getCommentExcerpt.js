/**
 * Returns the first 15 words of a string.
 *
 * @param {string} comment The original comment.
 * @return {string} The modified comment.
 */
export const getCommentExcerpt = ( comment ) => {
	const words = comment.split( ' ' );
	if ( 15 > words.length ) {
		return words.join( ' ' );
	}

	return `${words.slice( 0, 15 ).join( ' ' )} ...`;
};
