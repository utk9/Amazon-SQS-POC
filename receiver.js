const Promise = require('bluebird');

const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-sqs-config.json');
AWS.config.setPromisesDependency(Promise);

const sqs = new AWS.SQS();

const QueueUrl = 'https://sqs.us-west-2.amazonaws.com/468761638778/test-queue';

const params = {
	AttributeNames: [ "All" ], 
	QueueUrl,
	WaitTimeSeconds: 2,
	VisibilityTimeout: 5,
}

sqs.receiveMessage(params).promise()
	.then((data) => {
		console.log(data);
	})
	.catch((err) => {
		console.log(err);
	});