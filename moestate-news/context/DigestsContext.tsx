'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Digest } from '@/lib/validation'
import { loadDigests, saveDigest, deleteDigest, getDigestById, StoredDigest } from '@/lib/persist'

interface DigestsContextType {
  digests: Digest[]
  addDigest: (digest: Omit<Digest, 'id' | 'createdAt' | 'updatedAt'>) => Digest
  updateDigest: (id: string, digest: Partial<Digest>) => void
  removeDigest: (id: string) => void
  getDigest: (id: string) => Digest | null
  isLoading: boolean
}

const DigestsContext = createContext<DigestsContextType | undefined>(undefined)

export const DigestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [digests, setDigests] = useState<Digest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loaded = loadDigests()
    setDigests(loaded as Digest[])
    setIsLoading(false)
  }, [])

  const addDigest = useCallback((digestData: Omit<Digest, 'id' | 'createdAt' | 'updatedAt'>): Digest => {
    const now = new Date().toISOString()
    const newDigest: Digest = {
      ...digestData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    
    saveDigest(newDigest as StoredDigest)
    setDigests((prev) => [...prev, newDigest])
    return newDigest
  }, [])

  const updateDigest = useCallback((id: string, updates: Partial<Digest>) => {
    setDigests((prev) => {
      const updated = prev.map((d) =>
        d.id === id
          ? { ...d, ...updates, updatedAt: new Date().toISOString() }
          : d
      )
      const found = updated.find((d) => d.id === id)
      if (found) {
        saveDigest(found as StoredDigest)
      }
      return updated
    })
  }, [])

  const removeDigest = useCallback((id: string) => {
    deleteDigest(id)
    setDigests((prev) => prev.filter((d) => d.id !== id))
  }, [])

  const getDigest = useCallback((id: string): Digest | null => {
    return getDigestById(id) as Digest | null
  }, [])

  return (
    <DigestsContext.Provider
      value={{
        digests,
        addDigest,
        updateDigest,
        removeDigest,
        getDigest,
        isLoading,
      }}
    >
      {children}
    </DigestsContext.Provider>
  )
}

export const useDigests = () => {
  const context = useContext(DigestsContext)
  if (context === undefined) {
    throw new Error('useDigests must be used within a DigestsProvider')
  }
  return context
}

