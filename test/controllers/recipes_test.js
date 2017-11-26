const chai = require('chai');
const chai_http = require('chai-http');
const server = require('../../index.js');
const sinon = require('sinon');
const auth = require('../../auth/auth');
const expect = chai.expect;
const should = chai.should();
const bcrypt = require('bcryptjs')
const Recipe = require('../../models/recipe');

const User = require('../../models/user');

chai.use(chai_http);



describe('Recipes controller', () => {
    let test;
    const credentials = { email: 'test@test.com', password: 'test1234' };
    let accessToken;

    const schnitzel = new Recipe({
        name: 'Tasty Schnitzel',
        description: 'A super-tasty Schnitzel - just awesome!',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
        ingredients: [
            { name: 'Meat', amount: '1'},
            { name: 'French Fries', amount: '20'},
        ]
    });

    const burger = new Recipe({
        name: 'Big Fat Burger',
        description: 'Just full of fat, what else?',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
        ingredients: [
            { name: 'Buns', amount: '2'},
            { name: 'Cheese', amount: '2'},
            { name: 'Steak', amount: '1'},
            { name: 'Bacon', amount: '2'}
        ]
    });

    //Get a valid access token
    beforeEach((done) => {
        test = new User({email: 'test@test.com', password: bcrypt.hashSync('test1234') });
        test.save()
            .then(() => {
                chai.request(server)
                    .post('/api/v1/login')
                    .send(credentials)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body).to.include({"token" : auth.encodeToken(credentials.email)});
                        accessToken = res.body.token;
                         done();
                    });
            });
    });

    it('GET to /api/v1/recipes returns multiple recipes if available', (done) => {
        Promise.all([ burger.save(), schnitzel.save() ])
            .then(() => {
                 chai.request(server)
                    .get('/api/v1/recipes')
                    .set('W-Access-Token', accessToken)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.should.be.instanceof(Array).and.have.lengthOf(2));
                        done();
                     });
             });
    });

    it('GET to /api/v1/recipes returns a single recipe if only 1 available', (done) => {
        //Bovenstaand burger object saven werkt niet tweede keer...?
        // burger.save()
        new Recipe({
            name: 'Big Fat Burger',
            description: 'Just full of fat, what else?',
            imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
            ingredients: [
                { name: 'Buns', amount: '2'},
                { name: 'Cheese', amount: '2'},
                { name: 'Steak', amount: '1'},
                { name: 'Bacon', amount: '2'}
            ]
        }).save()
            .then(() => {
                chai.request(server)
                    .get('/api/v1/recipes')
                    .set('W-Access-Token', accessToken)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.should.be.instanceof(Array).and.have.lengthOf(1));
                        expect(res.body[0]).to.include({ name: 'Big Fat Burger' });
                       done();
                    });
            });
    });

    it('GET to /api/v1/recipes returns an empty array if 0 recipes available', (done) => {
    chai.request(server)
        .get('/api/v1/recipes')
        .set('W-Access-Token', accessToken)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.should.be.instanceof(Array).and.have.lengthOf(0));
            done();
         });
    });

    //HIERONDER MOET NOG VERDER AAN GEWERKT WORDEN
    // it('GET to /api/v1/recipes/:id returns the correct recipe if it exists', (done) => {
    //     new Recipe({
    //         name: 'Big Fat Burger',
    //         description: 'Just full of fat, what else?',
    //         imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    //         ingredients: [
    //             { name: 'Buns', amount: '2'},
    //             { name: 'Cheese', amount: '2'},
    //             { name: 'Steak', amount: '1'},
    //             { name: 'Bacon', amount: '2'}
    //         ]
    //     }).save()
    //         .then(() => {
    //             chai.request(server)
    //                 .get('/api/v1/recipes/1')
    //                 .set('W-Access-Token', accessToken)
    //                 .end((err, res) => {
    //                     expect(err).to.be.null;
    //                     expect(res).to.have.status(200);
    //                     expect(res.body.should.be.instanceof(Array).and.have.lengthOf(1));
    //                     expect(res.body[0]).to.include({ name: 'Big Fat Burger' });
    //                   done();
    //                 });
    //         });
    // });
    //
    // it('GET to /api/v1/recipes/:id returns an error if recipe does not exist', (done) => {
    //     chai.request(server)
    //         .get('/api/v1/recipes/1')
    //         .set('W-Access-Token', accessToken)
    //         .end((err, res) => {
    //             expect(err).to.not.be.null;
    //             expect(res).to.have.status(404);
    //             expect(res.body).to.include({"error" : "Recipe not found"});
    //             done();
    //         });
    // });

    it('POST to /api/v1/recipes creates a new recipe if recipe is valid', (done) => {
        chai.request(server)
            .post('/api/v1/recipes')
            .set('W-Access-Token', accessToken)
            .send([
                new Recipe({
                    name: 'Big Fat Burger',
                    description: 'Just full of fat, what else?',
                    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
                    ingredients: [
                        { name: 'Buns', amount: '2'},
                        { name: 'Cheese', amount: '2'},
                        { name: 'Steak', amount: '1'},
                        { name: 'Bacon', amount: '2'}
                    ]
                })
            ])
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                expect(res.body[0]).to.include({ name: 'Big Fat Burger' });
                done();
            });
    });

    it('POST to /api/v1/recipes returns an error if recipe is invalid', (done) => {
        chai.request(server)
            .post('/api/v1/recipes')
            .set('W-Access-Token', accessToken)
            .send(new Recipe())
            .end((err, res) => {
                expect(err).to.not.be.null;
                expect(res).to.have.status(422);
                expect(res.body).to.include({"error" : "Invalid recipes in body"});
                done();
            });
    });


    // it('DELETE to /api/v1/recipes/:id deletes the correct recipe if it exists', (done) => {
    //     new Recipe({
    //         name: 'Big Fat Burger',
    //         description: 'Just full of fat, what else?',
    //         imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    //         ingredients: [
    //             { name: 'Buns', amount: '2'},
    //             { name: 'Cheese', amount: '2'},
    //             { name: 'Steak', amount: '1'},
    //             { name: 'Bacon', amount: '2'}
    //         ]
    //     }).save()
    //         .then(() => {
    //             chai.request(server)
    //                 .delete('/api/v1/recipes/1')
    //                 .set('W-Access-Token', accessToken)
    //                 .end((err, res) => {
    //                     expect(err).to.be.null;
    //                     expect(res).to.have.status(200);
    //                     done();
    //                 });
    //         });
    // });
    //
    // it('DELETE to /api/v1/recipes/:id returns an error if recipe does not exist', (done) => {
    //     chai.request(server)
    //         .delete('/api/v1/recipes/1')
    //         .set('W-Access-Token', accessToken)
    //         .end((err, res) => {
    //             expect(err).to.not.be.null;
    //             expect(res).to.have.status(404);
    //             expect(res.body).to.include({"error" : "Recipe not found"});
    //             done();
    //         });
    // });
    //
    // it('PUT to /api/v1/recipes/:id updates the correct recipe if it exists', (done) => {
    //     new Recipe({
    //         name: 'Big Fat Burger',
    //         description: 'Just full of fat, what else?',
    //         imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    //         ingredients: [
    //             { name: 'Buns', amount: '2'},
    //             { name: 'Cheese', amount: '2'},
    //             { name: 'Steak', amount: '1'},
    //             { name: 'Bacon', amount: '2'}
    //         ]
    //     }).save()
    //         .then(() => {
    //             chai.request(server)
    //                 .put('/api/v1/recipes/1')
    //                 .send({ name: 'Small wrap' })
    //                 .set('W-Access-Token', accessToken)
    //                 .end((err, res) => {
    //                     expect(err).to.be.null;
    //                     expect(res).to.have.status(200);
    //                     expect(res.body[0]).to.include({ name: 'Small wrap' });
    //                     done();
    //                 });
    //         });
    // });
    //
    // it('PUT to /api/v1/recipes/:id returns an error if recipe does not exist', (done) => {
    //     chai.request(server)
    //         .put('/api/v1/recipes/1')
    //         .send({ name: 'Small wrap' })
    //         .set('W-Access-Token', accessToken)
    //         .end((err, res) => {
    //             expect(err).to.not.be.null;
    //             expect(res).to.have.status(404);
    //             expect(res.body).to.include({"error" : "Recipe not found"});
    //             done();
    //         });
    // });
});
