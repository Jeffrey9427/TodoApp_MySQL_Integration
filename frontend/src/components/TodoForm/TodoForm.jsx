import { useState } from 'react'  
import './TodoForm.css'
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export function TodoForm({addTodo}) {
    const [newItem, setNewItem] = useState("");
    const { currentUser } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();    // prevent website from refreshing
    
        try {
            await addDoc(collection(db, 'todos'), {
                id: crypto.randomUUID(),
                title: newItem, 
                completed: false, 
                userID: currentUser.uid,
            })
            setNewItem("");
        } catch (error) {
            alert(error);
        }
    }
    
    return (
        <form className="new-item-form px-12 py-6 bg-white rounded-lg shadow-xl">
            <div className="form-row">
                <label htmlFor="item" className="text-black ml-2 tracking-[.025em] font-semibold">New Item</label>
                <input type="text" id="item" value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Create a new todo..." 
                    className='border-b border-violet-700 w-50 bg-black text-slate-700 focus:outline-none'>
                </input>
            </div>  

            <div className="flex justify-center mb-2">
                <button className="btn w-60 shadow-lg" onClick={handleSubmit}>Add</button>
            </div>
        </form>
    )
}