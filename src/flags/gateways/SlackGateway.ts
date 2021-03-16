import { reportError } from '../../drivers/SentryConnector';
import { FlagNotifier } from '../interfaces/FlagNotifier';

const fetch = require('node-fetch');

const slackURI = process.env.SLACK_URI;
const nodeEnv = process.env.NODE_ENV;

export class SlackGateway implements FlagNotifier {

    /**
     * Structures the body of the message that is sent to slack.
     * @param username the name of the user who flagged the rating comment
     * @param ratingComment the comment that has been flagged
     * @param loName the name of the learning object
     * @param loAuthor the username of the user who created the learning object
     */
    private initializePayload(username: string, ratingComment: string, loName: string, loAuthor: string) {
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
    async sendFlagNotification(username: string, ratingComment: string, loName: string, loAuthor: string) {
        if (nodeEnv === 'production') {
            try {
                const options = {
                    uri: slackURI,
                    body: JSON.stringify(this.initializePayload(username, ratingComment, loName, loAuthor)),
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                };
                await fetch(options.uri, options);
            } catch (error) {
                reportError(error);
            }
        } else {
            console.log('Sent to Slack');
        }
    }
}
