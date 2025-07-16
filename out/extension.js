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
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const runSemgrep_1 = require("./runSemgrep");
const ollama_1 = require("./ollama");
function activate(context) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('semgrep');
    const outputChannel = vscode.window.createOutputChannel('Secure Coding Assistant');
    vscode.workspace.onDidSaveTextDocument(document => {
        if (document.languageId === 'python') {
            (0, runSemgrep_1.runSemgrepOnFile)(document.fileName, diagnostics => {
                diagnosticCollection.set(document.uri, diagnostics);
            });
        }
    });
    vscode.window.showInformationMessage('Secure Coding Assistant Activated');
}
// Make outputChannel available outside activate()
const outputChannel = vscode.window.createOutputChannel('Secure Coding Assistant');
// export function deactivate() {}
// import * as vscode from 'vscode';
// import { runSemgrepOnFile } from './runSemgrep';
// import { askCodeLlama } from './ollama';
// export function activate(context: vscode.ExtensionContext) {
//   const diagnosticCollection = vscode.languages.createDiagnosticCollection('semgrep');
//   vscode.workspace.onDidSaveTextDocument(async document => {
//     if (document.languageId === 'python') {
//       runSemgrepOnFile(document.fileName, async diagnostics => {
//         diagnosticCollection.set(document.uri, diagnostics);
//         if (diagnostics.length > 0) {
//           const firstIssue = diagnostics[0];
//           const codeSnippet = document.getText(firstIssue.range);
//           // Ask CodeLlama for a secure fix suggestion
//           const suggestion = await askCodeLlama(
//             `This Python code has a security issue:\n\n${codeSnippet}\n\nPlease suggest a secure fix.`
//           );
//           // Show result to user
//           vscode.window.showInformationMessage(`💡 CodeLlama Suggestion: ${suggestion}`);
//         }
//       });
//     }
//   });
//   vscode.window.showInformationMessage('Secure Coding Assistant Activated');
// }
// export function deactivate() {}
vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (document.languageId === 'python') {
        (0, runSemgrep_1.runSemgrepOnFile)(document.fileName, async (diagnostics) => {
            const diagnosticCollection = vscode.languages.createDiagnosticCollection('semgrep');
            diagnosticCollection.set(document.uri, diagnostics);
            if (diagnostics.length > 0) {
                const firstIssue = diagnostics[0];
                const codeSnippet = document.getText(firstIssue.range);
                // ✅ Show status bar immediately
                const status = vscode.window.setStatusBarMessage('🧠 CodeLlama is generating a secure fix...');
                let suggestion = '';
                try {
                    // ✅ Await the LLM call
                    const suggestion = await (0, ollama_1.askCodeLlama)(`You are a secure code reviewer. Analyze the following code as a security expert:\n\n${codeSnippet}\n\nGive a ONE-LINE SECURITY FIX suggestion ONLY. Do NOT explain. Do NOT include code.`);
                    // ✅ Show popup suggestion
                    vscode.window.showInformationMessage(`💡 CodeLlama Suggestion: ${suggestion}`);
                }
                finally {
                    // ✅ Clear status message *after* LLM response
                    status.dispose();
                }
            }
        });
    }
});
//# sourceMappingURL=extension.js.map