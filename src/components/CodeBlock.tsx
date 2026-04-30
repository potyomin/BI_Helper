import { Copy } from "lucide-react";
import Button from "./Button";

type CodeBlockProps = {
  code: string;
  title?: string;
  onCopy?: () => void;
  maxHeightClassName?: string;
};

const CodeBlock = ({ code, title = "Код", onCopy, maxHeightClassName = "max-h-[460px]" }: CodeBlockProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-soft">
    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-300">
      <span>{title}</span>
      {onCopy ? (
        <Button variant="ghost" className="h-8 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800" onClick={onCopy}>
          <Copy size={14} />
          Копировать
        </Button>
      ) : null}
    </div>
    <pre className={`overflow-auto p-4 text-xs leading-relaxed text-slate-100 ${maxHeightClassName}`}>
      <code>{code}</code>
    </pre>
  </div>
);

export default CodeBlock;
