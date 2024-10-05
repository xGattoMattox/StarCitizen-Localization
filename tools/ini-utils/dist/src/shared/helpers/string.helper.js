"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringHelper = void 0;
class StringHelper {
    /**
     * Get all matches of a regex
     * @param value
     * @param regex
     */
    static getAllMatchesGroups(value, regex) {
        const models = [];
        // get all matches
        const matches = value.matchAll(regex);
        // iterate over matches
        for (const match of matches) {
            // create new model
            const model = {};
            // iterate over groups
            for (const group in match.groups) {
                // add group to model
                if (Object.prototype.hasOwnProperty.call(match.groups, group)) {
                    model[group] = match.groups[group];
                }
            }
            // add model to models array
            models.push(model);
        }
        return models;
    }
}
exports.StringHelper = StringHelper;
