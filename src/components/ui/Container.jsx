"use client";

import React from 'react';

export default function Container({
  children,
  className = "",
  maxWidth = "max-w-7xl",
  padding = "px-4 sm:px-6 lg:px-8",
  ...props
}) {
  return (
    <div 
      className={`${maxWidth} ${padding} mx-auto w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
