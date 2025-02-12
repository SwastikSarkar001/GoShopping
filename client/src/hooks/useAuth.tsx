import { defaultUserProfile } from '../states/reducers/userSlice';
import { useAppSelector } from '../states/store';

/**
 * Custom hook to retrieve the authenticated user state.
 *
 * This hook uses the `useAppSelector` to access the user state from the Redux store.
 * It compares the current user state with the `initialUserState` to determine if the user is authenticated.
 *
 * @returns Returns t he user state if the user is authenticated, otherwise returns null.
 *
 * @example
 * const user = useAuth();
 * if (user) {
 *   console.log('User is authenticated', user);
 * } else {
 *   console.log('User is not authenticated');
 * }
 */
const useAuth = () => {
  const userData = useAppSelector(state => state.user.data)
  return (userData === defaultUserProfile.data) ? null : userData
}

export default useAuth