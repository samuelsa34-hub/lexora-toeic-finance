import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { PORTALS, PORTAL_BY_ID } from '../data/portals'
import type { PortalId, Portal, UserPortals } from '../types'

export interface UsePortalReturn {
  portal: Portal
  activePortal: PortalId
  userPortals: UserPortals
  switchPortal: (to: PortalId) => void
  canSwitchTo: (to: PortalId) => boolean
  isActive: (portalId: PortalId) => boolean
  portals: Portal[]
}

// Returns the active portal + exposes switchPortal().
// When flags.dualPortal is false, always returns Portal A ('english').
// Guarding the flag at the UI layer (not here) keeps this hook simple.
export function usePortal(): UsePortalReturn {
  const activePortal  = useAppStore(s => s.activePortal)
  const userPortals   = useAppStore(s => s.userPortals)
  const _switchPortal = useAppStore(s => s.switchPortal)

  const portal = PORTAL_BY_ID[activePortal] ?? PORTALS[0]

  const switchPortal = useCallback((to: PortalId) => {
    if (to !== activePortal) _switchPortal(to)
  }, [activePortal, _switchPortal])

  const canSwitchTo = useCallback((to: PortalId) => {
    return to === 'english' || userPortals[to] === true
  }, [userPortals])

  const isActive = useCallback((portalId: PortalId) => {
    return portalId === activePortal
  }, [activePortal])

  return { portal, activePortal, userPortals, switchPortal, canSwitchTo, isActive, portals: PORTALS }
}
