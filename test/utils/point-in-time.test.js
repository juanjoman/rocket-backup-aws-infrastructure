"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_types_1 = require("@boostercloud/framework-types");
const core_1 = require("@aws-cdk/core");
const point_in_time_recovery_1 = require("../../src/utils/point-in-time-recovery");
const expect_1 = require("../expect");
const resource_generator_1 = require("./resource-generator");
describe('Point in time recovery utils', () => {
    const config = new framework_types_1.BoosterConfig('test');
    config.appName = 'testing-app';
    const appStack = new core_1.Stack(new core_1.App(), config.resourceNames.applicationStack, {});
    it('sets the pointInTimeRecoverySpecification parameter to true', () => {
        const tables = Array.from(Array(3)).map((_, i) => {
            return resource_generator_1.generateDynamoDBTable(appStack, `myTable-${i}`, `tableName-${i}`);
        });
        tables.map((table) => {
            // 'pointInTimeRecovery: false' does not set pointInTimeRecoverySpecification
            expect_1.expect(table.node['host'].table.pointInTimeRecoverySpecification).to.be.undefined;
        });
        point_in_time_recovery_1.applyPointInTimeRecoveryBackup(tables);
        tables.map((table) => {
            expect_1.expect(table.node['host'].table.pointInTimeRecoverySpecification).to.not.be.undefined;
            expect_1.expect(table.node['host'].table.pointInTimeRecoverySpecification.pointInTimeRecoveryEnabled).true;
        });
    });
});
