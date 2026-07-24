'use client'

import React from 'react'
import { MorritInspector as Inspector } from '../runtime/Inspector'

export function MorritInspector() {
  if (process.env.NODE_ENV !== 'development') return null
  return React.createElement(Inspector, null)
}
