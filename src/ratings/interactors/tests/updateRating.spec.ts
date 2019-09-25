
describe('When updateRating is called', () => {
    describe('and the requester is not the author of the rating', () => {
       it('should throw an invalid access error', () => {
            expect(false).toBeTruthy();
       });
    });
    describe('and the requester is the author of the rating', () => {
        describe('and the Learning Object does not exist', () => {
            it('should throw a not found error', () => {
                expect(false).toBeTruthy();
            });
        });
        describe('and thee Learning Object does exist', () => {
            it('should call updateRating', () => {
                expect(false).toBeTruthy();
            });
        });
    });
});
