import express from 'express';
import protectRoute from '../middlewares/protectRoute.js';
import { addNewTodo, deleteTodo, getAllTodos, getDetails, updateStatus } from '../controllers/todoController.js';

const todoRouter= express.Router();

todoRouter.get('/getall', protectRoute, getAllTodos);

// Add New Activity
todoRouter.post('/addtodo', protectRoute, addNewTodo);

// Update Activity Status
todoRouter.put('/:id', protectRoute, updateStatus);

// Show Details
todoRouter.get('/:id', protectRoute, getDetails);

todoRouter.delete('/:id', protectRoute, deleteTodo)

export default todoRouter;
