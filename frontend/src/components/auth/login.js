import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("authToken");

        if(token){
            navigate('/profile')
        }
    }, [navigate]);

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
                if (result.token) {
                    localStorage.setItem("authToken", result.token);
                    console.log("Token saved to localStorage:", result.token);
                }

                navigate('/profile');
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
            <div className="w-full max-w-md px-6 py-12">
                <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-2xl p-8 shadow-xl">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-700">Sign in</h2>
                    <form onSubmit={handleFormData}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-block px-7 py-3 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                        >
                            Sign in
                        </button>

                        <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                            You're not a member?
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                }}
                                className="text-green-600 hover:text-green-700 focus:text-green-700 transition duration-200 ease-in-out ml-1"
                            >
                                Register
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;