import { Request, Response, Router } from 'express';
import { reportError } from '../../drivers/SentryConnector';
import { Flag } from '../../types/Flag';
import { ServiceError, ServiceErrorReason } from '../../errors';
import * as request from 'request-promise';

const url = 'https://hooks.slack.com/services/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';
const payload = { text: 'A comment has been flagged!'};
// post request - username of person who flagged, comment that has been flagged, and link to details page of that learning object.
export async function sendFlagToSlack() {
    try {
        const options = {
            uri: url,
            json: true,
            body: payload,
            method: 'POST',
        };
        await request(options);
    } catch (error) {
        reportError(error);
    }
}
