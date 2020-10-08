/**
 * The data structure for the new rating email template
 * dynamic data
 */
export interface NewRatingData {
    user: {
        firstName: string,
        username: string
    },
    object: {
        name: string,
        cuid: string,
        rating: number
    }
}