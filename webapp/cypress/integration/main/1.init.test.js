describe('Cypress E2E testing framework', function() {
    it('... is working as intended', function() {
        expect(true).to.equal(true)
    })
    it('Can I recommend you some relaxing jazz music?', function() {
        expect('liking jazz').to.not.equal(false)
    })
})
describe('The project home page', function() {
    it('successfully loads!', function() {
        cy.visit('/')
    })
    it('Home page should have a "home" list element', function() {
        cy.get('li')
        .first()
        .should('have.text', 'Home')
    })
    it('Waits 7s for the map to load before taking a screenshot', function() {
        cy.wait(7000)
    })
    it('Takes a screenshot of the Home page', () => {
        cy.screenshot('Home page')
    })
})

describe('Contains the marker color descriptions', function() {
    it('Contains the red marker description', function () {
        cy.get('[style="background-color: red;"')
        .next()
        .contains('Object has not yet been approved')
    })
    it('Contains the yellow marker description', function () {
        cy.get('[style="background-color: yellow;"')
        .next()
        .contains('Object is in work orders')
    })
    it('Contains the green marker description', function () {
        cy.get('[style="background-color: green;"')
        .next()
        .contains('Object is in work order list')
    })
    it('Contains the grey marker description', function () {
        cy.get('[style="background-color: grey;"')
        .next()
        .contains('Statens vegvesen is responsible')
    })
    it('Contains the blue marker description', function () {
        cy.get('[style="background-color: blue;"')
        .next()
        .contains('Other objects')
    })
})
