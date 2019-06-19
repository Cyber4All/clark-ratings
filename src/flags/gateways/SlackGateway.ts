import { reportError } from '../../drivers/SentryConnector';
import * as request from 'request-promise';

const slackURI = process.env.SLACK_URI;

/**
 * Structures the body of the message that is sent to slack.
 * @param username the name of the user who flagged the rating comment
 * @param ratingComment the comment that has been flagged
 * @param loName the name of the learning object
 * @param loAuthor the username of the user who created the learning object
 */
function initializePayload(username: string, ratingComment: string, loName: string, loAuthor: string) {
   return {
        text: 'A rating has been flagged.',
        attachments: [
            {
                'fallback': `<https://clark.center/details/${encodeURIComponent(loAuthor)}/${encodeURIComponent(loName)}|View Rating>`,
                'pretext': `<https://clark.center/details/${encodeURIComponent(loAuthor)}/${encodeURIComponent(loName)}|View Rating>`,
                'color': '#D00000',
                'fields': [
                    {
                        'title': `Flagged by ${username}`,
                        'value': `"${ratingComment}"`,
                        'short': 'true',
                    },
                ],
            },
        ],
    };
}

/**
 * Posts a message on slack when triggered using a post request.
 * @param username the name of the user who flagged the rating comment
 * @param ratingComment the comment that has been flagged
 * @param loName the name of the learning object
 * @param loAuthor the username of the user who created the learning object
 */
export async function sendFlagToSlack(username: string, ratingComment: string, loName: string, loAuthor: string) {
    try {
        const options = {
            uri: slackURI,
            json: true,
            body: initializePayload(username, ratingComment, loName, loAuthor),
            method: 'POST',
        };
        await request(options);
    } catch (error) {
        reportError(error);
    }
}
