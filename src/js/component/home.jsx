import { useState, useEffect } from "react";
import React from 'react';

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        fetch("https://assets.breatheco.de/apis/fake/todos/user/jnorestin2")
            .then((res) => res.json())
            .then((todosFromApi) => {
                if (todosFromApi.length === 0) {
                    setTodos([
                        { label: "Learn React", done: false },
                        { label: "Build an app", done: false },
                        { label: "Deploy to Netlify", done: false },
                    ]);
                } else {
                    console.log(todosFromApi)
                    setTodos(todosFromApi);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch todos:", error);
            });
    }, []);

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            addTodo();
        }
    }

    function addTodo() {
        if (!inputValue.trim()) {
            return;
        }

        const newTodo = { label: inputValue.trim(), done: false };

        fetch("https://assets.breatheco.de/apis/fake/todos/user/jnorestin2", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([...todos, newTodo]),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add todo.");
                }
                setTodos([...todos, newTodo]);
                setInputValue("");
            })
            .catch((error) => {
                console.error("Failed to add todo:", error);
            });
    }

    function deleteTodo(index) {
        const updatedTodos = todos.filter((_, i) => i !== index);

        if (updatedTodos.length === 0) {
            fetch("https://assets.breatheco.de/apis/fake/todos/user/jnorestin2", {
                method: "DELETE",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to delete todos.");
                    }
                    setTodos([]);
                })
                .catch((error) => {
                    console.error("Failed to delete todos:", error);
                });
        } else {
            fetch("https://assets.breatheco.de/apis/fake/todos/user/jnorestin2", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTodos),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to update todos.");
                    }
                    setTodos(updatedTodos);
                })
                .catch((error) => {
                    console.error("Failed to update todos:", error);
                });
        }
    }

    return (
        <div className="text-center">
            <h1 className="text-center">TODOS</h1>
            <div className="notePad">
                <ul style={{ listStyleType: "none", marginTop: "1rem" }}>
                    <li>
                        <input
                            type="text"
                            id="addToDo"
                            placeholder=""
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </li>
                    {todos.map((todo, index) => {
                        return (
                        <li key={index}>
                            <div className="todo">
                                <span>{todo.label}</span>
                                <button onClick={() => deleteTodo(index)}>X</button>
                            </div>
                        </li>)
                    })}
                </ul>
            </div>
        </div>
);
};

export default Home;