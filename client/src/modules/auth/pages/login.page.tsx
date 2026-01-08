import { AuthPageLayout } from '../layout/auth-page.layout';
import { LoginForm } from '../components/login-form';

export default function LoginPage() {
    return (
        <AuthPageLayout>
            <LoginForm />
        </AuthPageLayout>
    );
}
