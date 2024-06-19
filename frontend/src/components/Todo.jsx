// frontend/src/pages/ToDoPage.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ToDoPage = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const timerRef = useRef(null);
    const [show, setShow] = useState(false);
    const [details, setDetails] = useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await axios.get('/api/todos/getall');
                setTodos(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTodos();
    }, [setTodos]);

    const handleAddActivity = async () => {
        try {
            const res = await axios.post('/api/todos/addtodo', { name: newTodo }, {
                headers: { 'Content-Type': 'application/json' }
            });

            setTodos([...todos, res.data]);
            setNewTodo('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleAction = async (id, action) => {
        const currentActivity = todos.find(todo => todo.status === 'Ongoing');

        if ((action === 'Start' || action === 'Resume') && currentActivity && currentActivity._id !== id) {
            alert('Please pause or end the ongoing activity first.');
            return;
        }

        try {
            const res = await axios.put(`/api/todos/${id}`, { action }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const updatedActivities = todos.map(todo => todo._id === id ? res.data : todo);
            setTodos(updatedActivities);

            if (action === 'End' || action === 'Pause') {
                clearInterval(timerRef.current);
                timerRef.current = null;
            } else if (action === 'Start' || action === 'Resume') {
                timerRef.current = setInterval(() => {
                    setTodos(prevtodos => prevtodos.map(todo => {
                        if (todo._id === id && todo.status === 'Ongoing') {
                            const [hours, minutes, seconds] = todo.duration.split(':').map(Number);
                            const newDuration = hours * 3600 + minutes * 60 + seconds + 1;
                            return { ...todo, duration: formatTime(newDuration) };
                        }
                        return todo;
                    }));
                }, 1000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const formatTime = (duration) => {
        const seconds = duration % 60;
        const minutes = Math.floor(duration / 60) % 60;
        const hours = Math.floor(duration / 3600);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const showDetailes =async (id) => {
          try {
            const res=await axios.get(`/api/todos/${id}`);
            setDetails(res.data);
            setShow(!show);
          } catch (error) {
            console.log(error);
          }
    }
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`/api/todos/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            })
            setTodos(todos.filter(todo=>todo._id !== id));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='dashboard'>
            <h1 className='todo_heading'>ToDo List</h1>
            <div className='addtodo'>
                <input className='addtodo_input' type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                <button className='addtodo_btn ' onClick={handleAddActivity}>Add Activity</button>
                
            </div>
            {
                    show && details && <div>
                        <h2>Name: {details.name}</h2>
                        <p>Duration: {details.duration}</p>
                        <p>Status : {details.status}</p>
                    </div>
                }
            <table>
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Activity Name</th>
                        <th>Activity Duration</th>
                        <th>Actions</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo, index) => (
                        <tr key={todo._id}>
                            <td>{index + 1}</td>
                            <td>{todo.name}</td>
                            <td>{todo.duration}</td>

                            <td className='action_btns_td'>
                                {todo.status !== 'Completed' ? (
                                    <>
                                        {todo.status === 'Pending' && <button className='action_btn' onClick={() => handleAction(todo._id, 'Start')}>Start</button>}
                                        {todo.status === 'Ongoing' && <button className='action_btn' onClick={() => handleAction(todo._id, 'Pause')}>Pause</button>}
                                        {todo.status === 'Paused' && <button className='action_btn' onClick={() => handleAction(todo._id, 'Resume')}>Resume</button>}
                                        {todo.status !== 'Completed' && <button className='action_btn' onClick={() => handleAction(todo._id, 'End')}>End</button>}
                                        <button className='action_btn' onClick={() => handleDelete(todo._id)}>Delete</button>
                                    </>
                                ) : (<>
                                    <button onClick={() => showDetailes(todo._id)}>Show Details</button>
                                    <button onClick={() => handleDelete(todo._id)}>Delete</button>
                                </>
                                )}
                            </td>
                            <td>{todo.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ToDoPage;
