document.getElementById('main').innerHTML = `
    <h1>Password Manager</h1>
    <div>
        <input type="text" id="username" placeholder="Enter username">
        <input type="password" id="password" placeholder="Enter password" oninput="evaluatePasswordStrength(this.value)">
        <button onclick="addAccount()">Add Account</button>
        <div id="passwordStrength"></div>
        <button onclick="generatePassword()">Generate Password</button>
        <input type="text" id="generatedPassword" readonly placeholder="">
    </div>
    <div id="accounts"></div>
    <div>
        <h2>Login</h2>
        <input type="text" id="loginUsername" placeholder="Username">
        <input type="password" id="loginPassword" placeholder="Password">
        <button onclick="login()">Login</button>
    </div>
    <div>
        <button onclick="triggerDownload()">Download Account</button>
        <p id="loginMessage"></p>
        
        <input type="file" id="fileInput" accept=".json">
        <button onclick="loadFromFile()">Load Account</button>
    </div>
    <div>
        <h3></h3>
        <button onclick="logout()">Logout</button>
        <p id="logoutMessage"></p>
    </div>
`;


// Function to add a new account
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
    document.getElementById('username').value = ''; // Clear Username Field After Adding
    document.getElementById('password').value = ''; // Clear Password Field After Adding
}

// Generate a random password
function generatePassword() {
    const length = 12;
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const number = '0123456789';
    const special = '!$%^&*()_+-=[]{}@~#<>?.,;:|';
    const all = upper + lower + number + special;

    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += number[Math.floor(Math.random() * number.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    // Convert password string to array, shuffle it, and then join back to a string
    password = shuffleArray(password.split('')).join('');

    document.getElementById('generatedPassword').value = password;
    evaluatePasswordStrength(password);


}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
    return array;
}

// Evaluate and display the strength of the password
function evaluatePasswordStrength(password) {
    let strength = 0;
    if (password.length > 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    document.getElementById('passwordStrength').textContent = `Password Strength: ${strength} / 5`;
}

// Function to load accounts from local storage
function loadAccounts() {
    const accounts = localStorage.getItem('accounts');
    return accounts ? JSON.parse(accounts) : [];
}

// Function to load accounts from an uploaded JSON file and handle errors
function loadFromFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const accounts = JSON.parse(e.target.result);
                saveAccounts(accounts);
                displayAccounts();
            } catch (error) {
                alert('Error parsing JSON: ' + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
}

// Function to save accounts to local storage
function saveAccounts(accounts) {
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

// Function to display accounts on the page
function displayAccounts() {
    const accounts = loadAccounts();
    const accountsElement = document.getElementById('accounts');
    accountsElement.innerHTML = accounts.map(acc => `<p>${acc.username}</p>`).join('');
}

// Function to handle login attempts and display a message based on success or failure
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const accounts = loadAccounts();
    const account = accounts.find(acc => acc.username === username && acc.password === password);
    document.getElementById('loginMessage').textContent = account ? 'Login successful!' : 'Invalid username or password.';
}

// Function to download accounts data as a JSON file
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

// Trigger the download of account data
function triggerDownload() {
    const data = loadAccounts();
    downloadJSON(data, 'savedPassword.json');
}

// Function to log out and clear stored accounts
function logout() {
    document.getElementById('logoutMessage').textContent = 'All Accounts have been logged out.';
    localStorage.removeItem('accounts'); // Clear Other Accounts On Logout
}

