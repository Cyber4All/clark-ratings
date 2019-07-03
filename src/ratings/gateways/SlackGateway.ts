import { reportError } from '../../drivers/SentryConnector';
import * as request from 'request-promise';
import { RatingNotifier } from '../interfaces/RatingNotifier';

const slackURI = process.env.SLACK_URI;
const nodeEnv = process.env.NODE_ENV;

export class SlackGateway implements RatingNotifier {

    /**
     * Structures the body of the message sent to slack
     *
     * @param ratingAuthor [the username of the creator of the rating]
     * @param ratingComment [the comment that was left with the rating]
     * @param loName [the name of the learning object]
     * @param loAuthor [the username of the user that created the learning object]
     */
    private initializePayload(ratingAuthor: string, ratingComment: string, loName: string, loAuthor: string) {
        return {
            text: 'A rating has been created.',
            attachments: [
                {
                    'fallback': `<https://clark.center/details/${encodeURIComponent(loAuthor)}/${encodeURIComponent(loName)}|View Rating>`,
                    'pretext': `<https://clark.center/details/${encodeURIComponent(loAuthor)}/${encodeURIComponent(loName)}|View Rating>`,
                    'color': '#0000ff',
                    'fields': [
                        {
                            'title': `Created by ${ratingAuthor}`,
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
     *
     * @param ratingAuthor [the username of the user that created the rating]
     * @param ratingComment [the comment that was left with the rating]
     * @param loName [the name of the learning object]
     * @param loAuthor [the username of the user that created the learning object]
     */
    async sendRatingNotification(ratingAuthor: string, ratingComment: string, loName: string, loAuthor: string) {
        if (nodeEnv === 'production') {
            try {
                const options = {
                    uri: slackURI,
                    json: true,
                    body: this.initializePayload(ratingAuthor, ratingComment, loName, loAuthor),
                    method: 'POST',
                };
                await request(options);
            } catch (error) {
                reportError(error);
            }
        } else {
            console.log('Sent to Slack');
        }
    }
}
