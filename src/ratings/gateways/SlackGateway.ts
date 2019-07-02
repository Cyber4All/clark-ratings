import { reportError } from '../../drivers/SentryConnector';
import * as request from 'request-promise';
import { RatingNotifier } from '../interfaces/RatingNotifier';

const slackURI = process.env.SLACK_URI;
const nodeEnv = process.env.NODE_ENV;

const url = 'https://hooks.slack.com/services/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';

export class SlackGateway implements RatingNotifier {

    private initializePayload(ratingAuthor: string, ratingComment: string, loName: string, loAuthor: string) {
        return {
            text: 'A rating has been created.',
            attachments: [
                {
                    // 'fallback': `<https://clark.center/details/${encodeURIComponent(loAuthor)}/${encodeURIComponent(loName)}|View Rating>`,
                    'pretext': `<http://localhost:4200/details/${encodeURIComponent(loAuthor)}/${encodeURIComponent(loName)}|View Rating>`,
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

    async sendRatingNotification(ratingAuthor: string, ratingComment: string, loName: string, loAuthor: string) {
        // if (nodeEnv === 'production') {
            try {
                const options = {
                    // uri: slackURI,
                    uri: url,
                    json: true,
                    body: this.initializePayload(ratingAuthor, ratingComment, loName, loAuthor),
                    method: 'POST',
                };
                await request(options);
            } catch (error) {
                reportError(error);
            }
        // } else {
        //     console.log('Sent to Slack');
        // }
    }
}
