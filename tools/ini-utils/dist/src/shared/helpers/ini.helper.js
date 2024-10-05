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
exports.IniHelper = void 0;
// External modules
const fs = __importStar(require("fs"));
const ini = __importStar(require("ini"));
class IniHelper {
    /**
     * Load an INI file and return its content as an object
     * @param filePath
     * @returns
    */
    static loadFile(filePath) {
        console.log(`Loading file ${filePath}`);
        const fileContent = fs.readFileSync(filePath, 'utf-8')
            .replace(/([\S] *)(?<!\\)([;#])/g, '$1\\$2'); // escape semicolon and hash
        const parsed = ini.parse(fileContent);
        return {
            path: filePath,
            content: parsed
        };
    }
    /**
     * Write merged INI file in UTF-8 with BOM
     * @param filePath
     * @param data
     */
    static writeFile(file) {
        fs.writeFileSync(file.path, '\ufeff' + ini.stringify(file.content), { encoding: 'utf-8' });
        console.log(`File ${file.path} has been created successfully.`);
    }
    static exists(filePath) {
        return fs.lstatSync(filePath).isFile();
    }
}
exports.IniHelper = IniHelper;
