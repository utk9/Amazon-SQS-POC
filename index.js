const Promise = require('bluebird');

const express = require('express');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-sqs-config.json');
AWS.config.setPromisesDependency(Promise);

const app = express();
const sqs = new AWS.SQS();

app.get('/jobs', (req, res, next) => {

});

// list all the queues
app.get('/queues', (req, res, next) => {
	sqs.listQueues().promise()
		.then((data) => {
			res.send(data.QueueUrls);
		})
		.catch((err) => {
			next(err);
		});
});

app.post('/job', (req, res, next) => {

});

app.post('/queue', (req, res, next) => {
	const pCurrentQueues = sqs.listQueues().promise();

	pCurrentQueues.then((queues) => {

	});

});

// if at this point, none of the previous handlers/routes matched, must be a 404 
app.use((req, res, next) => {
	res.sendStatus(404);
});

app.listen(3000, () => {
	console.log("Server started on port 3000. Press ctrl+c to terminate. Go wild!");
});
