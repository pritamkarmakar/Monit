var CronJob = require('cron').CronJob;
var moment = require('moment');

new CronJob('* * * * *', function () {

    // get all the records from the webpages table
    var collection = db.collection('webpages');
    collection.find({}, function (e, docs) {

        // iterate over the webpage list
        for (var i = 0; i < docs.length; i++) {
            var webpage = docs[i];
            var interval = docs[i].interval;
            // check if results table has any record for this webpage
            (function (webpage) {
                db.collection('results').find({
                    'webpageid': docs[i]._id.toString()
                }).sort({_id: -1}, function (err, doc) {
                    if (err) {
                        console.log("GETTING ERROR");
                        console.log(err);
                        return;
                    } else {
                        if (typeof doc !== 'undefined' && doc && doc.length > 0) {
                            // get the last execution time of this webpage and current time
                            var currentTime = moment();
                            var lastExecutionTime = moment(doc[0].executiontime);
                            // get the total duration between current time and last execution time
                            var duration = moment.duration(currentTime.diff(lastExecutionTime));
                            // convert the duration into minutes
                            var minutes = duration.asMinutes();
                            // convert the interval from the webpage table to a moment object and then convert it into minutes
                            var intervalModified = moment(webpage.interval, 'hh:mm:ss');
                            var intervalInMinutes = intervalModified.hour() * 60 + intervalModified.minute() + intervalModified.second() / 60;
                            // if the last execution duration is more than the interval then re-execute
                            if (minutes > intervalInMinutes) {
                                console.log("item to process again");
                                console.log(doc[0].webpageid);
                                DoStatusCheck(webpage);
                            }
                        } else {
                            // if there is no record in the results table then we have to process it
                            DoStatusCheck(webpage);
                        }
                    }

                })
            })(webpage);
        }
        ;
    });
}, null, true, "America/Los_Angeles");

// method to verify the webpage status
function DoStatusCheck(webpage) {
    console.log(webpage.name);
    console.log("calling dostatus check");
    console.log(webpage.texttoverify);
    // validate webpage has a url property
    if (typeof webpage.url !== 'undefined' && webpage.url) {

        //request(webpage.url.toString()+ "/ncr", function(error, response, body) {
        ScrapePage(webpage, function (error, value) {
            if (!error && value[1].status == 200) {
                // verify texttoverify is not null or empty
                if (webpage.texttoverify != null && webpage.texttoverify != "") {
                    // verify all the texts are present in the webpage
                    var texts = webpage.texttoverify.split(',');
                    var flag = false;
                    for (var i in texts) {
                        if (value[0].body.toLowerCase().indexOf(texts[i].trim().toLowerCase()) == -1) {
                            // log the error
                            db.collection('results').insert({
                                webpageid: webpage._id.toString(),
                                executiontime: moment().format(),
                                result: 0,
                                errormessage: texts[i].trim() + ' not found'
                            });
                            return;
                        }
                    }
                }
                //if we reached here that means all texts are present
                db.collection('results').insert({
                    webpageid: webpage._id.toString(),
                    executiontime: moment().format(),
                    result: 1
                });
            } else {
                // log the error
                db.collection('results').insert({
                    webpageid: webpage._id.toString(),
                    executiontime: moment().format(),
                    result: 0,
                    errormessage: value[1].status
                });
            }
        })
    }
}

// method to Scrape the webpage content
function ScrapePage(webpage, callback) {
    var address = webpage.url;
    var finalStatus;
    var redirectUrl;
    var phantom = require('phantom');
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.set("onResourceReceived", function (resp) {
                // check if resp.url has any '/' at the end, we have add that in our address variable then
                if (resp.url.lastIndexOf('/') == resp.url.length - 1)
                    address = address + '/';
                // check if there is a redirect
                if (resp.url == address || redirectUrl == resp.url) {
                    if (resp.redirectURL != null)
                        redirectUrl = resp.redirectURL;
                    else {
                        //get the status for this page
                        if (finalStatus == null)
                            finalStatus = resp.status;
                    }
                }
            });
            page.open(address, function (status) {
                if (status !== 'success') {
                    // if the page is giving 404 status code then this block will not execute. This block will execute only if the status code is >= 500
                    // not able to find a way using phantomjs to capture http 500 status code
                    //return [{"body": ''}, {"status": "error reading the webpage"}];
                    callback(status, [{"body": ''}, {"status": "error reading the webpage"}]);
                }
                else {
                    page.evaluate(function () {
                        return document.documentElement.innerHTML;
                    }, function (result) {
                        ph.exit();
                        callback(null, [{"body": result}, {"status": finalStatus}]);
                    });
                }
            });
        });
    }, {
        dnodeOpts: {
            weak: false
        }
    });
}

function SendEmailNotification() {

}