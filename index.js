const Promise = require('bluebird');

const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-sqs-config.json');
AWS.config.setPromisesDependency(Promise);

const app = express();
const sqs = new AWS.SQS();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const QueueUrl = 'https://sqs.us-west-2.amazonaws.com/468761638778/test-queue';

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

// create a new queue
app.post('/queue', (req, res, next) => {
	const { queueName } = req.body;

	if (!queueName) next(new Error('No queue name given'));

	const params = { QueueName: queueName };

	sqs.createQueue(params).promise()
		.then((data) => {
			res.send(data.QueueUrl);
		})
		.catch((err) => {
			next(err);
		});
});

// delete a queue
app.delete('/queue/:queueName', (req, res, next) => {
	const { queueName } = req.params;

	if (!queueName) next(new Error('No queue name given'));


	sqs.getQueueUrl({ QueueName: queueName }).promise()
	    .then((data) => {
	    	const params = { QueueUrl: data.QueueUrl };
			sqs.deleteQueue(params).promise()
				.then((data) => {
					res.send(data);
				})
				.catch((err) => {
					next(err);
				});
		}).catch((err) => {
			next(err);
		});
});


// create a new job, only support sending number and string data types for now
app.post('/message', (req, res, next) => {
	
	if (!req.body) return next(new Error('No body given'));

	const { message, data } = req.body;

	const MessageAttributes = {};
	for (let key in data) {
		const DataType = typeof data[key] === 'number' ? 'Number' : 'String' // case sensitive
		MessageAttributes[key] = {
			DataType,
			StringValue: data[key].toString(),
		}
	}

	const params = {
		QueueUrl,
		MessageBody: message,
		MessageAttributes,
	}

	console.log(params);
	
	sqs.sendMessage(params).promise()
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			next(err);
		});

});

// if at this point, none of the previous handlers/routes matched, must be a 404 
app.use((req, res, next) => {
	res.sendStatus(404);
});

app.use((err, req, res, next) => {
	res.status(500).send(err.message);
});

app.listen(3000, () => {
	console.log("Server started on port 3000. Press ctrl+c to terminate. Go wild!");
});
