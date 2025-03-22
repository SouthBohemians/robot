/**
 * Sortable module for Robot Command Planner
 * Handles all drag and drop functionality
 */

// Common sortable options
const getSortableOptions = () => ({
    animation: 0,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    filter: '.empty-nested',
    fallbackOnBody: true,
    emptyInsertThreshold: 5,
    removeOnSpill: true,
    onStart: function(evt) {
        // Only highlight valid drop targets
        document.querySelectorAll('.command-list').forEach(list => {
            // Don't highlight the source list (available commands) when dragging from plan
            if (list !== evt.from && list.id !== 'available-commands') {
                list.classList.add('drop-target-highlight');
            }
        });
    },
    onEnd: function(evt) {
        document.querySelectorAll('.drop-target-highlight').forEach(el => {
            el.classList.remove('drop-target-highlight');
        });
    }
});

// Function to initialize available commands list
function initializeAvailableCommands(availableCommandsList) {
    const sortableOptions = getSortableOptions();

    new Sortable(availableCommandsList, {
        ...sortableOptions,
        group: {
            name: 'commands',
            pull: 'clone',
            put: false
        },
        sort: false,
        removeOnSpill: false // Disable for source list
    });
}

// Function to initialize plan items list
function initializePlanItems(planItemsList) {
    const sortableOptions = getSortableOptions();

    new Sortable(planItemsList, {
        ...sortableOptions,
        group: {
            name: 'commands',
            pull: true,
            put: true
        },
        onAdd: function(evt) {
            window.updateEmptyPlanVisibility();

            if (evt.from.id === 'available-commands') {
                evt.to.replaceChild(
                    window.createPlanItem(evt.item),
                    evt.item
                );
            }
        },
        onRemove: function() {
            window.updateEmptyPlanVisibility();
        }
    });
}

// Function to initialize a nested sortable list
function initializeNestedSortable(nestedList) {
    const sortableOptions = getSortableOptions();

    new Sortable(nestedList, {
        ...sortableOptions,
        group: 'commands',
        onAdd: function(evt) {
            const emptyNestedMsg = evt.to.querySelector('.empty-nested');
            if (emptyNestedMsg) {
                emptyNestedMsg.style.display = 'none';
            }

            if (evt.from.id === 'available-commands') {
                evt.to.replaceChild(
                    window.createPlanItem(evt.item),
                    evt.item
                );
            }
        },
        onRemove: function(evt) {
            if (evt.from.querySelectorAll('.command-item').length === 0) {
                const emptyNestedMsg = evt.from.querySelector('.empty-nested');
                if (emptyNestedMsg) {
                    emptyNestedMsg.style.display = 'block';
                }
            }
        },
        onStart: function(evt) {
            // Only highlight valid drop targets
            document.querySelectorAll('.command-list').forEach(list => {
                // Don't highlight the source list (available commands) when dragging from plan
                if (list !== evt.from && list.id !== 'available-commands') {
                    list.classList.add('drop-target-highlight');
                }
            });

            const nestedContainer = evt.item.querySelector('.nested-container');
            if (nestedContainer) {
                nestedContainer.dataset.originalDisplay = nestedContainer.style.display || 'block';
            }
        },
        onEnd: function(evt) {
            document.querySelectorAll('.drop-target-highlight').forEach(el => {
                el.classList.remove('drop-target-highlight');
            });

            const nestedContainer = evt.item.querySelector('.nested-container');
            if (nestedContainer && nestedContainer.dataset.originalDisplay) {
                nestedContainer.style.display = nestedContainer.dataset.originalDisplay;
                delete nestedContainer.dataset.originalDisplay;
            }
        }
    });
}

// Function to initialize all nested sortable elements within a parent element
function initializeNestedSortables(element) {
    const nestedLists = element.querySelectorAll('.nested-list');
    nestedLists.forEach(nestedList => {
        initializeNestedSortable(nestedList);
    });
}

// Export functions for use in other modules
window.initializeAvailableCommands = initializeAvailableCommands;
window.initializePlanItems = initializePlanItems;
window.initializeNestedSortable = initializeNestedSortable;
window.initializeNestedSortables = initializeNestedSortables;
