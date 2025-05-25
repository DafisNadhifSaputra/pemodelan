import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {  // Function to process markdown and LaTeX
  const processContent = (text: string): React.ReactElement => {
    // Split content by lines
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentParagraph: string[] = [];
    
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ').trim();
        if (paragraphText) {
          elements.push(
            <p key={elements.length} className="mb-3 text-slate-300 leading-relaxed">
              {processInlineContent(paragraphText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Empty line - flush current paragraph
      if (!trimmedLine) {
        flushParagraph();
        return;
      }      // Headers
      if (trimmedLine.startsWith('#### ')) {
        flushParagraph();
        elements.push(
          <h5 key={elements.length} className="text-base font-semibold text-sky-100 mt-4 mb-2">
            {processInlineContent(trimmedLine.slice(5))}
          </h5>
        );
        return;
      }
      
      if (trimmedLine.startsWith('### ')) {
        flushParagraph();
        elements.push(
          <h4 key={elements.length} className="text-lg font-semibold text-sky-200 mt-5 mb-2">
            {processInlineContent(trimmedLine.slice(4))}
          </h4>
        );
        return;
      }
      
      if (trimmedLine.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold text-sky-300 mt-6 mb-3 border-b border-slate-600 pb-2">
            {processInlineContent(trimmedLine.slice(3))}
          </h3>
        );
        return;
      }
      
      if (trimmedLine.startsWith('# ')) {
        flushParagraph();
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold text-sky-400 mt-8 mb-4">
            {processInlineContent(trimmedLine.slice(2))}
          </h2>
        );
        return;
      }      // Code blocks
      if (trimmedLine.startsWith('```')) {
        flushParagraph();
        // This is a simple implementation - for full support, you'd need to handle multi-line code blocks
        elements.push(
          <div key={elements.length} className="my-4 p-3 bg-slate-800 rounded-md border border-slate-600">
            <code className="text-sky-200 text-sm font-mono">
              {trimmedLine.slice(3)}
            </code>
          </div>
        );
        return;
      }
      
      // Inline code with backticks
      if (trimmedLine.includes('`') && !trimmedLine.startsWith('`')) {
        flushParagraph();
        const processedLine = trimmedLine.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-700 text-sky-200 rounded text-sm font-mono">$1</code>');
        elements.push(
          <p key={elements.length} className="mb-3 text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
        );
        return;
      }
      
      // Bold text with ** (full line)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length > 4) {
        flushParagraph();
        elements.push(
          <p key={elements.length} className="mb-3 font-semibold text-sky-300">
            {processInlineContent(trimmedLine.slice(2, -2))}
          </p>
        );
        return;
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(trimmedLine)) {
        flushParagraph();
        const listContent = trimmedLine.replace(/^\d+\.\s/, '');
        elements.push(
          <ol key={elements.length} className="mb-3 ml-4">
            <li className="text-slate-300 mb-1 list-decimal">
              {processInlineContent(listContent)}
            </li>
          </ol>
        );
        return;
      }
        // List items (both - and * bullets)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        flushParagraph();
        elements.push(
          <ul key={elements.length} className="mb-3 ml-4">
            <li className="text-slate-300 mb-1 list-disc">
              {processInlineContent(trimmedLine.slice(2))}
            </li>
          </ul>
        );
        return;
      }
      
      // Block math (standalone LaTeX)
      if (trimmedLine.startsWith('$$') && trimmedLine.endsWith('$$')) {
        flushParagraph();
        const math = trimmedLine.slice(2, -2);
        elements.push(
          <div key={elements.length} className="my-4 text-center">
            <BlockMath math={math} />
          </div>
        );
        return;
      }
      
      // Regular paragraph line
      currentParagraph.push(line);
    });
    
    // Flush any remaining paragraph
    flushParagraph();

    return <div>{elements}</div>;
  };  // Function to process inline content (bold, italic, inline math)
  const processInlineContent = (text: string): (string | React.ReactElement)[] => {
    let key = 0;
    
    // First, extract and preserve all LaTeX expressions
    const mathExpressions: string[] = [];
    const mathPlaceholder = "___MATH_PLACEHOLDER___";
    
    // Replace all math expressions with placeholders
    let remaining = text.replace(/\$([^$]+)\$/g, (_, mathContent) => {
      mathExpressions.push(mathContent);
      return `${mathPlaceholder}${mathExpressions.length - 1}${mathPlaceholder}`;
    });
    
    // Process bold/italic on text without LaTeX
    const processedParts = processBoldItalic(remaining, key);
    
    // Replace placeholders back with LaTeX components
    const finalParts: (string | React.ReactElement)[] = [];
    processedParts.forEach((part, index) => {
      if (typeof part === 'string') {
        // Split by math placeholders and reconstruct
        const segments = part.split(new RegExp(`${mathPlaceholder}(\\d+)${mathPlaceholder}`, 'g'));
        for (let i = 0; i < segments.length; i++) {
          if (segments[i] !== undefined && segments[i] !== '') {
            if (/^\d+$/.test(segments[i])) {
              // This is a math expression index
              const mathIndex = parseInt(segments[i]);
              if (mathExpressions[mathIndex]) {
                finalParts.push(
                  <InlineMath key={`math-${key}-${i}`} math={mathExpressions[mathIndex]} />
                );
              }
            } else {
              // This is regular text
              finalParts.push(segments[i]);
            }
          }
        }
      } else {
        // This is a React element (bold/italic), check if it contains math placeholders
        if (React.isValidElement(part) && part.props && typeof (part.props as any).children === 'string') {
          const childText = (part.props as any).children;
          if (childText.includes(mathPlaceholder)) {
            // Process math inside the element
            const segments = childText.split(new RegExp(`${mathPlaceholder}(\\d+)${mathPlaceholder}`, 'g'));
            const childParts: (string | React.ReactElement)[] = [];
            
            for (let i = 0; i < segments.length; i++) {
              if (segments[i] !== undefined && segments[i] !== '') {
                if (/^\d+$/.test(segments[i])) {
                  const mathIndex = parseInt(segments[i]);
                  if (mathExpressions[mathIndex]) {
                    childParts.push(
                      <InlineMath key={`math-${key}-${index}-${i}`} math={mathExpressions[mathIndex]} />
                    );
                  }
                } else {
                  childParts.push(segments[i]);
                }
              }
            }
            
            finalParts.push(
              React.cloneElement(part, { key: `elem-${key}-${index}` }, childParts)
            );
          } else {
            finalParts.push(part);
          }
        } else {
          finalParts.push(part);
        }
      }
    });
    
    return finalParts;
  };// Function to process bold and italic text
  const processBoldItalic = (text: string, startKey: number): (string | React.ReactElement)[] => {
    const parts: (string | React.ReactElement)[] = [];
    let remaining = text;
    let key = startKey;
    
    while (remaining.length > 0) {
      // Bold text with **text** (prioritize over single *)
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      if (boldMatch) {
        const beforeBold = remaining.slice(0, boldMatch.index);
        if (beforeBold) parts.push(beforeBold);
        
        parts.push(
          <strong key={`bold-${key}`} className="font-semibold text-sky-300">
            {boldMatch[1]}
          </strong>
        );
        key++;
        
        remaining = remaining.slice((boldMatch.index || 0) + boldMatch[0].length);
      } else {
        // Check for bold italic with ***text***
        const boldItalicMatch = remaining.match(/\*\*\*([^*]+)\*\*\*/);
        if (boldItalicMatch) {
          const beforeBoldItalic = remaining.slice(0, boldItalicMatch.index);
          if (beforeBoldItalic) parts.push(beforeBoldItalic);
          
          parts.push(
            <strong key={`bolditalic-${key}`} className="font-semibold italic text-sky-300">
              {boldItalicMatch[1]}
            </strong>
          );
          key++;
          
          remaining = remaining.slice((boldItalicMatch.index || 0) + boldItalicMatch[0].length);
        } else {
          // Check for italic text with *text* (only if not part of **)
          const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
          if (italicMatch) {
            const beforeItalic = remaining.slice(0, italicMatch.index);
            if (beforeItalic) parts.push(beforeItalic);
            
            parts.push(
              <em key={`italic-${key}`} className="italic text-sky-200">
                {italicMatch[1]}
              </em>
            );
            key++;
            
            remaining = remaining.slice((italicMatch.index || 0) + italicMatch[0].length);
          } else {
            // No more formatting, add the rest as plain text
            if (remaining) parts.push(remaining);
            break;
          }
        }
      }
    }
    
    return parts;
  };

  return (
    <div className={`prose prose-sm prose-invert max-w-none ${className}`}>
      {processContent(content)}
    </div>
  );
};

export default MarkdownRenderer;
