// Initialize the application interface
document.getElementById('app').innerHTML = `
    <h1>Password Manager</h1>
    <div>
        <input type="text" id="username" placeholder="Enter username">
        <input type="password" id="password" placeholder="Enter password">
        <div id="passwordStrength"></div>
        <button onclick="addAccount()">Add Account</button>
    </div>
    <div id="accounts"></div>
    <div>
        <h2>Login</h2>
        <input type="text" id="loginUsername" placeholder="Username">
        <input type="password" id="loginPassword" placeholder="Password">
        <button onclick="login()">Login</button>
        <p id="loginMessage"></p>
	<button onclick="triggerDownload()">Download JSON</button>
	<input type="file" id="fileInput" accept=".json">
	<button onclick="loadFromFile()">Load File</button>
        <button onclick="logout()">Logout</button>
        <p id="logoutMessage"></p>
    </div>
`;

// Add a new account
function addAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        alert('Both username and password are required.');
        return;
    }
    const accounts = loadAccounts();
    accounts.push({ username, password });
    saveAccounts(accounts);
    displayAccounts();
    document.getElementById('password').value = ''; // Clear password field
}

// Load accounts from local storage
function loadAccounts() {
    const accounts = localStorage.getItem('accounts');
    return accounts ? JSON.parse(accounts) : [];
}

// Load accounts from an uploaded JSON file
function loadFromFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function(e) {
            const accounts = JSON.parse(e.target.result);
            saveAccounts(accounts);  // Save the loaded data to local storage or state
            displayAccounts();       // Update the UI with the loaded accounts
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
}


// Save accounts to local storage
function saveAccounts(accounts) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

// Display accounts on the page
function displayAccounts() {
    const accounts = loadAccounts();
    const accountsElement = document.getElementById('accounts');
    accountsElement.innerHTML = accounts.map(acc => `<p>${acc.username}</p>`).join('');
}

// Login function
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const accounts = loadAccounts();
    const account = accounts.find(acc => acc.username === username && acc.password === password);
    if (account) {
        document.getElementById('loginMessage').textContent = 'Login successful!';
    } else {
        document.getElementById('loginMessage').textContent = 'Invalid username or password.';
    }
}

// Load accounts from local storage
function loadAccounts() {
    const accounts = localStorage.getItem('accounts');
    return accounts ? JSON.parse(accounts) : [];
}

// Function to download data as JSON file
function downloadJSON(data, filename = 'data.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to trigger the download
function triggerDownload() {
    const data = loadAccounts(); // Assume this function returns the data you want to download
    downloadJSON(data, 'myAccountsData.json');
}

// Logout function
function logout() {
    document.getElementById('logoutMessage').textContent = 'User logged out.';
    localStorage.removeItem('accounts'); // Clear accounts on logout
}

// Evaluate and display password strength
function evaluatePasswordStrength(password) {
    let strength = 0;
    if (password.length > 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    document.getElementById('passwordStrength').textContent = `Password Strength: ${strength} / 5`;
}

// Attach event listener to password input for strength evaluation
document.getElementById('password').addEventListener('input', function () {
    evaluatePasswordStrength(this.value);
});
