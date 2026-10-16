import { Navigate, useLocation } from 'react-router-dom';

/** Every old front-door address opens THE landing page, keeping codes in the address. */
export const LANDING_PATH = '/launch/landingpage';
export function ToLanding() {
  const { search, hash } = useLocation();
  return <Navigate to={`${LANDING_PATH}${search}${hash}`} replace />;
}
