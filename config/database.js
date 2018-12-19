if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://sarbik:db55mlab@ds123662.mlab.com:23662/node-todo-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/node-todo'}
}