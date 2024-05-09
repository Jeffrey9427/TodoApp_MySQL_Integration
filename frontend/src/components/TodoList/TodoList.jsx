import { TodoItem } from "../TodoItem/TodoItem"
import './TodoList.css'

export function TodoList ({ todos, toggleTodo, deleteTodo, editTodo, setFilter }) {
    return (
        <div className="px-12 py-6 bg-white rounded-lg shadow-xl mt-8">
            <div className="flex place-items-center mb-5">
                <h1 className="header tracking-[.025em] text-black font-semibold grow"> Todo List</h1>
                <div className="text-black flex-none">
                    <select id="filter" className="w-40 border-0 border-b-2 border-violet-700 text-sm py-2 px-0 bg-transparent text-black focus:outline-none focus:ring-0 focus:border-gray-500 peer"
                        onChange={e => setFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                    </select>
                </div>
            </div>

            <div className="mt-4">
                <ul className="list text-black">
                    {todos.length === 0 && "No todos"}
                    {todos.map(todo => (
                        <TodoItem
                            id={todo.id}
                            key={todo.id}
                            completed={todo.data.completed}
                            title={todo.data.title}
                            toggleTodo={toggleTodo}
                            deleteTodo={deleteTodo}
                            editTodo={editTodo}
                        />  
                    ))}
                </ul>
            </div> 
        </div>
    )
}