import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { Database } from '../lib/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Company = Database['public']['Tables']['companies']['Row']

interface AuthState {
    user: User | null
    profile: Profile | null
    company: Company | null
    isLoading: boolean
    setUser: (user: User | null) => void
    setProfile: (profile: Profile | null) => void
    setCompany: (company: Company | null) => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    company: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setCompany: (company) => set({ company }),
    setLoading: (isLoading) => set({ isLoading })
}))
