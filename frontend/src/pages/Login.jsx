import { useState } from "react"
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginWithEmailAndPassword, resetPassword, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleEmailLogin(e) {
        e.preventDefault();

        try {
            setError("")
            setLoading(true)
            await loginWithEmailAndPassword(email, password)
            navigate("/");
        } catch (err) {
            setError("Invalid email or password")
        }
        
        setLoading(false)
    }

    async function handleGoogleLogin(e) {
        e.preventDefault();

        try {
            setError("")
            setLoading(true)
            const user = await loginWithGoogle()
            const userCollectionRef = collection(db, "users");
            const q = query(userCollectionRef, where('uid', '==', user.user.uid));
            const docs = await getDocs(q);

            if (docs.docs.length === 0) {
                await addDoc(collection(db, 'users'), {
                    uid: user.user.uid,
                    username: user.user.displayName,
                    email: user.user.email,
                })
            }
            navigate("/");
        } catch (err) {
            setError("Failed to login with Google account")
        }
        
        setLoading(false)
    }
    
    async function handlePasswordReset() {
        const email = prompt('Please enter your email ');
        resetPassword(email);
        alert('Email sent! Check your inbox for password reset instructions');
    }

    return (
        <main>
            <div className="bg-white px-16 py-6 rounded-lg shadow-xl mt-10">
                <div className="flex justify-center">
                    <h1 className="text-black tracking-[.025em] text-black font-semibold mt-3 mb-8 text-4xl italic">Welcome Back!</h1>
                </div>

                <form className="">
                    <div className="mb-6">
                        <label htmlFor="default-input" className="block mb-2 text-medium font-medium text-gray-900">Email <span className="text-red-600">*</span></label>
                        <input type="text" id="email" name="email" className="border-b border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 focus:px-1" placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)} required/>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="default-input" className="block mb-2 text-medium font-medium text-gray-900">Password <span className="text-red-600">*</span></label>
                        <input type="password" id="password" name="password" className="border-b border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 focus:px-1" placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)} required/>
                    </div>

                    
                    <div className="flex flex-row-reverse">
                        <a href="" className="text-slate-700 text-sm hover:text-slate-800" onClick={handlePasswordReset}>Forgot password?</a>
                    </div>  
                    

                    <div className="flex justify-center my-6">
                        <button className="btn w-full" onClick={(e)=>handleEmailLogin(e)} disabled={loading}>Login</button> 
                    </div>

                    {
                        error && 
                        <div className="text-black justify-center flex text-red-500 italic text-sm">
                            {error}
                        </div>
                    }

                    <div className="w-full flex items-center my-8">
                        <hr className="border-b border-gray-200 mr-4 flex-grow" />
                        <span className="text-gray-500 italic"> or </span>
                        <hr className="border-b border-gray-200 ml-4 flex-grow" />
                    </div>

                    <div className="flex items-center justify-center my-6">
                        <button 
                            className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150" 
                            onClick={(e)=>handleGoogleLogin(e)} disabled={loading}>
                            <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                            <span>Login with Google</span>
                        </button>
                    </div>
                </form>

                <div className="flex justify-center mb-6">
                    <p className="text-slate-700">Don't have an account? <Link to="/signup" className="font-semibold">Sign up</Link></p> 
                </div>
            </div>   
        </main>
    )
}