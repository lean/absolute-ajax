var url = "https://api.github.com/users/lean";
var response;
describe('methods', function () {
  it('should expose a function', function () {
    expect(abjax.ajax).to.be.ok();
  });
});

describe('requests', function () {

  it('should do a GET', function (done) {
    abjax.ajax({
      url : url,
      success : function(response){
        response = response;
        expect(response).to.be.ok();
        done();
      }
    });
  });
  
  it('should parse the response as a json', function () {
    console.log(response);
      expect(response).to.have.key('email');
  });

  /* TODO */
  //it('should do a POST', function () {
  //  
  //});
  
});

