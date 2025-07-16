import * as vscode from 'vscode';
import { runSemgrepOnFile } from './runSemgrep';
import { askCodeLlama } from './ollama';
export function activate(context: vscode.ExtensionContext) {
const diagnosticCollection = vscode.languages.createDiagnosticCollection('semgrep');
const outputChannel = vscode.window.createOutputChannel('Secure Coding Assistant');

  vscode.workspace.onDidSaveTextDocument(document => {
    if (document.languageId === 'python') {
      runSemgrepOnFile(document.fileName, diagnostics => {
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
    runSemgrepOnFile(document.fileName, async (diagnostics) => {
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
          const suggestion = await askCodeLlama(
  `You are a secure code reviewer. Analyze the following code as a security expert:\n\n${codeSnippet}\n\nGive a ONE-LINE SECURITY FIX suggestion ONLY. Do NOT explain. Do NOT include code.`
);


          // ✅ Show popup suggestion
          vscode.window.showInformationMessage(`💡 CodeLlama Suggestion: ${suggestion}`);
        } finally {
          // ✅ Clear status message *after* LLM response
          status.dispose();
        }
			
      }
    });
  }
});
