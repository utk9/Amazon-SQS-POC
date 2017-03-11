const Promise = require('bluebird');

const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-sqs-config.json');
AWS.config.setPromisesDependency(Promise);

const sqs = new AWS.SQS();

const QueueUrl = 'https://sqs.us-west-2.amazonaws.com/468761638778/test-queue';

class Log {
	error (msg) {
		console.log("\x1b[31m", msg);
	}

	info (msg) {
		console.log(msg);
	}
}

const log = new Log();

const params = {
	AttributeNames: [ "All" ], 
	QueueUrl,
	WaitTimeSeconds: 3,
	VisibilityTimeout: 5,
}

function handleMessage(message) {
	log.info(message);
	return Promise.resolve();
}

function listen () {
	console.log('listen called');
	sqs.receiveMessage(params).promise()
		.then((data) => {
			if (data.Messages) {			
				data.Messages.forEach((message) => {
					handleMessage(message)
						.then(() => {
							// message successfully processed, remove from queue
							const deleteParams = {
								QueueUrl,
								ReceiptHandle: message.ReceiptHandle,
							};

							sqs.deleteMessage(deleteParams).promise()
								.then((data) => {
									log.info(data);
								})
								.catch((err) => {
									// message was processed, but there was an error removing it from the queue
									// what do??
								});
						})
						.catch((err) => {
							// there was an error processing the message, leave it, it will be received again after the visibility timeout and processed again
							log.error(err);
						})
				})
			}
		})
		.catch((err) => {
			log.error(err);
		})
		.finally(() => {
			listen();
		});
}

listen();