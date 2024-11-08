import React from 'react';

interface LetterSVGProps {
    letter: string; // Chữ cái để vẽ
}

const LetterSVG: React.FC<LetterSVGProps> = ({ letter }) => {
    const paths: any = {
        A: 'M10 80 L40 20 L70 80 Z', // Đường viền chữ "A" bằng SVG path
        B: 'M10 80 L10 20 L70 20 L70 30 L10 30 L10 80 Z', // Đường viền chữ "B"
        // Thêm các chữ cái khác nếu cần
    };

    return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d={paths[letter] || ''} stroke="black" fill="none" strokeWidth="2" />
        </svg>
    );
};

export default LetterSVG;
