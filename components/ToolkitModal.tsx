import React, { useState, useEffect, useRef } from 'react';
import { 
    XIcon, 
    MenuIcon, 
    CodeIcon, 
    PlayIcon, 
    CheckIcon,
    TrophyIcon,
    TerminalIcon,
    ChevronRightIcon,
    FileIcon,
    MaximizeIcon,
    SendIcon,
    ChatIcon,
    WandIcon,
    BugIcon,
    SparklesIcon
} from './icons';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import Loader from './Loader';
import { useSoundEffects } from '../hooks/useSoundEffects';
import MagneticButton from './MagneticButton';
import { useTheme } from '../hooks/useTheme';

// Global declaration for Prism to avoid TS errors
declare const Prism: any;

interface ToolkitModalProps {
    isOpen: boolean;
    onClose: () => void;
    skill: string;
}

// ----------------------------------------------------------------------
// Component: Simple IDE Editor (Line Numbers + Prism)
// ----------------------------------------------------------------------
const SimpleCodeEditor: React.FC<{ code: string; onChange: (v: string) => void; language: string }> = ({ code, onChange, language }) => {
    const preRef = useRef<HTMLPreElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [lineCount, setLineCount] = useState(1);

    useEffect(() => {
        setLineCount(code.split('\n').length);
        if (typeof Prism !== 'undefined' && preRef.current) {
            Prism.highlightElement(preRef.current);
        }
    }, [code, language]);

    const handleScroll = () => {
        if (preRef.current && textareaRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const val = e.currentTarget.value;
            onChange(val.substring(0, start) + '  ' + val.substring(end));
            setTimeout(() => {
                if(textareaRef.current) textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
            }, 0);
        }
    };
    
    // Shared styles to ensure perfect alignment between textarea and pre
    const editorStyle: React.CSSProperties = {
        fontFamily: '"Fira Code", monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        padding: '1rem',
        margin: 0,
        border: 'none',
        tabSize: 2,
    };

    return (
        <div className="relative w-full h-full flex bg-[#1e1e1e] font-mono text-sm overflow-hidden group">
            {/* Line Numbers */}
            <div className="hidden md:block w-12 bg-[#252526] text-[#6e7681] text-right pr-3 pt-4 select-none border-r border-[#333] leading-[1.5] font-mono text-[14px]">
                {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
            </div>
            
            {/* Editor Area */}
            <div className="relative flex-grow h-full">
                <pre
                    ref={preRef}
                    aria-hidden="true"
                    className={`absolute inset-0 pointer-events-none overflow-hidden whitespace-pre z-0`}
                    style={editorStyle}
                >
                    <code className={`language-${language}`}>{code}</code>
                </pre>
                <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white outline-none resize-none whitespace-pre z-10 selection:bg-[#264f78]"
                    style={editorStyle}
                />
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Main Toolkit Modal
// ----------------------------------------------------------------------
export default function ToolkitModal({ isOpen, onClose, skill }: ToolkitModalProps) {
    const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'codeforces'>('learn');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { playClick, playOpen, playClose, playHover } = useSoundEffects();
    
    // Content State
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Practice State
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    
    // AI Fix State
    const [isFixing, setIsFixing] = useState(false);
    const [fixSuggestion, setFixSuggestion] = useState<{fixedCode: string, explanation: string} | null>(null);

    // Codeforces State
    const [problems, setProblems] = useState<any[]>([]);
    const [currentProblem, setCurrentProblem] = useState<any>(null);
    const [verdict, setVerdict] = useState<string>('');
    const [isJudging, setIsJudging] = useState(false);

    useEffect(() => {
        if (isOpen) {
            playOpen();
            setActiveTab('learn');
            generateTutorial('Intro');
            setCode(skill === 'Python' ? `print("Hello ${skill}!")` : `console.log("Hello ${skill}!");`);
        }
    }, [isOpen, skill]);

    const generateTutorial = async (topic: string) => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Write a W3Schools-style HTML tutorial about ${skill} ${topic}. Include <h2>Title</h2>, <p>Explanation</p>, and a code block inside <pre class="language-${skill.toLowerCase()}">.</pre> NO markdown.`;
            const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [{role: 'user', parts:[{text:prompt}]}] });
            setContent(res.text);
        } catch {
            setContent("<h2>Error loading content</h2><p>Please check your connection.</p>");
        } finally {
            setIsLoading(false);
        }
    };
    
    const loadProblems = async () => {
        if(problems.length > 0) return;
        setIsLoading(true);
        try {
             // Mock data for stability, normally AI generated
             const mocks = [
                 { id: 1, title: 'Sum of Two', diff: 'A', desc: 'Given two integers a and b, return their sum.', input: '1 2', output: '3' },
                 { id: 2, title: 'Factorial', diff: 'B', desc: 'Calculate N!', input: '5', output: '120' },
                 { id: 3, title: 'Palindrome', diff: 'C', desc: 'Check if string is palindrome.', input: 'radar', output: 'true' }
             ];
             setProblems(mocks);
             setCurrentProblem(mocks[0]);
        } finally {
            setIsLoading(false);
        }
    };

    const runCode = async () => {
        setIsJudging(true);
        setOutput("Compiling...\nRunning...");
        setVerdict('');
        
        await new Promise(r => setTimeout(r, 1000)); // Sim delay
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a code interpreter for ${skill}. Code: ${code}. Output the result only.`;
            const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [{role:'user', parts:[{text:prompt}]}] });
            setOutput(res.text);
            
            if(activeTab === 'codeforces' && currentProblem) {
                // Heuristic check
                if(res.text.trim().includes(currentProblem.output)) {
                    setVerdict('ACCEPTED');
                } else {
                    setVerdict('WRONG ANSWER');
                }
            }
        } catch {
            setOutput("Runtime Error");
            setVerdict('Runtime Error');
        } finally {
            setIsJudging(false);
        }
    };

    // ----------------------------------------------------------------------
    // AI Architect Logic (Advanced Auto-Fix)
    // ----------------------------------------------------------------------
    const handleAutoFix = async () => {
        if (!code.trim()) return;
        setIsFixing(true);
        setFixSuggestion(null);
        playClick();

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `
                Act as a Senior Software Architect and Code Reviewer for ${skill}.
                Analyze the following code for syntax errors, logical bugs, and performance issues.
                
                Code:
                ${code}
                
                Return a JSON object with the following schema:
                {
                    "fixedCode": "The complete fixed code string",
                    "explanation": "A concise explanation of what was wrong and how you fixed it."
                }
            `;

            const res = await ai.models.generateContent({ 
                model: 'gemini-2.5-flash', 
                contents: [{role: 'user', parts: [{text: prompt}]}],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            fixedCode: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        },
                        required: ["fixedCode", "explanation"]
                    }
                }
            });

            // Robust JSON extraction: Find the first '{' and last '}' to ignore markdown wrappers
            const text = res.text;
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            
            if (start === -1 || end === -1) {
                throw new Error("Invalid JSON format");
            }
            
            const jsonStr = text.substring(start, end + 1);
            const result = JSON.parse(jsonStr);
            
            setFixSuggestion(result);
            playOpen(); // Sound effect for result ready

        } catch (e) {
            console.error("AI Fix Error:", e);
            setOutput("AI Error: Could not analyze code. Please try again.");
        } finally {
            setIsFixing(false);
        }
    };

    const applyFix = () => {
        if (fixSuggestion) {
            setCode(fixSuggestion.fixedCode);
            setFixSuggestion(null);
            playClick();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 animate-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] bg-[#1e1e1e] text-[#d4d4d4] flex flex-col md:rounded-xl shadow-2xl overflow-hidden border border-[#333] font-sans">
                
                {/* Header */}
                <header className="h-12 bg-[#252526] flex items-center justify-between px-4 border-b border-[#333] shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-[#333] rounded"><MenuIcon size={18}/></button>
                        <div className="flex items-center gap-2 font-bold text-gray-200">
                            <CodeIcon size={16} className="text-green-500" />
                            <span>{skill} Toolkit</span>
                        </div>
                    </div>
                    
                    <div className="flex bg-[#1e1e1e] rounded border border-[#333]">
                        {['learn', 'practice', 'codeforces'].map((t) => (
                            <button 
                                key={t} 
                                onClick={() => { setActiveTab(t as any); if(t === 'codeforces') loadProblems(); }}
                                className={`px-4 py-1.5 text-xs font-bold uppercase ${activeTab === t ? 'bg-[#007acc] text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button onClick={onClose} className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded"><XIcon size={18}/></button>
                </header>

                {/* Body */}
                <div className="flex-grow flex overflow-hidden">
                    
                    {/* Sidebar */}
                    <div className={`${sidebarOpen ? 'w-60' : 'w-0'} bg-[#252526] border-r border-[#333] flex-shrink-0 transition-all duration-300 overflow-y-auto`}>
                        {activeTab === 'learn' && (
                            <div className="py-2">
                                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Tutorial</div>
                                {['Intro', 'Syntax', 'Variables', 'Data Types', 'Loops'].map(topic => (
                                    <button 
                                        key={topic} 
                                        onClick={() => generateTutorial(topic)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2d2e] hover:text-white border-l-2 border-transparent hover:border-green-500"
                                    >
                                        {skill} {topic}
                                    </button>
                                ))}
                            </div>
                        )}
                        {activeTab === 'codeforces' && (
                             <div className="py-2">
                                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Problem Set</div>
                                {problems.map(p => (
                                    <button 
                                        key={p.id}
                                        onClick={() => setCurrentProblem(p)}
                                        className={`w-full text-left px-4 py-3 border-b border-[#333] hover:bg-[#2a2d2e] ${currentProblem?.id === p.id ? 'bg-[#37373d]' : ''}`}
                                    >
                                        <div className="text-xs font-bold flex justify-between">
                                            <span>{p.diff}</span>
                                            <span className="text-green-500">Solve</span>
                                        </div>
                                        <div className="text-sm truncate">{p.title}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow flex flex-col md:flex-row min-w-0">
                        
                        {/* Left Panel (Tutorial or Problem Desc) */}
                        <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 md:border-r border-[#333] ${activeTab === 'practice' ? 'hidden md:block w-1/3 max-w-sm' : ''}`}>
                            {activeTab === 'learn' ? (
                                <>
                                    {isLoading ? <Loader /> : (
                                        <div className="prose prose-invert max-w-none prose-pre:bg-[#111] prose-pre:border prose-pre:border-[#333]">
                                            <div dangerouslySetInnerHTML={{ __html: content }} />
                                            <div className="mt-8 p-6 bg-[#2d2d2d] rounded border border-[#333] shadow-lg">
                                                <h3 className="text-xl font-bold text-white mb-2">{skill} Exercise</h3>
                                                <p className="text-gray-400 mb-4">Test your skills with our interactive editor.</p>
                                                <button 
                                                    onClick={() => setActiveTab('practice')}
                                                    className="bg-[#04AA6D] hover:bg-[#059862] text-white px-6 py-2.5 rounded font-bold shadow-md transition-transform active:scale-95"
                                                >
                                                    Try it Yourself &raquo;
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : activeTab === 'codeforces' ? (
                                <div className="prose prose-invert">
                                    {currentProblem ? (
                                        <>
                                            <h1 className="text-2xl font-bold flex gap-3 items-center">
                                                <span className="text-green-400 text-lg border border-green-400 rounded px-2">{currentProblem.diff}</span>
                                                {currentProblem.title}
                                            </h1>
                                            <p>{currentProblem.desc}</p>
                                            <div className="bg-[#333] p-3 rounded">
                                                <div className="text-xs uppercase text-gray-500">Input</div>
                                                <code className="text-sm">{currentProblem.input}</code>
                                            </div>
                                            <div className="bg-[#333] p-3 rounded mt-2">
                                                <div className="text-xs uppercase text-gray-500">Output</div>
                                                <code className="text-sm">{currentProblem.output}</code>
                                            </div>
                                        </>
                                    ) : <div className="flex items-center justify-center h-64">Select a problem</div>}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center opacity-50">
                                    <CodeIcon size={64} className="mb-4"/>
                                    <h2 className="text-xl font-bold">Practice Arena</h2>
                                    <p>Write and run {skill} code on the right.</p>
                                </div>
                            )}
                        </div>

                        {/* Right Panel (Editor) */}
                        {(activeTab === 'practice' || activeTab === 'codeforces') && (
                            <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
                                {/* Editor Toolbar */}
                                <div className="h-10 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <FileIcon size={14}/> main.{skill === 'Python' ? 'py' : 'js'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={handleAutoFix}
                                            disabled={isFixing || isJudging}
                                            className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-3 py-1 rounded text-xs font-bold transition-all disabled:opacity-50 border border-purple-500/30 hover:border-purple-500 group"
                                            title="AI Auto-Fix Code"
                                        >
                                           {isFixing ? <Loader size="sm" /> : <WandIcon size={12} className="group-hover:animate-pulse" />}
                                           {isFixing ? 'Analyzing...' : 'Fix Code'}
                                        </button>
                                        <button 
                                            onClick={runCode}
                                            disabled={isJudging || isFixing}
                                            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors disabled:opacity-50"
                                        >
                                            <PlayIcon size={12}/> {isJudging ? 'Running...' : 'Run Code'}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex-grow relative">
                                    <SimpleCodeEditor code={code} onChange={setCode} language={skill.toLowerCase()} />
                                    
                                    {/* AI Fix Suggestion Overlay */}
                                    {fixSuggestion && (
                                        <div className="absolute inset-0 bg-[#1e1e1e]/95 backdrop-blur-sm z-20 flex flex-col p-6 animate-in">
                                            <div className="flex items-center justify-between mb-4 border-b border-purple-500/30 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-500/20 rounded-full">
                                                        <SparklesIcon size={20} className="text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white">AI Architect Suggestion</h3>
                                                        <p className="text-xs text-gray-400">Review the changes before applying.</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setFixSuggestion(null)} className="text-gray-500 hover:text-white"><XIcon size={20}/></button>
                                            </div>
                                            
                                            <div className="flex-grow overflow-auto custom-scrollbar mb-4 bg-black/30 rounded border border-[#333] p-4 font-mono text-sm">
                                                <div className="mb-4 text-purple-300 italic border-l-2 border-purple-500 pl-3 py-1 bg-purple-900/10">
                                                    "{fixSuggestion.explanation}"
                                                </div>
                                                <div className="text-gray-400 text-xs uppercase mb-2">Proposed Code:</div>
                                                <pre className="text-green-400">{fixSuggestion.fixedCode}</pre>
                                            </div>
                                            
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    onClick={() => setFixSuggestion(null)}
                                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                                                >
                                                    Discard
                                                </button>
                                                <button 
                                                    onClick={applyFix}
                                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-sm shadow-lg shadow-purple-900/20 flex items-center gap-2"
                                                >
                                                    <CheckIcon size={16} />
                                                    Apply Fix
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Verdict Overlay */}
                                    {activeTab === 'codeforces' && verdict && (
                                        <div className={`absolute top-4 right-4 px-4 py-2 rounded shadow-xl font-bold text-sm animate-in flex items-center gap-2 ${
                                            verdict === 'ACCEPTED' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                        }`}>
                                            {verdict === 'ACCEPTED' ? <CheckIcon size={16}/> : <XIcon size={16}/>}
                                            {verdict}
                                        </div>
                                    )}
                                </div>

                                {/* Terminal */}
                                <div className="h-1/3 border-t border-[#333] flex flex-col">
                                    <div className="h-8 bg-[#252526] px-3 flex items-center gap-4 text-xs font-bold border-b border-[#333]">
                                        <span className="border-b-2 border-blue-500 pb-2 translate-y-[9px] text-white">TERMINAL</span>
                                    </div>
                                    <div className="flex-grow bg-[#1e1e1e] p-3 font-mono text-sm text-gray-300 overflow-auto whitespace-pre-wrap">
                                        {output || <span className="text-gray-600 italic">Ready to execute...</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}