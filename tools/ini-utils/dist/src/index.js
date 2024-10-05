#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// External modules
const packageJson = __importStar(require("../package.json"));
const validate_command_1 = require("./commands/validate.command");
const merge_command_1 = require("./commands/merge.command");
const commander_1 = require("commander");
commander_1.program
    .name('ini-utils')
    .description('A utils for working with ini files')
    .version(packageJson.version);
commander_1.program
    .command('merge <referenceFilePath> <sourceFilePath> <replacementFilePath> <outputFilePath>')
    .description('Merge ini files')
    .action(merge_command_1.MergeCommand.run);
commander_1.program
    .command('validate <source> [files...]')
    .option('--ci', 'Run in CI mode')
    .description('Check if all entries from reference file are present in other files')
    .action(validate_command_1.ValidateCommand.run);
commander_1.program.parse();
