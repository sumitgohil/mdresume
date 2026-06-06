import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type DirectiveNode = {
  type: "textDirective" | "leafDirective" | "containerDirective";
  name: string;
  data?: {
    hName?: string;
    hProperties?: Record<string, string>;
  };
};

const RESUME_DIRECTIVE_CLASSES: Record<string, string> = {
  accent: "resume-accent",
  muted: "resume-muted",
};

export const remarkResumeDirectives: Plugin = () => {
  return (tree) => {
    visit(tree, ["textDirective", "leafDirective", "containerDirective"], (node: DirectiveNode) => {
      const className = RESUME_DIRECTIVE_CLASSES[node.name];
      if (!className) return;

      node.data = {
        ...node.data,
        hName: "span",
        hProperties: {
          ...node.data?.hProperties,
          className,
        },
      };
    });
  };
};
