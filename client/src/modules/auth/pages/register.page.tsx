import { AuthPageLayout } from '../layout/auth-page.layout';
import { RegisterForm } from '../components/register-form';

export default function RegisterPage() {
    return (
        <AuthPageLayout>
            <RegisterForm />
        </AuthPageLayout>
    );
}
