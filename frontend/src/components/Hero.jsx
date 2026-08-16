import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram, FaFileDownload, FaCheck, FaCopy } from 'react-icons/fa';
import { SiLeetcode, SiCodeforces, SiExpress, SiTailwindcss, SiMongodb, SiHtml5, SiCss3, SiJavascript, SiC, SiPython, SiNodedotjs, SiReact } from 'react-icons/si';
import useTypingEffect from '../hooks/useTypingEffect';
import styles from '../styles/components/Hero.module.css';

const Hero = () => {
    const [expanded, setExpanded] = useState(false);
    const [terminalTab, setTerminalTab] = useState('bash');
    const [typedLines, setTypedLines] = useState([]);
    const [currentTypingText, setCurrentTypingText] = useState('');
    const [currentPrompt, setCurrentPrompt] = useState('vikas@dev:~$ ');
    const [copied, setCopied] = useState(false);
    const scrollWrapperRef = useRef(null);

    const titles = [
        'Software Developer',
        'Problem Solver',
        'UI/UX Enthusiast',
        'API Expert'
    ];

    const { text: typingText, cursor } = useTypingEffect(titles, 80, 40, 2000);

    const techIcons = [
        { Icon: SiHtml5, name: "HTML" },
        { Icon: SiCss3, name: "CSS" },
        { Icon: SiJavascript, name: "JavaScript" },
        { Icon: SiPython, name: "Python" },
        { Icon: SiC, name: "C" },
        { Icon: SiNodedotjs, name: "Node.js" },
        { Icon: SiExpress, name: "Express.js" },
        { Icon: SiReact, name: "React" },
        { Icon: SiTailwindcss, name: "Tailwind CSS" },
        { Icon: SiMongodb, name: "MongoDB" },
    ];

    // Scroll expansion detection
    useEffect(() => {
        const handleScroll = () => {
            if (scrollWrapperRef.current) {
                const rect = scrollWrapperRef.current.getBoundingClientRect();
                const scrolled = -rect.top;
                if (scrolled > 15) {
                    setExpanded(true);
                } else {
                    setExpanded(false);
                }
            } else {
                if (window.scrollY > 15) {
                    setExpanded(true);
                } else {
                    setExpanded(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Terminal typing animation sequence
    useEffect(() => {
        let isMounted = true;
        
        const steps = [
            { prompt: 'vikas@dev:~$ ', cmd: 'cd frontend', output: null, delayAfter: 600 },
            { prompt: 'vikas@dev:~/frontend$ ', cmd: 'npm run dev', output: '➜  Local: http://localhost:5173/  [Vite Ready ⚡]', delayAfter: 1200 },
            { prompt: 'vikas@dev:~$ ', cmd: 'cd server', output: null, delayAfter: 600 },
            { prompt: 'vikas@dev:~/server$ ', cmd: 'npm run dev', output: '⚡ Server running on port 5000 [MongoDB Connected 🚀]', delayAfter: 2000 },
        ];

        let stepIndex = 0;
        let charIndex = 0;
        let timeoutId = null;

        const runTerminalLoop = () => {
            if (!isMounted) return;

            if (stepIndex >= steps.length) {
                // Restart cycle after pause
                timeoutId = setTimeout(() => {
                    if (!isMounted) return;
                    setTypedLines([]);
                    setCurrentTypingText('');
                    stepIndex = 0;
                    charIndex = 0;
                    runTerminalLoop();
                }, 3000);
                return;
            }

            const currentStep = steps[stepIndex];
            setCurrentPrompt(currentStep.prompt);

            if (charIndex <= currentStep.cmd.length) {
                setCurrentTypingText(currentStep.cmd.slice(0, charIndex));
                charIndex++;
                timeoutId = setTimeout(runTerminalLoop, 65 + Math.random() * 30);
            } else {
                // Finished typing command line
                const completedLine = {
                    prompt: currentStep.prompt,
                    cmd: currentStep.cmd,
                    output: currentStep.output
                };

                setTypedLines(prev => [...prev, completedLine]);
                setCurrentTypingText('');
                charIndex = 0;
                stepIndex++;

                timeoutId = setTimeout(runTerminalLoop, currentStep.delayAfter);
            }
        };

        timeoutId = setTimeout(runTerminalLoop, 500);

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    const copyCodeSnippet = () => {
        let code = '';
        if (terminalTab === 'bash') {
            code = `cd frontend\nnpm run dev\ncd server\nnpm run dev`;
        } else if (terminalTab === 'vikas.json') {
            code = `{\n  "name": "Vikas V",\n  "role": "Software Developer",\n  "location": "Bangalore, India",\n  "status": "Building & Deploying 🚀",\n  "leetcode": "Vikasvkori129",\n  "codeforces": "vikasvkori12",\n  "openToWork": true\n}`;
        } else {
            code = `const techStack = {\n  frontend: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind"],\n  backend: ["Node.js", "Express.js", "REST APIs"],\n  languages: ["Python", "C", "JavaScript"],\n  databases: ["MongoDB", "SQL"],\n  core: ["DSA", "Full-Stack", "System Design"]\n};`;
        }
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.heroScrollWrapper} ref={scrollWrapperRef}>
            <section className={styles.heroSection} id="about">
                <div className={`${styles.heroCardBox} ${expanded ? styles.expanded : ''}`}>
                    <div className={styles.heroCardInner}>
                        {/* Left Info Column */}
                        <div className={styles.heroContent}>
                            <p className={styles.greeting}>Hello, I'm</p>
                            <h1 className={styles.title}>
                                Vikas <span className={styles.highlight}>V</span>
                            </h1>
                            <h2 className={styles.subtitle}>
                                <span className={styles.typingText}>
                                    {typingText}
                                    <span className={styles.cursor}>{cursor}</span>
                                </span>
                            </h2>
                            
                            <p className={styles.description}>
                                code — deploy — repeat
                            </p>

                            <div className={styles.socialLinks}>
                                <a href="https://leetcode.com/u/Vikasvkori129/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LeetCode" title="LeetCode">
                                    <SiLeetcode />
                                </a>
                                <a href="https://codeforces.com/profile/vikasvkori12" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Codeforces" title="Codeforces">
                                    <SiCodeforces />
                                </a>
                                <a href="https://github.com/vikasvkori1290" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub" title="GitHub">
                                    <FaGithub />
                                </a>
                                <a href="https://www.linkedin.com/in/vikas-v-4a4749330/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn" title="LinkedIn">
                                    <FaLinkedin />
                                </a>
                                <a href="https://www.instagram.com/_vikas_129_?igsh=MTAwb2w1cjRrdWZ1MQ==" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram" title="Instagram">
                                    <FaInstagram />
                                </a>
                                <a href="mailto:vikasvkori129@gmail.com" className={styles.socialIcon} aria-label="Email" title="Email">
                                    <FaEnvelope />
                                </a>
                            </div>

                            <div className={styles.ctaButtons}>
                                <Link to="/projects" className={styles.minimalProjectsBtn}>
                                    View Projects <span className={styles.btnArrow}>&rarr;</span>
                                </Link>
                                <a
                                    href="/vikas%20v's%20resume.pdf"
                                    download="Vikas_V_Resume.pdf"
                                    className={styles.minimalResumeBtn}
                                >
                                    <FaFileDownload className={styles.resumeIcon} /> Download Resume
                                </a>
                            </div>

                            {/* Tech I Use placed directly below action buttons */}
                            <div className={styles.techSection}>
                                <p className={styles.techLabel}>Tech I Use</p>
                                <div className={styles.techMarquee}>
                                    <div className={styles.marqueeTrack}>
                                        {techIcons.concat(techIcons).map((tech, index) => (
                                            <div key={index} className={styles.techIconItem}>
                                                <tech.Icon />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Interactive Code Terminal Column */}
                        <div className={styles.terminalWrapper}>
                            <div className={styles.codeTerminal}>
                                <div className={styles.terminalHeader}>
                                    <div className={styles.terminalDots}>
                                        <span className={`${styles.dot} ${styles.dotRed}`}></span>
                                        <span className={`${styles.dot} ${styles.dotYellow}`}></span>
                                        <span className={`${styles.dot} ${styles.dotGreen}`}></span>
                                    </div>

                                    <div className={styles.terminalTabs}>
                                        <button
                                            className={`${styles.tabBtn} ${terminalTab === 'bash' ? styles.tabActive : ''}`}
                                            onClick={() => setTerminalTab('bash')}
                                        >
                                            dev.sh
                                        </button>
                                        <button
                                            className={`${styles.tabBtn} ${terminalTab === 'vikas.json' ? styles.tabActive : ''}`}
                                            onClick={() => setTerminalTab('vikas.json')}
                                        >
                                            vikas.json
                                        </button>
                                        <button
                                            className={`${styles.tabBtn} ${terminalTab === 'skills.ts' ? styles.tabActive : ''}`}
                                            onClick={() => setTerminalTab('skills.ts')}
                                        >
                                            skills.ts
                                        </button>
                                    </div>

                                    <button 
                                        className={styles.copyBtn} 
                                        onClick={copyCodeSnippet}
                                        title="Copy Snippet"
                                        aria-label="Copy Code"
                                    >
                                        {copied ? <FaCheck style={{ color: '#4ade80' }} /> : <FaCopy />}
                                    </button>
                                </div>

                                <div className={styles.terminalBody}>
                                    {terminalTab === 'bash' && (
                                        <div className={styles.terminalConsole}>
                                            {typedLines.map((line, idx) => (
                                                <div key={idx} className={styles.consoleLineGroup}>
                                                    <div className={styles.consolePromptLine}>
                                                        <span className={styles.promptUser}>vikas@dev</span>
                                                        <span className={styles.promptSeparator}>:</span>
                                                        <span className={styles.promptPath}>{line.prompt.includes('frontend') ? '~/frontend' : line.prompt.includes('server') ? '~/server' : '~'}</span>
                                                        <span className={styles.promptSymbol}>$ </span>
                                                        <span className={styles.promptCommand}>{line.cmd}</span>
                                                    </div>
                                                    {line.output && (
                                                        <div className={styles.consoleOutputLine}>
                                                            {line.output}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Currently typing line */}
                                            <div className={styles.consolePromptLine}>
                                                <span className={styles.promptUser}>vikas@dev</span>
                                                <span className={styles.promptSeparator}>:</span>
                                                <span className={styles.promptPath}>{currentPrompt.includes('frontend') ? '~/frontend' : currentPrompt.includes('server') ? '~/server' : '~'}</span>
                                                <span className={styles.promptSymbol}>$ </span>
                                                <span className={styles.promptCommand}>{currentTypingText}</span>
                                                <span className={styles.terminalCursor}>█</span>
                                            </div>
                                        </div>
                                    )}

                                    {terminalTab === 'vikas.json' && (
                                        <pre className={styles.codeBlock}>
                                            <code>
<span className={styles.tokenPunctuation}>&#123;</span>{'\n'}
{'  '}<span className={styles.tokenKey}>"name"</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenString}>"Vikas V"</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>"role"</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenString}>"Software Developer"</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>"location"</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenString}>"Bangalore, India"</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>"status"</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenString}>"Building & Deploying 🚀"</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>"leetcode"</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenString}>"Vikasvkori129"</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>"codeforces"</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenString}>"vikasvkori12"</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>"openToWork"</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenBoolean}>true</span>{'\n'}
<span className={styles.tokenPunctuation}>&#125;</span>
                                            </code>
                                        </pre>
                                    )}

                                    {terminalTab === 'skills.ts' && (
                                        <pre className={styles.codeBlock}>
                                            <code>
<span className={styles.tokenKeyword}>const</span> <span className={styles.tokenVar}>techStack</span> <span className={styles.tokenPunctuation}>=</span> <span className={styles.tokenPunctuation}>&#123;</span>{'\n'}
{'  '}<span className={styles.tokenKey}>frontend</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenPunctuation}>[</span><span className={styles.tokenString}>"React"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"JS"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"Tailwind"</span><span className={styles.tokenPunctuation}>]</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>backend</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenPunctuation}>[</span><span className={styles.tokenString}>"Node.js"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"Express.js"</span><span className={styles.tokenPunctuation}>]</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>languages</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenPunctuation}>[</span><span className={styles.tokenString}>"Python"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"C"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"JavaScript"</span><span className={styles.tokenPunctuation}>]</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>databases</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenPunctuation}>[</span><span className={styles.tokenString}>"MongoDB"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"SQL"</span><span className={styles.tokenPunctuation}>]</span><span className={styles.tokenPunctuation}>,</span>{'\n'}
{'  '}<span className={styles.tokenKey}>core</span><span className={styles.tokenPunctuation}>:</span> <span className={styles.tokenPunctuation}>[</span><span className={styles.tokenString}>"DSA"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"FullStack"</span><span className={styles.tokenPunctuation}>,</span> <span className={styles.tokenString}>"REST APIs"</span><span className={styles.tokenPunctuation}>]</span>{'\n'}
<span className={styles.tokenPunctuation}>&#125;</span><span className={styles.tokenPunctuation}>;</span>
                                            </code>
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;
