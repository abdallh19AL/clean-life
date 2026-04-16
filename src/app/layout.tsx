"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class"      // 👈 هاد السطر هو "مفتاح الحل"
      defaultTheme="dark"    // خليه يبلش بالوضع الليلي افتراضياً
      enableSystem={true}    // عشان يتبع نظام الجهاز إذا بدك
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}