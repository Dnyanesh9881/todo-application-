// backend/models/Activity.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    duration: { type: String, default: "00:00:00" },
    status: { type: String, enum: ['Pending', 'Ongoing', 'Paused', 'Completed'], default: 'Pending' },
    history: [
        {
            action: { type: String, enum: ['Start', 'Pause', 'Resume', 'End'], required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
});

const Todo = mongoose.model('Todo', todoSchema);
export default Todo;