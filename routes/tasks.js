const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); 
const userModel = require('../models/User');

router.get('/add', (req, res) => {
    res.render('addtask');
});

router.post('/add', async (req, res) => {
    const { title, description } = req.body;

    try {

        const user = await userModel.findOne({username: req.session.passport.user});
        const newTask = new Task({ title, description, user: user._id });

        await newTask.save();

        req.flash('success', 'Task added successfully.');
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error('Error adding task:', error);
        req.flash('error', 'Error adding task.');
        res.redirect('/tasks/add');
    }
});

router.delete('/:taskId', async (req, res) => {
    try {
        const taskId = req.params.taskId;

        // Logic to delete the task from the database
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



// Add more routes for tasks if needed

module.exports = router;
