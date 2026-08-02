// Basic logging
console.log("Basic message");

// Styled logging
console.log("%cImportant!", "color: red; font-size: 20px;");

// Warnings and errors
console.warn("This might be a problem");
console.error("This is definitely wrong");

// Tables for arrays/objects
console.table(users);

// Grouping
console.group("User Processing");
console.log("Step 1");
console.log("Step 2");
console.groupEnd();

// Timing
console.time("fetchUsers");
await fetchUsers();
console.timeEnd("fetchUsers");  // "fetchUsers: 342ms"

// Conditional logging
console.assert(x > 0, "x should be positive");

// Stack trace
console.trace("How did we get here?");

// Find and fix all bugs in this code
function calculateOrderTotal(items) {
    let total = 0;
    
    for (let i = 0; i <= items.length; i++) {
        const item = items[i];
        total += item.price * item.quanity;
    }
    
    if (total > 100) {
        total = total * 0.9;  // 10% discount
    }
    
    return total;
}

const order = [
    { name: "Book", price: 15, quantity: 2 },
    { name: "Pen", price: 3, quantity: 5 },
    { name: "Notebook", price: 8, quantity: 3 }
];

console.log(calculateOrderTotal(order));
// Expected: 69 (before discount) or 62.1 (after discount)
// Actual: ???

//fixed code
function calculateOrderTotal(items) {
    let total = 0;
    
    for (let i = 0; i < items.length; i++) {   // FIXED loop condition
        const item = items[i];
        total += item.price * item.quantity;   // FIXED property name
    }
    
    if (total > 100) {
        total = total * 0.9;  // 10% discount
    }
    
    return total;
}

const order = [
    { name: "Book", price: 15, quantity: 2 },
    { name: "Pen", price: 3, quantity: 5 },
    { name: "Notebook", price: 8, quantity: 3 }
];

console.log(calculateOrderTotal(order)); // ✅ Expected: 69
