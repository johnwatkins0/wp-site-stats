import { getCommentExcerpt } from '../getCommentExcerpt';

test( 'It returns a short comment unchanged', () => {
    const comment = 'A short comment.';

    expect( getCommentExcerpt( comment ) ).toBe( comment );
});


test( 'It returns the first 15 words of a long comment', () => {
    const comment = 'The next time you run the tests, the rendered output will be compared to the previously created snapshot. The snapshot should be committed along code changes. When a snapshot test fails, you need to inspect whether it is an intended or unintended change.';

    expect( getCommentExcerpt( comment ) ).toBe( 'The next time you run the tests, the rendered output will be compared to the ...' );
});
