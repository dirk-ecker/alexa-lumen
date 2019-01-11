const lumen = require('../src/lumen');
const expect = require('chai').expect;

describe('lumen', () => {
    it('get the actual program', (done) => {
        lumen.runningSoon(program => {
            console.log(program);
            expect(false).to.deep.equal(true);
            done();
        })
    })
})
