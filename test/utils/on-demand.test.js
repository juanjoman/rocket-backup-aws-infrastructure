"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_types_1 = require("@boostercloud/framework-types");
const core_1 = require("@aws-cdk/core");
const aws_backup_1 = require("@aws-cdk/aws-backup");
const OnDemandUtils = require("../../src/utils/on-demand");
const backup_stack_1 = require("../../src/backup-stack");
const resource_generator_1 = require("./resource-generator");
const sinon_1 = require("sinon");
const expect_1 = require("../expect");
describe('On demand utils', () => {
    const config = new framework_types_1.BoosterConfig('test');
    config.appName = 'testing-app';
    let appStack;
    let tables;
    let backupResources;
    const backUpPlanID = 'BackupPlan';
    const backupSelectionID = 'BackupSelection';
    beforeEach(() => {
        sinon_1.restore();
        appStack = new core_1.Stack(new core_1.App(), config.resourceNames.applicationStack, {});
        tables = Array.from(Array(3)).map((_, i) => {
            return resource_generator_1.generateDynamoDBTable(appStack, `myTable-${i}`, `tableName-${i}`);
        });
        backupResources = tables.map((table) => {
            return aws_backup_1.BackupResource.fromDynamoDbTable(table);
        });
    });
    it('creates a backup plan when no rules have been provided through the onDemandBackupRules parameter', () => {
        const params = { backupType: backup_stack_1.BackupType.ON_DEMAND };
        const backupPlanSpy = sinon_1.spy(aws_backup_1.BackupPlan, 'dailyMonthly1YearRetention');
        const backupPlanAddSelectionSpy = sinon_1.spy(aws_backup_1.BackupPlan.prototype, 'addSelection');
        // Spying on this method separately because dailyMonthly1YearRetention already triggers "BackupPlan.addRule(...)" twice
        const backupPlanAddRuleSpy = sinon_1.spy(OnDemandUtils, 'addAdditionalRules');
        OnDemandUtils.applyOnDemandBackup(appStack, params, tables);
        expect_1.expect(backupPlanSpy).to.have.been.calledOnceWithExactly(appStack, backUpPlanID);
        expect_1.expect(backupPlanAddSelectionSpy).to.have.been.calledOnceWithExactly(backupSelectionID, {
            resources: backupResources,
        });
        expect_1.expect(backupPlanAddRuleSpy).to.not.have.been.called;
    });
    it('creates a backup plan when all rules have been provided through the onDemandBackupRules parameter', () => {
        // Weekday is missing since it can't be set with the 'day' parameter
        const onDemandBackupRules = {
            minute: '40',
            hour: '18',
            day: '10',
            month: '6',
            year: '2021',
        };
        const params = {
            backupType: backup_stack_1.BackupType.ON_DEMAND,
            onDemandBackupRules,
        };
        const backupPlanSpy = sinon_1.spy(aws_backup_1.BackupPlan, 'dailyMonthly1YearRetention');
        const backupPlanAddSelectionSpy = sinon_1.spy(aws_backup_1.BackupPlan.prototype, 'addSelection');
        // Spying on this method separately because dailyMonthly1YearRetention already triggers "BackupPlan.addRule(...)" twice
        const backupPlanAddRuleSpy = sinon_1.spy(OnDemandUtils, 'addAdditionalRules');
        OnDemandUtils.applyOnDemandBackup(appStack, params, tables);
        expect_1.expect(backupPlanSpy).to.have.been.calledOnceWithExactly(appStack, backUpPlanID);
        expect_1.expect(backupPlanAddSelectionSpy).to.have.been.calledOnceWithExactly(backupSelectionID, {
            resources: backupResources,
        });
        expect_1.expect(backupPlanAddRuleSpy).to.have.been.calledOnceWithExactly(backupPlanSpy.returnValues[0], onDemandBackupRules);
    });
});
