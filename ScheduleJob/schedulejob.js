var CronJob = require('cron').CronJob;
var queue;
var moment = require('moment');
var request = require('request');

new CronJob('* * * * * * ', function() {

	// get all the records from the webpages table
	var collection = db.collection('webpages');
	collection.find({}, function(e, docs) {

		// iterate over the webpage list
		for (var i = 0; i < docs.length; i++) {
			var webpage = docs[i];
			var interval = docs[i].interval;
			// check if results table has any record for this webpage
			(function(webpage) {
				db.collection('results').find({
					'webpageid': docs[i]._id.toString()
				}).sort({ _id : -1 }, function(err, doc) {
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
		};
	});
}, null, true, "America/Los_Angeles");

// method to verify the webpage status
function DoStatusCheck(webpage) {
	console.log(webpage.name);
	console.log("calling dostatus check");
	console.log(webpage.texttoverify);
	// validate webpage has a url property
	if (typeof webpage.url !== 'undefined' && webpage.url) {

		request(webpage.url.toString()+ "/ncr", function(error, response, body) {
			//if (!error && response.statusCode == 200) {
				if (!error) {
				// verify all the texts are present in the webpage
				var texts = webpage.texttoverify.split(',');
				var flag = false;
				for (var i in texts) {
					if (body.toLowerCase().indexOf(texts[i].trim().toLowerCase()) == -1) {
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
					errormessage: error
				});
			}
		})
	}
}

function SendEmailNotification()
{
	
}