import React, { useState } from "react";
import ReactDOM from 'react-dom';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Title = () => <h1 className="title">Welcome to the calculator</h1>;
const Paragraph = () => <p className="info">Here you will find a simple calculator</p>;

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([{username: 'michele', password: 'glorioso'}]);
    const [demoOperations, setDemoOperations] = useState(0);

    const handleLoginSuccess = (username) => {
        setIsLoggedIn(true);
        setCurrentUser(username);
        setDemoOperations(0);
    };

    const handleSignup = (username, password) => {
        setUsers([...users, { username, password }]);
    };

    return (
        <div className="app" id="app-container">
            {!isLoggedIn ? (
                <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onSignup={handleSignup}
                    users={users}
                />
            ) : (
                <div className="authenticated-container" id="authenticated-content">
                    <div className="user-info">
                        <h2>Welcome {currentUser}!</h2>
                        <button id="logout-button" onClick={() => setIsLoggedIn(false)}>Logout</button>
                    </div>
                    <Calculator
                        isDemo={currentUser === 'demo'}
                        demoOperations={demoOperations}
                        setDemoOperations={setDemoOperations}
                        setIsLoggedIn={setIsLoggedIn}
                    />
                </div>
            )}
        </div>
    );
};

const LoginForm = ({ onLoginSuccess, onSignup, users }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    const handleLogin = () => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            onLoginSuccess(username);
            setError('');
        } else {
            setError('Invalid credentials');
        }
    };

    const handleSignup = () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (users.some(u => u.username === username)) {
            setError('Username already exists');
            return;
        }
        onSignup(username, password);
        setError('Signup successful! You can now login');
        setIsSignup(false);
    };

    const handleDemo = () => {
        onLoginSuccess('demo');
    };

    return (
        <div className="login-form" id="login-form-container">
            <Title />
            <h2 className="login-header" id="login-title">
                {isSignup ? 'Sign Up' : 'Please login to access the calculator'}
            </h2>
            <div className="form-group">
                <input
                    id="login-username-input"
                    className="login-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                />
            </div>
            <div className="form-group">
                <input
                    id="login-password-input"
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                />
            </div>
            {error && (
                <div id="login-error-message" className="error-message">
                    {error}
                </div>
            )}
            <div className="button-group" id="login-buttons">
                {isSignup ? (
                    <>
                        <button
                            id="signup-submit-button"
                            className="primary-button"
                            onClick={handleSignup}
                        >
                            Sign Up
                        </button>
                        <button
                            id="back-to-login-button"
                            className="secondary-button"
                            onClick={() => setIsSignup(false)}
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            id="login-submit-button"
                            className="primary-button"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <button
                            id="create-account-button"
                            className="secondary-button"
                            onClick={() => setIsSignup(true)}
                        >
                            Create Account
                        </button>
                        <button
                            id="demo-button"
                            className="tertiary-button"
                            onClick={handleDemo}
                        >
                            Try it out
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const Calculator = ({ isDemo, demoOperations, setDemoOperations, setIsLoggedIn }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);

    const handleCalculation = () => {
        if (!input.trim()) {
            setResult('Please enter a calculation');
            return;
        }

        if (isDemo) {
            if (demoOperations >= 10) {
                setResult('Demo limit reached. Please create an account or login.');
                setTimeout(() => setIsLoggedIn(false), 2000);
                return;
            }
            setDemoOperations(prev => prev + 1);
        }

        try {
            const calculatedResult = eval(input);
            if (calculatedResult === undefined || isNaN(calculatedResult)) {
                setResult('Invalid calculation');
            } else {
                setResult(`Result: ${calculatedResult}`);
            }
        } catch (error) {
            setResult('Invalid calculation');
        }
    };

    return (
        <div className="calculator" id="calculator-container">
            <Title />
            <Paragraph />
            {isDemo && (
                <p id="demo-operations-counter" className="operations-counter">
                    Operations remaining: {10 - demoOperations}
                </p>
            )}
            <div className="input-section">
                <textarea
                    id="calculator-input"
                    className="calculator-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter calculation (e.g., 2 + 2)"
                />
            </div>
            <button
                id="calculate-button"
                className="primary-button"
                onClick={handleCalculation}
            >
                Calculate
            </button>
            {result && (
                <h2 id="calculation-result" className="result">
                    {result}
                </h2>
            )}
        </div>
    );
};

root.render(<App />);
