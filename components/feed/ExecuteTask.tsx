"use client";

import type { ExecuteContent } from "@/lib/types";
import CodeReadingExecute from "./execute/CodeReadingExecute";
import DebuggingExecute from "./execute/DebuggingExecute";
import ConceptMatchingExecute from "./execute/ConceptMatchingExecute";
import FillInBlankExecute from "./execute/FillInBlankExecute";
import SequenceOrderingExecute from "./execute/SequenceOrderingExecute";

interface ExecuteTaskProps {
  content: ExecuteContent;
  onComplete: (score: number) => void;
}

export default function ExecuteTask({ content, onComplete }: ExecuteTaskProps) {
  switch (content.taskType) {
    case "code-reading":
      return <CodeReadingExecute content={content} onComplete={onComplete} />;
    case "debugging":
      return <DebuggingExecute content={content} onComplete={onComplete} />;
    case "concept-matching":
      return (
        <ConceptMatchingExecute content={content} onComplete={onComplete} />
      );
    case "fill-in-blank":
      return <FillInBlankExecute content={content} onComplete={onComplete} />;
    case "sequence-ordering":
      return (
        <SequenceOrderingExecute content={content} onComplete={onComplete} />
      );
    default: {
      const _exhaustive: never = content;
      return null;
    }
  }
}
