import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        setError("");

        if (password !== passwordConfirm) {
            return setError("Passwords do not match")
        }

        if (username.includes(" ")) {
            return setError("Username must not include spaces")
        }
      
        try {
            setError("")
            setLoading(true)
            const user = await signup(email, password)
            await addDoc(collection(db, 'users'), {
                uid: user.user.uid,
                username: username,
                email: email,
            })
            alert('Account successfully created!');
            navigate("/login");
        } catch (err) {
            setError("Account failed to be created - " + err.message);
        }
      
        setLoading(false)
    }

    return (
        <main>
            <div className="bg-white px-16 py-6 rounded-lg shadow-xl mt-2">
                <div className="flex justify-center">
                    <h1 className="text-black tracking-[.025em] text-black font-semibold mt-3 mb-8 text-4xl italic text-center">Register Your Account!</h1>
                </div>

                <form className="">
                    <div className="mb-6">
                        <label htmlFor="default-input" className="block mb-2 text-medium font-medium text-gray-900">Username <span className="text-red-600">*</span></label>
                        <input type="text" id="username" name="username" className="border-b border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 focus:px-1" placeholder="Enter your username"
                                onChange={(e) => setUsername(e.target.value)} required/>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="default-input" className="block mb-2 text-medium font-medium text-gray-900">Email <span className="text-red-600">*</span></label>
                        <input type="text" id="email" name="email" className="border-b border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 focus:px-1" placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)} required/>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="default-input" className="block mb-2 text-medium font-medium text-gray-900">Password <span className="text-red-600">*</span></label>
                        <input type="password" id="password" name="password" className="border-b border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 focus:px-1" placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}  required/>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="default-input" className="block mb-2 text-medium font-medium text-gray-900">Password Confirmation <span className="text-red-600">*</span></label>
                        <input type="password" id="passwordConfirm" name="passwordConfirm" className="border-b border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 focus:px-1" placeholder="Confirm your password"
                                onChange={(e) => setPasswordConfirm(e.target.value)}  required/>
                    </div>
                    
                    <div className="flex justify-center my-6">
                        <button className="btn w-full" onClick={(e)=>handleSignup(e)} disabled={loading}>Sign Up</button>
                    </div>
                </form>

                {
                    error && 
                    <div className="text-black justify-center flex text-red-500 italic text-sm text-center">
                        {error}
                    </div>
                }

                <hr className="border-b border-gray-200 my-8" />

                <div className="flex justify-center mb-6">
                    <p className="text-slate-700">Already have an account? <Link to="/login" className="font-semibold">Login</Link></p> 
                </div>
            </div>   
        </main>
    )
}