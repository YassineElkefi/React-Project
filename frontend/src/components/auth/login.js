import './auth.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleFormData = async (e) => {
        e.preventDefault();
        
        console.log(email);
        console.log(password);


        const loginData = { email, password };

        try {
            const response = await fetch("http://localhost:3001/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Login successful:", result);
                
                navigate('/dashboard');
            } else {
                
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };



    const navigate = useNavigate();
    
    return (
        <section className="text-center text-lg-start">
            <div className="container">
                <div className="row g-0 align-items-center">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="card cascading-right">
                            <div className="card-body p-5 shadow-5">
                                <h2 className="fw-bold mb-5">Sign in</h2>
                                <form onSubmit={handleFormData}>
                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="email">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            className="form-control" 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            value={email} 
                                            required 
                                        />
                                    </div>

                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input 
                                            type="password" 
                                            id="password" 
                                            className="form-control" 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            value={password} 
                                            required 
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-success btn-block mb-4">
                                        Sign in
                                    </button>
                                </form>

                                <p>You're not a member? 
                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/register');
                                        }} 
                                        className="link-success"
                                    >
                                        Register
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
