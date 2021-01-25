"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDynamoDBTable = void 0;
const core_1 = require("@aws-cdk/core");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const faker_1 = require("faker");
exports.generateDynamoDBTable = (appStack, id, tableName) => {
    return new aws_dynamodb_1.Table(appStack, id !== null && id !== void 0 ? id : faker_1.random.word(), {
        tableName: tableName !== null && tableName !== void 0 ? tableName : faker_1.random.word(),
        partitionKey: {
            name: faker_1.random.word(),
            type: aws_dynamodb_1.AttributeType.STRING,
        },
        sortKey: {
            name: faker_1.random.word(),
            type: aws_dynamodb_1.AttributeType.STRING,
        },
        billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
        removalPolicy: core_1.RemovalPolicy.DESTROY,
        timeToLiveAttribute: faker_1.random.word(),
        pointInTimeRecovery: false,
    });
};
