/**
 * Commands module for Robot Command Planner
 * Handles creation, manipulation, and structure generation of commands
 */

// Function to update empty plan visibility
function updateEmptyPlanVisibility() {
    const planItemsList = document.getElementById('plan-items');
    const emptyPlan = document.getElementById('empty-plan');

    if (planItemsList.children.length > 0) {
        emptyPlan.style.display = 'none';
    } else {
        emptyPlan.style.display = 'block';
    }
}

// Function to create a plan item with buttons
function createPlanItem(commandEl) {
    const item = document.createElement('div');
    item.className = commandEl.className;
    item.dataset.id = commandEl.dataset.id + '-' + Date.now();

    if (commandEl.dataset.nestable) {
        item.dataset.nestable = commandEl.dataset.nestable;
    }

    // Create a content div to hold the command text and buttons
    const contentDiv = document.createElement('div');
    contentDiv.className = 'command-content';

    // Add command text
    const textSpan = document.createElement('span');
    textSpan.textContent = commandEl.textContent;
    contentDiv.appendChild(textSpan);

    // Add buttons for removal and (optionally) toggle
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-group';

    if (commandEl.dataset.nestable === 'true') {
        // Add copy button
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-sm btn-outline-success me-1';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Clone this block and all nested commands';
        buttonContainer.appendChild(copyBtn);

        // Add toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn btn-sm btn-outline-secondary me-1';
        toggleBtn.innerHTML = '▼';
        toggleBtn.title = 'Toggle nested commands';
        buttonContainer.appendChild(toggleBtn);

        // Create nested container
        const nestedContainer = document.createElement('div');
        nestedContainer.className = 'nested-container';

        const nestedList = document.createElement('div');
        nestedList.className = 'nested-list command-list';

        // Add empty message (not draggable)
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-nested';
        emptyMessage.textContent = 'Drop commands here';
        emptyMessage.draggable = false;
        nestedList.appendChild(emptyMessage);

        nestedContainer.appendChild(nestedList);

        // Make nested container sortable - delayed to ensure DOM is ready
        setTimeout(() => {
            window.initializeNestedSortable(nestedList);
        }, 0);

        // Put the nested container inside the item
        item.appendChild(nestedContainer);
    }

    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-sm btn-outline-danger';
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Remove command';
    buttonContainer.appendChild(removeBtn);

    contentDiv.appendChild(buttonContainer);
    item.appendChild(contentDiv);

    return item;
}

// Handle button clicks via event delegation
function setupCommandEventListeners() {
    document.addEventListener('click', function(e) {
        // Handle remove button clicks
        if (e.target.classList.contains('btn-outline-danger')) {
            const commandItem = e.target.closest('.command-item');
            if (commandItem) {
                commandItem.remove();
                updateEmptyPlanVisibility();
            }
        }

        // Handle toggle button clicks
        if (e.target.classList.contains('btn-outline-secondary')) {
            const commandItem = e.target.closest('.command-item');
            if (commandItem) {
                const nestedContainer = commandItem.querySelector('.nested-container');
                if (nestedContainer) {
                    if (nestedContainer.style.display === 'none') {
                        nestedContainer.style.display = 'block';
                        e.target.innerHTML = '▼';
                    } else {
                        nestedContainer.style.display = 'none';
                        e.target.innerHTML = '►';
                    }
                }
            }
        }

        // Handle copy button clicks
        if (e.target.classList.contains('btn-outline-success')) {
            e.stopPropagation();
            const commandItem = e.target.closest('.command-item');
            if (commandItem) {
                // Clone the element
                const clone = commandItem.cloneNode(true);

                // Update the ID
                clone.dataset.id = commandItem.dataset.id.split('-')[0] + '-' + Date.now();

                // Insert the clone after the original
                commandItem.parentNode.insertBefore(clone, commandItem.nextSibling);

                // Initialize any nested Sortable instances in the clone
                window.initializeNestedSortables(clone);
            }
        }
    });
}

// Export functions for use in other modules
window.updateEmptyPlanVisibility = updateEmptyPlanVisibility;
window.createPlanItem = createPlanItem;
window.setupCommandEventListeners = setupCommandEventListeners;
