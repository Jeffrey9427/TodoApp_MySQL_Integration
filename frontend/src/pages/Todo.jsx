import "../App.css";
import { useState, useEffect } from "react";
import { TodoForm } from "../components/TodoForm/TodoForm";
import { TodoList } from "../components/TodoList/TodoList";
import { Header } from "../components/Header/Header";
import { Link } from "react-router-dom";
import { collection, query, onSnapshot, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Todo() {
  const [todos, setTodos] = useState([]);
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "todos"), where("userID", "==", currentUser.uid));
    onSnapshot(q, (querySnapshot) => {
      setTodos(querySnapshot.docs.map(doc => ({
        id: doc.id, 
        data: doc.data()
      })))
    })
  }, [])

  function addTodo(title) {
    setTodos((currentTodos) => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, completed: false, isEditing: false },
      ];
    });
  }

  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }

        return todo;
      });
    });
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id !== id);
    });
  }

  function editTodo(id, newTitle) {
    setTodos(prevTodos => {
      return prevTodos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    });
  }

  function filterTodo() {
    switch(filter) {
      case "Ongoing":
        return todos.filter((todo) => todo.completed);
      case "Completed":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos
    }
  }

  return (
    <main>  
      <Header />
      <TodoForm addTodo={addTodo} />
      <TodoList
        todos = {filterTodo()}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
        setFilter = {setFilter}
      />

      <div className="flex justify-center mt-8 mb-3">
          <Link to="/" className="px-5 bg-red-600 py-2.5 rounded-lg shadow-xl hover:bg-red-700 w-36 text-center">Back</Link>
      </div>
      
    </main>
  );
}

export default Todo;