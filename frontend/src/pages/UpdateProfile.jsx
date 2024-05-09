import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { Avatar } from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UpdateProfile() {
    const [newUsername, setNewUsername] = useState("");
    const [username, setUsername] = useState("");
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        async function getUsernameAndProfile() {
            try {
                const userCollectionRef = collection(db, "users");
                const q = query(userCollectionRef, where('uid', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setUsername(doc.data().username);
                    setUrl(doc.data().profileURL);
                } 
            } catch (error) {
                setError("Error fetching user data: " + error.message);
            }
        }

        getUsernameAndProfile();
    }, []);

    function handleProfileChange(e) {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    async function uploadProfile() {
        try {
            const imageRef = ref(storage, `${currentUser.uid}/profile-image`);
            await uploadBytes(imageRef, image);
            const downloadURL = await getDownloadURL(imageRef);
    
            const userCollectionRef = collection(db, "users");
            const q = query(userCollectionRef, where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                await updateDoc(docRef, {
                    profileURL: downloadURL
                });
                setUrl(downloadURL);
                alert("Profile image uploaded successfully!");
            } else {
                setError("User document not found");
            }
        } catch (error) {
            setError("Error uploading profile image: " + error.message);
        }
    }
    
    async function updateUsername() {
        setLoading(true);

        if (!newUsername.trim()) {
            setLoading(false);
            setError("Username must not be blank")
            return; 
        }
        
        try {
            const userCollectionRef = collection(db, "users");
            const q = query(userCollectionRef, where("uid", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                await updateDoc(docRef, {
                    username: newUsername,
                })
                setUsername(newUsername);
                alert("Username updated successfully");
                setNewUsername("");
            } else {
                setError("User document not found");
            }
        } catch (error) {
            setError(error.message);
        }

        setLoading(false);
    }

    function handleUsername(e) {
        if (e.target.value.includes(' ')) {
            setError("Username must not include spaces")
            return;
        }
        setNewUsername(e.target.value);
    }

    return (
        <main>
            <div className="bg-white px-16 py-6 rounded-lg shadow-xl mt-10">
                <div className="flex justify-center">
                    <h1 className="text-black tracking-[.025em] text-black font-semibold mt-3 mb-8 text-4xl italic">Update Profile</h1>
                </div>

                
                
                <div className="flex justify-center mb-6 flex-col items-center">
                    <Avatar src={url} sx={{ width: 96, height: 96 }}/>
                    <input type="file" onChange={handleProfileChange} className="text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block py-2.5 focus:px-1 mt-5"/>
                </div>
                
                <div className="flex justify-center my-6">
                    <button className="px-5 py-2.5 rounded-lg shadow-xl bg-blue-500 hover:bg-blue-600" onClick={uploadProfile} disabled={loading}>Upload Image</button> 
                </div>

                <div className="mb-6">
                    <label htmlFor="default-input" className="block mb-2 text-medium font-medium text-gray-900 mb-2">New Username <span className="text-red-600">*</span></label>
                    <input type="text" id="username" name="username" className="border rounded-lg border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2 " placeholder={username}
                            onChange={handleUsername} value={newUsername} required autoFocus/>
                </div>

                <div className="flex justify-center my-6">
                    <button className="px-5 py-2.5 rounded-lg shadow-xl bg-green-500 hover:bg-green-600" onClick={updateUsername} disabled={loading}>Update Username</button> 
                </div>

                {
                    error && 
                    <div className="text-black justify-center flex text-red-500 italic text-sm">
                        {error}
                    </div>
                }

                <hr className="border-b border-gray-200 my-8" />

                <div className="flex justify-center mt-8 mb-3">
                    <Link to="/" className="px-5 bg-red-600 py-2.5 rounded-lg shadow-xl hover:bg-red-700 w-36 text-center">Cancel</Link>
                </div>
            </div>   
        </main>
    )
}