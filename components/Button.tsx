import Image from 'next/image';
import React, { MouseEventHandler } from 'react'

type Props = {
    type?: 'button' | 'submit';
    title: string;
    leftIcon?: string | null;
    rightIcon?: string | null;
    isSubmitting?: boolean;
    bgColor?: string;
    textColor?: string;
    handleClick?: MouseEventHandler;
}

const Button = ({ type = 'button', title, bgColor, textColor, handleClick, isSubmitting, leftIcon, rightIcon }: Props) => {
    return (
        <button
            type={type}
            disabled={isSubmitting}
            className={`
                flexStart gap-3 px-4 py-3 rounded-xl text-sm font-medium max-md:w-full
                ${textColor || 'text-white'}
                ${isSubmitting ? 'bg-black/50' : bgColor ? bgColor : 'bg-primary-purple'}
            `}
            onClick={handleClick}
        >
            {leftIcon && (
                <Image src={leftIcon} alt='left' width={14} height={14} />
            )}
            {title}
            {rightIcon && (
                <Image src={rightIcon} alt='right' width={14} height={14} />
            )}
        </button>
    )
}

export default Button