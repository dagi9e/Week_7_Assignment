// load library and create app object
const express = require('express')
const app = express()
const path = require('path')

// "database"
let users = []

// Serve static files
app.use(express.static(__dirname + '/public'))

// home route
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})


/*------------ data routes ------------*/

// create a user with a name and score

app.get('/favorite', function(req, res) {
    res.sendFile(__dirname + 'favorite.html')
})
app.get('/find', function(req, res) {
    res.sendFile(__dirname + '/find.html')
})

app.get('/createUser', function(req, res) {
    let user = {
        usname: req.query.username,
        favbook: req.query.favoriteBook,
    }
    users.push(user)
    res.status(201).redirect('/')
})

// show all users data
app.get('/showUsers', function(req, res) {
    let data = JSON.stringify(users)
    res.send(data)
})

// calculate favorite book
let newstack = [];
app.get('/calculate', function(req, res) {

    for (let el of users) {
        let newobject = {};
        newobject.favbook = el.favbook
        newobject.count = 0;
        newstack.push(newobject)

        for (let el2 of newstack)
            if (el.favbook === el2.favbook) {
                el2.count += 1
            }
    }

    res.status(201).redirect('/showCalculate')
})

app.get('/showCalculate', function(req, res) {
    let data = JSON.stringify(newstack)
    res.send(data)
})

//find the highest count and hence the favorite book
let high = [];

app.get('/showFav', function(req, res) {

    let reduce = function(func, data, init) {
        let cumulative = init

        for (let item of data) {
            cumulative = func(cumulative, item.count)
        }

        return cumulative
    }

    let findHighest = function(champion, val) {
        if (val > champion) {
            return val
        } else {
            return champion
        }
    }

    let start_val = newstack[0].count
    let remaining_data = newstack.splice(1, newstack.length)

    let highest = reduce(findHighest, remaining_data, start_val)

    for (let el of newstack) {
        if (el.count === highest) {
            high.push(el)
        }
    }

    let data = JSON.stringify(high)
    res.send(data)

})

// app listen on a PORT
app.listen(9001)
console.log('running')