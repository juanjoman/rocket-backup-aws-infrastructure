import { Stack } from '@aws-cdk/core';
import { Table } from '@aws-cdk/aws-dynamodb';
export declare const generateDynamoDBTable: (appStack: Stack, id?: string | undefined, tableName?: string | undefined) => Table;
