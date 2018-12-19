const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAuthenticated
} = require('../helpers/auth');

// Load To-Do Model
require('../models/Todo');
const Todo = mongoose.model('todo');

//Todo list page
router.get('/', ensureAuthenticated, (req, res) => {
    Todo.find({
            user: req.user.id
        })
        .sort({
            date: 'desc'
        })
        .then(todos => {
            res.render('todo/todos', {
                todos: todos
            })
        })

});

//Add Todo
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('todo/add');
});

//Edit Route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Todo.findOne({
            _id: req.params.id
        })
        .then(todo => {
            if (todo.user != req.user.id) {
                req.flash('e_msg', 'Not Authorized');
                res.redirect('/todo')
            } else {
                res.render('todo/edit', {
                    todo: todo
                });

            }
        });
});

//Process Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text: 'Please add a Title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some Details'
        });
    }

    if (errors.length > 0) {
        res.render('todo/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Todo(newUser)
            .save()
            .then(todo => {
                req.flash('s_msg', 'To-Do added successfully');
                res.redirect('/todo');
            })
    }
});

//  Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Todo.findOne({
        _id: req.params.id
    }).then(todo => {
        todo.title = req.body.title;
        todo.details = req.body.details;

        todo.save()
            .then(todo => {
                req.flash('s_msg', 'To-Do updated')
                res.redirect('/todo')
            })
    });
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Todo.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            req.flash('s_msg', 'To-Do deleted')
            res.redirect('/todo');
        });
});


module.exports = router;