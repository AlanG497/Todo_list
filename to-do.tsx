import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  title: string;
  storageKey: string;
}

const TodoList: React.FC<TodoListProps> = ({ title, storageKey }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, [storageKey]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, storageKey]);

  const addTodo = (): void => {
    const text = input.trim();
    if (text === '') {
      alert('Please enter a task');
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      completed: false
    };

    setTodos([...todos, newTodo]);
    setInput('');
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="container">
      <h1>✓ {title}</h1>
      <div className="todo-form">
        <input
          type="text"
          className="todo-input"
          placeholder="Enter a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="add-button" onClick={addTodo}>
          Add
        </button>
      </div>
      <ul className="todo-list">
        {todos.length === 0 ? (
          <li style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            No tasks yet. Add one to get started!
          </li>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <span
                onClick={() => toggleTodo(todo.id)}
                style={{
                  cursor: 'pointer',
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#999' : '#000'
                }}
              >
                {todo.text}
              </span>
              <button
                className="delete-button"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );

};

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <TodoList title="To-Do List" storageKey="todos" />
  
    </div>
  );
};

// Mount React app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

