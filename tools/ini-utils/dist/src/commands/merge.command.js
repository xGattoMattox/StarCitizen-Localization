"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeCommand = void 0;
// Helpers
const ini_helper_1 = require("../shared/helpers/ini.helper");
class MergeCommand {
    static async run(referenceFilePath, sourceFilePath, replacementFilePath, outputFilePath) {
        console.log('Loading INI files...');
        // Load files
        const referenceData = ini_helper_1.IniHelper.loadFile(referenceFilePath);
        const sourceData = ini_helper_1.IniHelper.loadFile(sourceFilePath);
        const replacementData = ini_helper_1.IniHelper.loadFile(replacementFilePath);
        console.log('Merging INI files...');
        // Merge files
        const mergedData = MergeCommand.mergeIniFiles(referenceData.content, sourceData.content, replacementData.content);
        console.log('Writing merged INI file...');
        // Write merged file
        ini_helper_1.IniHelper.writeFile({
            path: outputFilePath,
            content: mergedData
        });
        console.log('Done.');
    }
    /**
     * Merge two INI dictionaries
     * @param referenceData The original INI data
     * @param sourceData The data to take the values from
     * @param replacementData The data to take the values from if the key is not present in the source data
     * @returns
     */
    static mergeIniFiles(referenceData, sourceData, replacementData) {
        const mergedData = {};
        for (const key in sourceData) {
            const referenceValue = referenceData[key];
            const sourceValue = sourceData[key];
            const replacementValue = replacementData[key];
            mergedData[key] = sourceValue || replacementValue || referenceValue;
        }
        // Add missing keys from the reference file
        for (const key in referenceData) {
            if (!sourceData[key]) {
                mergedData[key] = referenceData[key];
            }
        }
        return mergedData;
    }
}
exports.MergeCommand = MergeCommand;
