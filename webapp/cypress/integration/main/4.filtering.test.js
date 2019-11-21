const resetFilter = function () {
    it('Resets the filter', function() {
        cy.get('[class="filter_button"]')
        .next()
        .click()
    })
}
const filter = function () {
    it('Filters', function() {
        cy.get('[class="filter_button"]')
        .first()
        .click()
    })
}

describe('The Filter Bar', function() {
    it('The filtering bar shows up', function() {
        cy.visit('/')
        cy.get('[class="filter_bar__wrapper"]')
        .should('exist')
    })
    it('Waits 2s for the map to load properly', function() {
        cy.wait(2000)
    })
})
describe('Type filtering', function() {
    it('The type filtering shows up', function() {
        cy.get('[name="type"]')
        .should('exist')
    })
    it('Selects the pothole filter option and apply it to be pothole', function() {
        cy.get('[name="type"]')
        .select('pothole')
    })
    filter()
    it('Takes a screenshot of the successful type filtering', function() {
        cy.screenshot('Type filtering')
    })
    resetFilter()
})
describe('Fixed filtering', function() {
    it('The fixed filtering shows up', function() {
        cy.get('[name="fixed"]')
        .should('exist')
    })
    it('Selects the fixed filter option and apply it to be yes', function() {
        cy.get('[name="fixed"]')
        .select('yes')
    })
    filter()
    it('Takes a screenshot of the successful fixed filtering', function() {
        cy.screenshot('Fixed filtering')
    })
    resetFilter()
})
describe('Priority filtering', function() {
    it('The priority filtering shows up', function() {
        cy.get('[name="prio"]')
        .should('exist')
    })
    it('Selects the priority filter option and apply it to be 5', function() {
        cy.get('[name="prio"]')
        .select('5')
    })
    filter()
    it('Takes a screenshot of the successful priority filtering', function() {
        cy.screenshot('Priority filtering')
    })
    resetFilter()
})
describe('Approved filtering', function() {
    it('The approved filtering shows up', function() {
        cy.get('[name="appr"]')
        .should('exist')
    })
    it('Selects the approved filter option and apply it to be yes', function() {
        cy.get('[name="appr"]')
        .select('yes')
    })
    filter()
    it('Takes a screenshot of the successful approved filtering', function() {
        cy.screenshot('Approved filtering')
    })
    resetFilter()
})