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