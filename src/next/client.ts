'use client'

import React from 'react'
import { VilsonInspector as Inspector } from '../runtime/Inspector'

export function VilsonInspector() {
  if (process.env.NODE_ENV !== 'development') return null
  return React.createElement(Inspector, null)
}
