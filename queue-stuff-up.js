const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-sqs-config.json');
AWS.config.setPromisesDependency(Promise);

const sqs = new AWS.SQS();

const params = {
	QueueUrl: 'https://sqs.us-west-2.amazonaws.com/468761638778/test-queue',
	MessageBody: "Body",
	//MessageAttributes,
}
for (let i=0; i<500; i++) {	
	sqs.sendMessage(params).promise()
		.then((data) => {
			console.log(data);
		})
		.catch((err) => {
			console.log(err);
		});
}