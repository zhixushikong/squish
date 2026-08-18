import { ShieldCheck } from 'lucide-react';
import { copy } from '../copy/zh';

export function PrivacyNotice() {
  return (
    <p className="mt-4 inline-flex max-w-2xl items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-left text-sm text-emerald-800">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{copy.privacyOneLiner}</span>
    </p>
  );
}
