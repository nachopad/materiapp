import { Button } from '@/shared/components/ui/button';
import { Header } from './components';

const HomePage = () => {
    return (
        <>
            <Header />
            <section className="px-4 min-h-screen w-full max-w-3xl mx-auto flex gap-4 md:justify-between justify-center items-center flex-col md:flex-row">
                <figure>
                    <img src="/pity.svg" alt="Spidy mascota" title="¡Hola! Soy Spidy" className="drop-shadow-2xl" />
                </figure>
                <hgroup className="max-w-[50ch] space-y-4">
                    <h1 className="text-2xl font-bold text-center">
                        ¡Sigue tu progreso universitario de forma efectiva y totalmente gratis!
                    </h1>
                    <div className="flex flex-col gap-4">
                        <Button size="lg">Empezar ahora</Button>
                        <Button size="lg" variant="secondary">
                            Ya tengo una cuenta
                        </Button>
                    </div>
                </hgroup>
            </section>
            {/* <section>publicidad</section> */}
            {/* <section className="w-full max-w-4xl px-4 outline mx-auto grid grid-cols-1 lg:grid-cols-2">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary">Efectivo y gratis</h1>
                    <p className="font-medium">
                        Simplifica tu vida universitaria. Con <span className="text-primary">MateriaApp</span> tienes
                        una herramienta de seguimiento profesional y precisa para todas tus materias y notas, sin pagar
                        un solo centavo. Tu progreso, a tu alcance y sin suscripciones.
                    </p>
                </div>
                <figure>
                    <img src="/assets/images/landing-page.png" alt="Landing page" />
                </figure>
            </section> */}
            <footer>Footer</footer>
        </>
    );
};

export default HomePage;
