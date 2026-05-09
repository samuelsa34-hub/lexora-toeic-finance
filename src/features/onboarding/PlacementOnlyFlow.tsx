import React from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingFlow from './OnboardingFlow'

export default function PlacementOnlyFlow() {
  const navigate = useNavigate()
  return <OnboardingFlow initialStep="intro" onComplete={() => navigate('/')} />
}
