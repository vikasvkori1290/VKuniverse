import { useState, useEffect } from 'react';

/**
 * Custom hook for typing animation effect
 * @param {string[]} texts - Array of texts to type
 * @param {number} typingSpeed - Speed of typing in milliseconds
 * @param {number} deletingSpeed - Speed of deleting in milliseconds
 * @param {number} pauseDuration - Pause duration before deleting
 */
const useTypingEffect = (
    texts = [],
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000
) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        if (!texts || texts.length === 0) return;

        const fullText = texts[currentTextIndex];

        if (isTyping) {
            if (currentText.length < fullText.length) {
                const timeout = setTimeout(() => {
                    setCurrentText(fullText.slice(0, currentText.length + 1));
                }, typingSpeed);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setIsTyping(false);
                }, pauseDuration);
                return () => clearTimeout(timeout);
            }
        } else {
            if (currentText.length > 0) {
                const timeout = setTimeout(() => {
                    setCurrentText(currentText.slice(0, -1));
                }, deletingSpeed);
                return () => clearTimeout(timeout);
            } else {
                setIsTyping(true);
                setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
            }
        }
    }, [currentText, isTyping, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

    // Cursor blink effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, []);

    return { text: currentText, cursor: showCursor ? '|' : ' ' };
};

export default useTypingEffect;
