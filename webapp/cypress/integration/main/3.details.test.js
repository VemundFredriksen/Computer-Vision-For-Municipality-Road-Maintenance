describe('The Map', function() {
    it('The leaflet marker pane is loaded', function() {
        cy.visit('/')
        cy.get('[class="leaflet-pane leaflet-marker-pane"]')
        .should('exist')
    })
    it('Waits 5s for the map to load properly', function() {
        cy.wait(5000)
    })
})
describe('The Detailed View', function() {
    it('Clicks on a marker', function() {
        cy.get('[class="leaflet-marker-icon leaflet-zoom-animated leaflet-interactive"]')
        .first()
        .click()
    })
    it('Detailed view is open', function() {
        cy.get('[class="info_bar__wrapper"]')
        .should('exist')
    })
    it('Takes a screenshot of the open detailed view', function() {
        cy.screenshot('Detailed View')
    })
    it('Contains the Object info table', function() {
        cy.get('[class="info_table__wrapper"]')
        .should('exist')
    })
    it('Contains all expected Object information fields', function() {
        // Image
        cy.get('[class="button_image"]')
        .should('exist')
        // Information table
        cy.get('tr')
        .contains('Type:')
        cy.get('tr').next()
        .contains('Fixed:')
        cy.get('tr').next().next()
        .contains('Priority:')
        cy.get('tr').next().next().next()
        .contains('Approved:')
        cy.get('tr').next().next().next().next()
        .contains('Responsible:')
        // This is the information span, we only check it exists
        // since it could be different depending on the Objects state.
        cy.get('span')
        .should('exist')
    })
    it('Opens the fullscreen Object image modal', function() {
        cy.get('[class="button_image"]')
        .should('exist')
        .click()
    })
    it('Takes a modal Object image fullscreen screenshot', function() {
        cy.screenshot('Object image modal fullscreen')
    })
    it('Closes the Object image modal', function() {
        cy.get('[class="button_image"]')
        .click()
    })
    it('Close detailed view by clicking the close button', function() {
        cy.get('[class="close_button"]')
        .click()
    })
    it('Detailed view is closed', function() {
        cy.get('[class="info_bar__wrapper"]')
        .should('not.exist')
    })
})

// Have to login before running the object edit test, this functionality
// is based on the 2.login.test.js file, and should be updated accordingly
// if this E2E test changes.

const username = "admin"
const password = "admin123"
describe('Login via the login page and navigate to home', function() {
    it('Find and click the login list element', function() {
        cy.get('li')
        .last()
        .click()
    })
    it('Types the username', function() {
        cy.get('[placeholder="username"]')
        .type(username, { delay: 100 })
        .should('have.value', username)
    })
    it('Types the password', function() {
        cy.get('[placeholder="password"]')
        .type(password, { delay: 20 })
        .should('have.value', password)
    })
    it('Clicks the login button', function() {
        cy.get('[class="login_button"]')
        .click()
    })
    it('Find and click the home list element', function() {
        cy.get('li')
        .first()
        .click()
    })
    it('Waits 5s for the map to load properly', function() {
        cy.wait(5000)
    })
})

// WARNING: this test requires there to be a red unapproved marker
// it also relies on the web app array function using pop in order to later
// check the last element reflected the changes performed.
// Needs to be logged in for this test to work, run the latest login test before test or it will fail!
// can integrate login functionality in this test if needed, but not necessary. Depends on if a spec file will be made later or not.


describe('Edit from detailed view', function() {
    it('Click on a unapproved marker', function() {
        // Gets the first red = unapproved marker it can find in the DOM
        cy.get('[src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"]')
        .first()
        .click()
    })
    it('Takes a screenshot before object edit', function() {
        cy.screenshot('Before object edit')
    })
    it('Clicks on the edit button to open the edit view', function() {
        cy.get('[class="button"]')
        .last()
        .click()
    })
    it('Selects the type field and changes it to crack', function() {
        cy.get('[name="typ"]')
        .select('crack')
    })
    it('Selects the priority field and changes it to 2', function() {
        cy.get('[name="pri"]')
        .select('2')
    })
    it('Clicks on the Update button to perform the edit', function() {
        cy.get('[type="submit"]')
        .first()
        .click()
    })
    it('Takes a screenshot after object edit', function() {
        cy.screenshot('After object edit')
    })
})