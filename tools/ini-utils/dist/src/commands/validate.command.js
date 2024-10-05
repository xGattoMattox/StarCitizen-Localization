"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateCommand = void 0;
// Helpers
const ini_helper_1 = require("../shared/helpers/ini.helper");
const string_helper_1 = require("../shared/helpers/string.helper");
class ValidateCommand {
    static async run(source, files, options) {
        console.log('Validating INI files...');
        // Load files
        const referenceData = ini_helper_1.IniHelper.loadFile(source);
        console.log(`Reference file: ${referenceData.path}`);
        const iniFiles = files
            .filter(file => ini_helper_1.IniHelper.exists(file))
            .map(filePath => ini_helper_1.IniHelper.loadFile(filePath));
        console.log(`Files to validate: ${iniFiles.length}`);
        if (files.length === 0) {
            console.log('No files to validate');
            return;
        }
        let success = true;
        // Validate all files
        for (const file of iniFiles) {
            console.log();
            console.log('==================================================');
            console.log(`File "${file.path}"...`);
            console.log('==================================================');
            const isValid = ValidateCommand.validateIni(referenceData, file);
            if (!isValid) {
                success = false;
                console.log();
                console.log(`File "${file.path}" is invalid`);
            }
            console.log('==================================================');
        }
        // Return error code if CI is enabled
        if (options.ci && !success)
            process.exit(1);
    }
    static validateIni(referenceData, fileData) {
        let success = true;
        // NOTE Check if all keys from reference are present in source
        {
            console.log('Validating keys...');
            const result = ValidateCommand.checkMissingKeys(referenceData, fileData);
            if (!result) {
                console.log('  => 🔥 One or more keys are missing in source file');
                success = false;
            }
            else
                console.log('  => ✅ All keys are present in the file');
        }
        console.log();
        // NOTE Check if all variable placeholders are present in source
        {
            console.log('Validating "~name(parameter)" placeholders...');
            const result = ValidateCommand.validateTildPlaceholders(referenceData, fileData);
            if (!result) {
                console.log('  => 🔥 One or more placeholders are missing in source file');
                success = false;
            }
            else
                console.log('  => ✅ All placeholders are present in source file');
        }
        console.log();
        // NOTE Check if all variable placeholders are present in source
        {
            console.log('Validating "%name" placeholders...');
            const result = ValidateCommand.validatePercentPlaceholders(referenceData, fileData);
            if (!result) {
                console.log('  => 🔥 One or more placeholders are missing in source file');
                success = false;
            }
            else
                console.log('  => ✅ All placeholders are present in source file');
        }
        return success;
    }
    /**
     * Check if all entries from reference are present in source
     * @param referenceData
     * @param sourceData
     * @returns
     */
    static checkMissingKeys(referenceData, sourceData) {
        const referenceKeys = Object.keys(referenceData.content);
        const sourceKeys = Object.keys(sourceData.content);
        // Check if all keys from reference are present in source
        const missingKeys = referenceKeys.filter(key => !sourceKeys.includes(key));
        if (missingKeys.length > 0) {
            for (const key of missingKeys)
                console.log(`  - Unable to find key "${key}"`);
            return false;
        }
        return true;
    }
    /**
     * Check if all "~name(parameter)" placeholders from reference are present in source
     * @param referenceData
     * @param sourceData
     * @returns
     */
    static validateTildPlaceholders(referenceData, sourceData) {
        const placeholderRegex = /(~(?<name>\w+)\((?<parameter>.*?)\))/g; // match ~name(parameter)
        let isValid = true;
        const referencePlaceholders = new Map();
        // Find all placeholders in reference file
        for (const [key, value] of Object.entries(referenceData.content)) {
            if (value === undefined)
                continue;
            const matches = string_helper_1.StringHelper.getAllMatchesGroups(value, placeholderRegex);
            // Check if placeholders of this key is valid
            for (const match of matches) {
                if (!ValidateCommand.isValidTildPlaceholder(match)) {
                    console.log(`  - Invalid placeholder "${match.name}(${match.parameter})" in "${key}"`);
                    isValid = false;
                    continue;
                }
            }
            referencePlaceholders.set(key, matches);
        }
        // Check if all placeholders are present in source file
        for (const key of referencePlaceholders.keys()) {
            const placeholders = referencePlaceholders.get(key);
            const sourceValue = sourceData.content[key];
            if (sourceValue === undefined)
                continue;
            if (placeholders === undefined)
                continue;
            // check key type
            if (typeof sourceValue !== 'string') {
                console.log(`  - Key "${key}" is not a string`);
                isValid = false;
                continue;
            }
            // Check if value contains all placeholders
            for (const placeholder of placeholders) {
                const toSearch = `~${placeholder.name.toLocaleLowerCase()}(${placeholder.parameter.toLocaleLowerCase()})`;
                if (sourceValue.toLocaleLowerCase().indexOf(toSearch) === -1) {
                    console.log(`  - Unable to find placeholder "~${placeholder.name}(${placeholder.parameter})" in "${key}"`);
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    /**
     * Check if all "%name" placeholders from reference are present in source
     * @param referenceData
     * @param sourceData
     * @returns
     */
    static validatePercentPlaceholders(referenceData, sourceData) {
        const placeholderRegex = /%(?<name>\w+)/g; // match %name
        let isValid = true;
        const referencePlaceholders = new Map();
        // Find all placeholders in reference file
        for (const [key, value] of Object.entries(referenceData.content)) {
            if (value === undefined)
                continue;
            const matches = string_helper_1.StringHelper.getAllMatchesGroups(value, placeholderRegex);
            referencePlaceholders.set(key, matches);
        }
        // Check if all placeholders are present in source file
        for (const key of referencePlaceholders.keys()) {
            const placeholders = referencePlaceholders.get(key);
            const sourceValue = sourceData.content[key];
            if (placeholders === undefined)
                continue;
            if (sourceValue === undefined)
                continue;
            // Check if values from reference are present in source
            for (const placeholder of placeholders) {
                const toSearch = `%${placeholder.name}`;
                if (sourceValue.indexOf(toSearch) === -1) {
                    console.log(`  - Unable to find placeholder "%${placeholder.name}" in "${key}"`);
                    isValid = false;
                }
            }
        }
        return isValid;
    }
    /**
     * Check if placeholder is valid
     * @param key The key of the entry
     * @param match The match result
     * @returns
     */
    static isValidTildPlaceholder(placeholder) {
        const parameter = placeholder.parameter;
        // Check if parameter contains opening parenthesis, which means that it is not a valid placeholder
        const badTokens = ['(', ')', '~', ']', '\\n'];
        return !badTokens.some(token => parameter.indexOf(token) !== -1);
    }
}
exports.ValidateCommand = ValidateCommand;
