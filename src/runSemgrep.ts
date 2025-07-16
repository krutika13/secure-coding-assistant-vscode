import { exec } from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';

export function runSemgrepOnFile(filePath: string, callback: (diagnostics: vscode.Diagnostic[]) => void) {
  const rulesPath = path.join(__dirname, '..', 'semgrep-rules');
  const cmd = `semgrep --config ${rulesPath} ${filePath} --json`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Semgrep error: ${stderr}`);
      return;
    }

    try {
      const results = JSON.parse(stdout);
      const diagnostics: vscode.Diagnostic[] = [];

      results.results.forEach((r: any) => {
        const range = new vscode.Range(
          new vscode.Position(r.start.line - 1, r.start.col - 1),
          new vscode.Position(r.end.line - 1, r.end.col - 1)
        );

        diagnostics.push(
          new vscode.Diagnostic(
            range,
            `[Semgrep] ${r.extra.message}`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      });

      callback(diagnostics);
    } catch (e) {
      console.error(`Parsing error: ${e}`);
    }
  });
}
