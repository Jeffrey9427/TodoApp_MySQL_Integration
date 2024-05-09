import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import { useState } from "react"
import { useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Landing() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [username, setUsername] = useState("");

  async function handleSignOut() {
    setError(""); 

    try {
      await logout()
      navigate("/login");
    } catch {
      setError("Failed to log out")
    }
  }

  useEffect(() => {
    async function getUsernameByUID() {
      try {
        const userCollectionRef = collection(db, "users");
        const q = query(userCollectionRef, where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setUsername(doc.data().username);
        } else {
          setError("No user found for UID: " + currentUser.uid);
        }
      } catch (error) {
        setError("Error fetching user data: " + error.message);
      }
    }

    getUsernameByUID();
  }, []);

  return (  
    <>
      <div className="bg-white px-12 py-6 rounded-lg shadow-xl mt-28">
        <div className="flex justify-center">
          <h1 className="text-black tracking-[.025em] text-black font-semibold mt-3 mb-8 text-3xl">Hey, welcome back :D</h1>
        </div>

        <div className="flex justify-center">
          <h1 className="text-black tracking-[.025em] text-black font-semibold mt-3 mb-12 text-3xl underline italic">{username}</h1>
        </div>

        <div className="flex justify-center">
          <Link to="/todo">
            <button className="px-5 py-2.5 rounded-lg shadow-xl bg-green-500 hover:bg-green-600">Go to Todo List</button>
          </Link>
        </div>

        <div className="flex justify-center mt-8 mb-3">
          <Link to="/update-profile">
            <button className="px-5 py-2.5 rounded-lg shadow-xl bg-blue-500 hover:bg-blue-600">Update Profile</button>
          </Link>
        </div>

        <div className="flex justify-center mt-8 mb-3">
            <button className="px-5 bg-red-600 py-2.5 rounded-lg shadow-xl hover:bg-red-700 w-36" onClick={handleSignOut}>Sign Out</button>
        </div>

        {
            error && 
            <div className="text-black justify-center flex text-red-500 italic text-sm">
                {error}
            </div>
        }

      </div>

      <div className="absolute bottom-6 w-full font-bold text-lg left-0 text-center italic">
        <p>Made by Jeffrey (2602118484)</p>
      </div>
    </>
  );
}