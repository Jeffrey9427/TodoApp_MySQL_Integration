import { useState } from 'react'  
import './TodoItem.css'
import { db } from '../../firebase/config';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
 
export function TodoItem({completed, id, title, toggleTodo, deleteTodo, editTodo}) {
    const [newTitle, setNewTitle] = useState(title);
    const [isEditing, setIsEditing] = useState(false);
    const [checked, setChecked] = useState(completed);

    async function handleEdit() {
        setIsEditing(true);
    }

    async function handleSave() {
        const todoDocRef = doc(db, "todos", id);
        try {
            await updateDoc(todoDocRef, {
                title: newTitle
            })
            setIsEditing(false);
        } catch (error) {
            alert(error)
        }
    }

    async function handleChecked(e) {
        const checked = e.target.checked;
        setChecked(checked);
        const todoDocRef = doc(db, "todos", id);
        try {
            await updateDoc(todoDocRef, {
                completed: checked,
            })
        } catch (error) {
            alert(error)
        }
    }

    async function handleDelete() {
        const todoDocRef = doc(db, "todos", id);
        try {
            await deleteDoc(todoDocRef)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <li className="mb-1">
            <label className='w-full'>
                <input type="checkbox" checked={completed} onChange={handleChecked} disabled={isEditing}/>
                {isEditing ? (
                    <>
                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder='Edit Todo...' className="grow text-black cursor-auto ml-4" autoFocus/>
                        <button className="flex-none px-3 py-1.5 rounded-lg cursor-pointer focus:outline-none text-green-500 hover:text-white border border-green-500 hover:bg-green-600 focus:ring-green-800 me-1 text-sm border-2 mr-3" onClick={handleSave}>Save</button>
                    </>
                ) : (
                    <>
                        <div className="grow text-black text-base ml-4">{title}</div>
                        <button className="flex-none px-3 py-1.5 rounded-lg cursor-pointer focus:outline-none text-green-500 hover:text-white border border-green-500 hover:bg-green-600 focus:ring-green-800 me-1 text-sm border-2 mr-3" onClick={handleEdit}>Edit</button>
                    </>       
                    )}
                <button className="flex-none px-3 py-1.5 rounded-lg cursor-pointer focus:outline-none text-red-500 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-red-800 me-1 text-sm border-2" onClick={handleDelete}>Delete</button>
            </label>
        </li>
    );
}