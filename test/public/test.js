var url = "https://api.github.com/users/lean";
var data;
describe('methods', function () {
    it('should expose a function', function () {
        expect(abjax.ajax).to.be.ok();
    });
});

describe('requests', function () {
    this.timeout(5000);

    it('should do a GET', function (done) {
        abjax.ajax({
            url: "/json",
            success: function (response) {
                expect(response).to.be.ok();
                done();
            }
        });
    });

    it('should do a GET to a local file', function (done) {
        abjax.ajax({
            url: "public/locale.json",
            success: function (response) {
                data = response;
                expect(response).to.be.ok();
                done();
            }
        });
    });

    it('should parse the response as a json', function () {
        expect(data).to.have.key('email');
    });

    /* TODO */
    it('should do a POST', function (done) {
        abjax.ajax({
            type: "POST",
            url: "/post",
            success: function (response) {
                expect(response).to.be.ok();
                done();
            }
        });
    });

});
