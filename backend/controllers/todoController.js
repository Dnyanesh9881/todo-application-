import Todo from "../Models/todoModel.js";


const getAllTodos = async (req, res) => {
    try {
        const activities = await Todo.find({ userId: req.user._id });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addNewTodo = async (req, res) => {
    const { name } = req.body;
    try {
        const activity = new Todo({ userId: req.user._id, name });
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json(error);
    }
}

const formatTime = (duration) => {
    const seconds = duration % 60;
    const minutes = Math.floor(duration / 60) % 60;
    const hours = Math.floor(duration / 3600);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const updateStatus = async (req, res) => {
    const { action } = req.body;
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Calculate the duration
        const currentTime = new Date();
        let durationInSeconds = todo.duration ? parseDuration(todo.duration) : 0;
        if (todo.status === 'Ongoing' && todo.history.length > 0) {
            const lastHistory = todo.history[todo.history.length - 1];
            const lastTime = new Date(lastHistory.timestamp);
            durationInSeconds += Math.floor((currentTime - lastTime) / 1000); // add seconds
        }

        // Perform action based on the requested action
        if (action === 'Start') {
            if (await Todo.findOne({ userId: req.user._id, status: 'Ongoing' })) {
                return res.status(400).send('Another Task is already ongoing. Please pause or end it first.');
            }
            todo.status = 'Ongoing';
            todo.history.push({ action });
        } else if (action === 'Pause') {
            todo.status = 'Paused';
            todo.duration = formatTime(durationInSeconds);
            todo.history.push({ action });
        } else if (action === 'Resume') {
            if (await Todo.findOne({ userId: req.user._id, status: 'Ongoing' })) {
                return res.status(400).send('Another todo is already ongoing. Please pause or end it first.');
            }
            todo.status = 'Ongoing';
            todo.history.push({ action });
        } else if (action === 'End') {
            todo.status = 'Completed';
            todo.duration = formatTime(durationInSeconds);
            todo.history.push({ action });
        }

        await todo.save(); // Save the updated todo object

        res.send(todo); // Respond with the updated todo object
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Helper function to parse HH:MM:SS duration into seconds
const parseDuration = (duration) => {
    const parts = duration.split(':').map(Number);
    return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
};




const getDetails = async (req, res) => {
    try {
        const activity = await Todo.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({error:'Activity not found'});
        }
        if (activity.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({error:"Unauthorized"});
        }

        res.send(activity);
    } catch (error) {
        res.status(500).send({error:error.message});
    }
}
const deleteTodo= async (req, res) => {
    const id=req.params.id;
    try {
        const todo=await Todo.findByIdAndDelete(id);
        res.status(200).json("delete success");
    } catch (error) {
        res.status(500).send({error:error.message});
    }
}

export { getAllTodos, addNewTodo, updateStatus, getDetails, deleteTodo };