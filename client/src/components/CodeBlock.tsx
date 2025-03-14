import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '10px' }}>
      <button
        onClick={copyToClipboard}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: '#444',
          color: '#fff',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        📋 Копировать
      </button>
      <SyntaxHighlighter language={language} style={oneDark}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
