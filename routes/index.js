var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/api/employeelist', function(req, res) {
    res.send({
        Users: [{
            name: 'Pritam'
        }, {
            name: 'Gubu'
        }],
        List: [{
            "Id": 1,
            "Name": "Pinak",
            "Role": "Director"
        }, {
            "Id": 2,
            "Name": "Rishi",
            "Role": "PM"
        }]
    });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.collection('users');
    collection.find({}, function(e, docs) {
        res.send({
            "userlist": docs
        });
    });
})

/* GET all the web pages */
router.get('/api/getwebpages', function(req, res) {
    var db = req.db;
    var collection = db.collection('webpages');
    collection.find({}, function(e, docs) {
        res.send({
            "webpages": docs
        });
    });
})


/* POST call to add a new web site */
router.post('/addwebsite', function(req, res) {
    var db = req.db;
    var name = req.param("name");
    var emailto = req.param("emailto");
    //validate the input data
    if (!name || !emailto) {
        res.status(400).send("Please send all required parameters. Required paramaters are - name, emailto");
        return;
    }
    var collection = db.get('websites');
    collection.insert({
        "name": name,
        "emailto": emailto
    }, function(err, doc) {
        if (err)
        // If it failed, return error
            res.send("There was a problem adding the website information to the database.");
        else
            res.send("OK");
    });
})

/* POST call to add a new web page */
router.post('/addwebpage', function(req, res) {
    var db = req.db;
    var name = req.param("name");
    var url = req.param("url");
    var texttoverify = req.param("texttoverify");
    var interval = req.param("interval");
    var websiteid = req.param("websiteid");
    //validate the input data
    if (!name || !url || !interval || !websiteid) {
        res.status(400).send("Please send all required parameters. Required paramaters are - name, url, interval, websiteid");
        return;
    }
    var collection = db.collection('webpages');
    collection.insert({
        "name": name,
        "url": url,
        "texttoverify": texttoverify,
        "interval": interval,
        "websiteid": websiteid
    }, function(err, doc) {
        if (err)
        // If it failed, return error
            res.send("There was a problem adding the webpage information to the database.");
        else
            res.send("OK");
    });
})


/* POST call to add result log for a webpage */
    router.post('/addresult', function(req, res) {
    var db = req.db;
    var webpageid = req.param("webpageid");
    var executiontime = req.param("lastexecutiontime");
    var success = req.param("success");
    var errormessage = req.param("errormessage");
    //validate the input data
    if (!webpageid || !executiontime || !success) {
        res.status(400).send("Please send all required parameters. Required paramaters are - webpageid, executiontime, success");
        return;
    }
    var collection = db.get('results');
    collection.insert({
        "webpageid": webpageid,
        "executiontime": executiontime,
        "success": success,
        "errormessage": errormessage
    }, function(err, doc) {
        if (err)
        // If it failed, return error
            res.send("There was a problem adding the result information to the database.");
        else
            res.send("OK");
    });
})

    /* GET the latest result of a webpage */
    router.get('/api/getresult', function(req, res){
// read the querystring param webpageid
        var pageid = req.param("webpageid");
        var db = req.db;
    var collection = db.collection('results');
    collection.find({}, function(e,docs){
    // iterate over the webpage list
    //for (var i = 0; i < docs.length; i++) {
        // check if results table has any record for this webpage
        db.collection('results').find({'webpageid': pageid }, function(err, doc)
        {
            if(err)
            {
                console.log("GETTING ERROR");
                console.log(err);
                return;
            }
            res.send({
            "result": doc[doc.length-1]
        });
        });
    //};
});
})

/* POST call to add email notification log */
router.post('/emailnotification', function(req, res) {
    var db = req.db;
    var webpageid = req.param("webpageid");
    var notificationtime = req.param("notificationtime");

    //validate the input data
    if (!webpageid || !notificationtime) {
        res.status(400).send("Please send all required parameters. Required paramaters are - webpageid, notificationtime");
        return;
    }
    var collection = db.get('emailnotification');
    collection.insert({
        "webpageid": webpageid,
        "notificationtime": notificationtime
    }, function(err, doc) {
        if (err)
        // If it failed, return error
            res.send("There was a problem adding the email notification information to the database.");
        else
            res.send("OK");
    });
})

/* POST call to add text notification log */
router.post('/textnotification', function(req, res) {
    var db = req.db;
    var webpageid = req.param("webpageid");
    var notificationtime = req.param("notificationtime");

    //validate the input data
    if (!webpageid || !notificationtime) {
        res.status(400).send("Please send all required parameters. Required paramaters are - webpageid, notificationtime");
        return;
    }
    var collection = db.get('textnotification');
    collection.insert({
        "webpageid": webpageid,
        "notificationtime": notificationtime
    }, function(err, doc) {
        if (err)
        // If it failed, return error
            res.send("There was a problem adding the email notification information to the database.");
        else
            res.send("OK");
    });
})

router.post('/adduser', function(req, res) {
    var db = req.db;
    var name = req.param("name");
    var collection = db.get('users');
    collection.insert({
        "username": name
    }, function(err, doc) {
        if (err)
        // If it failed, return error
            res.send("There was a problem adding the information to the database.");
    });
    collection.find({}, function(e, docs) {
        res.send({
            "userlist": docs
        });
    });
})

module.exports = router;