import { readFileSync } from 'fs';
import path from 'path';

export default async function PolicyPage() {
  const privacyPolicyPath = path.join(process.cwd(), 'docs', 'PRIVACY.md');
  const privacyPolicyMarkdown = readFileSync(privacyPolicyPath, 'utf8');

  return (
    <div className="w-full min-h-[70vh] bg-background flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-4xl m-auto bg-muted rounded-2xl shadow-lg p-6 md:p-10 space-y-6">
        <h1 className="text-4xl font-extrabold text-center">Privacy Policy</h1>
        <div className="overflow-auto max-h-[75vh] custom-scrollbar">
          <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed">
            {privacyPolicyMarkdown}
          </pre>
        </div>
      </div>
    </div>
  );
}

