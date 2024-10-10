import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
      const token = localStorage.getItem("authToken");

      if(token){
          navigate('/profile')
      }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        const registerData = { firstName, lastName, email, password };
        console.log(registerData);
        try {
            const response = await fetch("http://localhost:3001/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Registration successful:", result);
            } else {
                console.error("Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
            <div className="w-full max-w-md px-6 py-12">
                <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-2xl p-8 shadow-xl">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-700">Sign Up</h2>
                    <form onSubmit={handleRegister}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
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
                                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-block px-7 py-3 bg-green-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                        >
                            Register
                        </button>
                        <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                            Already a member?
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login');
                                }}
                                className="text-green-600 hover:text-green-700 focus:text-green-700 transition duration-200 ease-in-out ml-1"
                            >
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Register;