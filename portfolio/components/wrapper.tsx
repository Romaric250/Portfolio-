"use client"
import React, { useEffect } from 'react'


const Wrapper = ({children}:{children:React.ReactNode}) => {

    const [mounted, setMounted] = React.useState(false);

    useEffect(() =>{
        setMounted(true)
    })
    if (!mounted) return null;
  return (
    <>{children}</>
  )
}

export default Wrapper