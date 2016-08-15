process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var Donor = require("../models/donor");
var should = chai.should();

chai.use(chaiHttp);

describe('Donor', function() {

	Donor.collection.drop();

	beforeEach(function(done){
		var newDonor = new Donor({
			'firstName' 		: 'John',
			'lastName'  		: 'Armless',
			'contactNumber' 	: '+5519993334456',
			'emailAddress' 		: 'john@test.com',
			'bloodGroup'		: 'A+',
			'address' 			: 'St Test',
			'ipAddress'			: '9.84.22.19',
			'latitude'			: '-22.917583',
			'longitude'			: '-47.226752'
		});
		newDonor.save(function(err) {
		  done();
		});
	});
	afterEach(function(done){
		Donor.collection.drop();
		done();
	});
  

  it('should add a SINGLE donor on /api/createDonorPin POST',function(done) {
	  chai.request(server)
	    .post('/api/createDonorPin/')
	    .send({
			'firstName' 		: 'John',
			'lastName'  		: 'Armless',
			'contactNumber' 	: '+5519993334456',
			'emailAddress' 		: 'john@test.com',
			'bloodGroup'		: 'A+',
			'address' 			: 'St Test',
			'ipAddress'			: '9.84.22.19',
			'latitude'			: '-22.917583',
			'longitude'			: '-47.226752'
		})
	    .end(function(err, res){
	      res.should.have.status(200);
	      res.should.be.json;
	      res.body.should.be.a('object');
	      done();
	    });
	});
	
	it('should list ALL donors on /api/getDonorsPins GET',function(done) {
	  chai.request(server)
	    .get('/api/getDonorsPins')
	    .end(function(err, res){
	      res.should.have.status(200);
	      res.should.be.json;
	      res.body.should.be.a('array');
	      done();
	    });
	});

	it('should update a SINGLE donor on /api/updateDonorPin/<donor_id> PUT',function(done) {
	  chai.request(server)
	    .get('/api/getDonorsPins')
	    .end(function(err, res){
	      chai.request(server)
	        .put('/api/updateDonorPin/'+res.body[0]._id)
	        .send({
				firstName 		: 'John',
				lastName  		: 'Armless',
				contactNumber	: '+5519993334456',
				emailAddress 	: 'john@test.com',
				bloodGroup		: 'A+',
				address 		: 'St Test',
				ipAddress		: '9.84.22.19',
				latitude		: '-22.917583',
				longitude		: '-47.226752'
			})
	        .end(function(error, response){
	          response.should.have.status(200);
	          response.should.be.json;
	          response.body.should.be.a('object');
	          done();
	      });
	    });
	});

	it('should delete a SINGLE blob on /api/deleteDonorPin/<donor_id> DELETE',function(done) {
	  chai.request(server)
	    .get('/api/getDonorsPins')
	    .end(function(err, res){
	      chai.request(server)
	        .delete('/api/deleteDonorPin/'+res.body[0]._id)
	        .end(function(error, response){
	          response.should.have.status(200);
	          response.should.be.json;
	          response.body.should.be.a('object');
	          done();
	      });
	    });
	});

});