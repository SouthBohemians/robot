/**
 * Main entry point for Robot Command Planner
 * Initializes the application and connects all modules
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const availableCommandsList = document.getElementById('available-commands');
    const planItemsList = document.getElementById('plan-items');

    // Initialize event listeners for command buttons and other interactions
    setupCommandEventListeners();

    // Initialize sortable elements
    initializeAvailableCommands(availableCommandsList);
    initializePlanItems(planItemsList);

    // Initialize the empty plan visibility
    updateEmptyPlanVisibility();

    console.log('Robot Command Planner initialized');
});
