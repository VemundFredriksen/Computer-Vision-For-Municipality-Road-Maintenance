describe('The login page', function() {
    it('Find and click the login list element', function() {
        cy.visit('/')
        cy.get('li')
        .last()
        .click()
    })
    it('Should have a header saying "login"', function() {
        cy.get('h1')
        .should('have.text', 'Login')
    })
    it('Should have a Username field', function() {
        cy.get('[class="label"]')
        .first()
        .should('have.text', 'Username')
    })
    it('Should have a Password field', function() {
        cy.get('[class="label"]')
        .last()
        .should('have.text', 'Password')
    })
    it('Takes a screenshot of the login page', function() {
        cy.screenshot('Login page')
    })
})
const username = "admin"
const password = "admin123"
const errorUsername = 'ThisUserDoesNotExist'

describe('Login via the login page', function() {
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
    it('Successful login confirmation', function() {
        cy.get('p')
        .first()
        .contains('You are logged in')
    })
    it('Takes a screenshot of the login confirmation', function() {
        cy.screenshot('Login confirmation')
    })
})
// The fail login E2E test is not being run due to being used on a branch
// that did not have this feature finalized, it can be modified to support the finalized
// feedback functionality later.

// describe('Fail to login via the login page', function() {
//     it('Find and click the login list element', function() {
//         cy.visit('/')
//         cy.get('li')
//         .last()
//         .click()
//     })
//     it('Types the username', function() {
//         cy.get('[placeholder="username"]')
//         .type(errorUsername, { delay: 100 })
//         .should('have.value', errorUsername)
//     })
//     it('Types the password', function() {
//         cy.get('[placeholder="password"]')
//         .type(password, { delay: 20 })
//         .should('have.value', password)
//     })
//     it('Clicks the login button', function() {
//         cy.get('[class="login_button"]')
//         .click()
//     })
//     it('Login error confirmation', function() {
//         cy.get('p')
//         .first()
//         .contains('Wrong username or password')
//     })
//     it('Takes a screenshot of the login failure', function() {
//         cy.screenshot('Login failure')
//     })
// })