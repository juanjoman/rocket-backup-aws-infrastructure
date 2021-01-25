import { Stack } from '@aws-cdk/core';
import { Table } from '@aws-cdk/aws-dynamodb';
import { BackupPlan } from '@aws-cdk/aws-backup';
import { BackupStackParams, OnDemandBackupRules } from '../backup-stack';
export declare const applyOnDemandBackup: (stack: Stack, params: BackupStackParams, tables: Array<Table>) => void;
export declare const addAdditionalRules: (plan: BackupPlan, rulesParams: OnDemandBackupRules) => void;
