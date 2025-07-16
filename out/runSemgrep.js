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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSemgrepOnFile = runSemgrepOnFile;
const child_process_1 = require("child_process");
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
function runSemgrepOnFile(filePath, callback) {
    const rulesPath = path.join(__dirname, '..', 'semgrep-rules');
    const cmd = `semgrep --config ${rulesPath} ${filePath} --json`;
    (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Semgrep error: ${stderr}`);
            return;
        }
        try {
            const results = JSON.parse(stdout);
            const diagnostics = [];
            results.results.forEach((r) => {
                const range = new vscode.Range(new vscode.Position(r.start.line - 1, r.start.col - 1), new vscode.Position(r.end.line - 1, r.end.col - 1));
                diagnostics.push(new vscode.Diagnostic(range, `[Semgrep] ${r.extra.message}`, vscode.DiagnosticSeverity.Warning));
            });
            callback(diagnostics);
        }
        catch (e) {
            console.error(`Parsing error: ${e}`);
        }
    });
}
//# sourceMappingURL=runSemgrep.js.map