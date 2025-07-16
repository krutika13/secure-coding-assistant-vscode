"use strict";
// export async function askCodeLlama(prompt: string): Promise<string> {
//   const fetch = (await import('node-fetch')).default;
Object.defineProperty(exports, "__esModule", { value: true });
exports.askCodeLlama = askCodeLlama;
//   try {
//     const res = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'codellama:7b',
//         prompt,
//         stream: false
//       })
//     });
//     const json = await res.json() as { response?: string };
//     console.log('🔍 Full Ollama response:', JSON.stringify(json, null, 2));
//     if (json.response && json.response.trim() !== '') {
//       return json.response.trim();
//     }
//     return '⚠️ CodeLlama did not return any meaningful response.';
//   } catch (error) {
//     console.error('❌ Error talking to Ollama:', error);
//     return 'Failed to connect to CodeLlama';
//   }
// }
async function askCodeLlama(prompt) {
    const fetch = (await import('node-fetch')).default;
    try {
        const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'codellama:7b-instruct',
                prompt,
                stream: false
            })
        });
        const json = await res.json();
        console.log('🔍 Full Ollama response:', JSON.stringify(json, null, 2));
        if (json.response) {
            const clean = json.response
                .replace(/```[\s\S]*?```/g, '') // remove code blocks
                .replace(/\n+/g, ' ') // collapse line breaks
                .replace(/["'`]/g, '') // strip quotes
                .trim();
            // Take just the first sentence or ~100 chars
            const singleLine = clean.split('. ')[0].slice(0, 100);
            return singleLine + (singleLine.endsWith('.') ? '' : '...');
        }
        return '⚠️ CodeLlama did not return any meaningful response.';
    }
    catch (error) {
        console.error('❌ Error talking to Ollama:', error);
        return '❌ Failed to connect to CodeLlama.';
    }
}
//# sourceMappingURL=ollama.js.map