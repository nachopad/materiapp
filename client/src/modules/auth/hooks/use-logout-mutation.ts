import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { useAuthStore } from '../store/auth.store';

export function useLogoutMutation() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => useAuthStore.getState().logout(),
        onSuccess: () => {
            navigate('/login', { replace: true });
        },
    });
}
