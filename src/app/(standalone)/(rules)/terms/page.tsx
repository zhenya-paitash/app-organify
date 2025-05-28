import { readFileSync } from 'fs';
import path from 'path';

export default async function TermsPage() {
  const termsPath = path.join(process.cwd(), 'docs', 'TERMS.md');
  const termsMarkdown = readFileSync(termsPath, 'utf8');

  return (
    <div className="w-full min-h-[70vh] bg-background flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-4xl bg-muted rounded-2xl shadow-lg p-6 md:p-10 space-y-6">
        <h1 className="text-4xl font-extrabold text-center">Terms of Service</h1>
        <div className="overflow-auto max-h-[75vh] custom-scrollbar">
          <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed">
            {termsMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
}

