import * as sendgrid from '@sendgrid/mail'
import { NewRatingData } from '../types/NewRatingData';

export class SendgridDriver {
    private static instance: SendgridDriver;

    private constructor() {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    /**
     * Gets a SendgridDriver instance, following the singleton pattern
     */
    public static getInstance(): SendgridDriver {
        if (!this.instance) {
            this.instance = new SendgridDriver();
        }
        return this.instance;
    }

    /**
     * Sends a new rating email to the author of the learning object
     * 
     * @param to The author email to send to
     * @param data The dynamic template data to send
     */
    public async sendNewRatingEmail(to: string, data: NewRatingData): Promise<void> {
        const msg = {
            to,
            from: 'no-reply@clark.center',
            templateId: 'd-03ad7a19fc29497e9015bc2473ff6451',
            dynamic_template_data: data
        };
        await sendgrid.send(msg);
    }
}