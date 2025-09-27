'use client'

import React from 'react'

interface JsonLdProps {
  type: string
  data: Record<string, unknown>
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
}

export default JsonLd
