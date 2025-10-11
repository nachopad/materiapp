export const Header = () => {
    return (
        <header className="p-4 w-full fixed top-0 left-0">
            <div className="w-full max-w-3xl mx-auto">
                <a href="/" className="flex items-center gap-2" title="Materiapp">
                    <img src="/materiapp.svg" alt="Logo" className="h-8" />
                    <h1 className="text-2xl font-bold text-primary">Materiapp</h1>
                </a>
            </div>
        </header>
    );
};
