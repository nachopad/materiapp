import { MobilePageHeader } from '@/shared/components/mobile-page-header';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { ChangePasswordForm, PersonalInfoForm } from '../components';
import type { ChangePasswordFormValues, PersonalInfoFormValues } from '../schemas';
import { profileService } from '../services';
import { useUserStore } from '../store';

/**
 * Edit profile page with personal info and password change forms.
 */
export default function EditProfilePage() {
    const { user, updateProfile } = useUserStore();

    const handleUpdatePersonalInfo = useCallback(
        async (data: PersonalInfoFormValues) => {
            // TODO: Integrate with backend
            console.log('Update personal info:', data);
            await updateProfile({ fullName: data.fullName });
        },
        [updateProfile]
    );

    const handleChangePassword = useCallback(async (data: ChangePasswordFormValues) => {
        // TODO: Integrate with backend
        console.log('Change password:', data);
        await profileService.changePassword(data.currentPassword, data.newPassword);
    }, []);

    // Default values from user store or fallback
    const defaultPersonalInfo: PersonalInfoFormValues = {
        fullName: user?.fullName ?? '',
    };

    return (
        <>
            <MobilePageHeader title="Editar" backHref="/profile" showThemeToggle={false} />
            <PersonalInfoForm defaultValues={defaultPersonalInfo} onSubmit={handleUpdatePersonalInfo} />
            <Separator className="my-6" />
            <ChangePasswordForm onSubmit={handleChangePassword} />
            <Separator className="my-6" />
            <Button variant="link" className="text-destructive" icon={<Trash2 />}>
                Eliminar cuenta
            </Button>
        </>
    );
}
