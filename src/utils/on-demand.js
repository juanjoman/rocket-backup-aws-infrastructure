"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAdditionalRules = exports.applyOnDemandBackup = void 0;
const aws_backup_1 = require("@aws-cdk/aws-backup");
const aws_events_1 = require("@aws-cdk/aws-events");
exports.applyOnDemandBackup = (stack, params, tables) => {
    // Modifiable on future versions. Other options available:
    // - daily35DayRetention
    // - dailyWeeklyMonthly5YearRetention
    // - dailyWeeklyMonthly7YearRetention
    const plan = aws_backup_1.BackupPlan.dailyMonthly1YearRetention(stack, 'BackupPlan');
    const backupResources = tables.map((table) => {
        return aws_backup_1.BackupResource.fromDynamoDbTable(table);
    });
    plan.addSelection('BackupSelection', {
        resources: backupResources,
    });
    if (params.onDemandBackupRules) {
        exports.addAdditionalRules(plan, params.onDemandBackupRules);
    }
};
// Exported for testing
exports.addAdditionalRules = (plan, rulesParams) => {
    plan.addRule(new aws_backup_1.BackupPlanRule({
        scheduleExpression: aws_events_1.Schedule.cron({
            minute: rulesParams.minute,
            hour: rulesParams.hour,
            day: rulesParams.day,
            month: rulesParams.month,
            weekDay: rulesParams.weekDay,
            year: rulesParams.year,
        }),
    }));
};
