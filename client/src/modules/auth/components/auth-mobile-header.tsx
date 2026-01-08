import { Pity } from '@/assets/icons';

export function AuthMobileHeader() {
    return (
        <header className="lg:hidden text-center">
            <h1 className="text-3xl font-bold text-primary">Materiapp</h1>
            <figure className="flex justify-center py-4">
                <Pity className="w-16 h-auto" />
            </figure>
        </header>
    );
}
