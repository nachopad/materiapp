import { Button } from '@/shared/components/ui/button';
import { Header } from './components';

const HomePage = () => {
    return (
        <>
            <Header />
            <section className="px-4 min-h-screen w-full max-w-4xl mx-auto flex gap-4 md:justify-between justify-center items-center flex-col md:flex-row">
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
            <section className="min-h-screen w-full max-w-4xl px-4 mx-auto items-center flex flex-col gap-4 md:flex-row md:justify-between ">
                <div className="space-y-4 max-w-[60ch] order-1">
                    <h1 className="text-5xl font-bold text-primary">Efectivo y gratis</h1>
                    <p className="font-medium">
                        Simplifica tu vida universitaria. Con <span className="text-primary">MateriaApp</span> tienes
                        una herramienta de seguimiento profesional y precisa para todas tus materias y notas, sin pagar
                        un solo centavo. Tu progreso, a tu alcance y sin suscripciones.
                    </p>
                </div>
                <figure className="order-2">
                    <img src="/cellphone-materiapp.svg" alt="Landing page" className="w-56" />
                </figure>
            </section>
            <section className="min-h-screen w-full max-w-4xl px-4 mx-auto items-center flex flex-col gap-4 md:flex-row md:justify-between ">
                <div className="space-y-4  max-w-[60ch] order-1 md:order-2">
                    <h1 className="text-5xl font-bold text-primary">Controla tu carrera</h1>
                    <p className="font-medium">
                        No esperes a fin de año para saber cómo vas. Registra parciales y finales al momento. Ve tu
                        promedio actualizado y lo que te falta para el título, todo en un solo lugar.
                    </p>
                </div>
                <figure className="order-2 md:order-1">
                    <img src="/cellphone-materiapp.svg" alt="Landing page" className="w-56" />
                </figure>
            </section>
            <section className="min-h-screen w-full max-w-4xl px-4 mx-auto items-center flex flex-col gap-4 md:flex-row md:justify-between ">
                <div className="space-y-4 max-w-[60ch] order-1">
                    <h1 className="text-5xl font-bold text-primary">Adiós a las planillas</h1>
                    <p className="font-medium">
                        Deja de usar hojas de cálculo complejas y difíciles de leer. Con MateriaApp, tu progreso se
                        muestra de forma visual e intuitiva. Gráficos claros y resúmenes que te motivan a seguir
                        adelante.
                    </p>
                </div>
                <figure className="order-2">
                    <img src="/cellphone-materiapp.svg" alt="Landing page" className="w-56" />
                </figure>
            </section>
            <footer className="min-h-screen bg-primary">Footer</footer>
        </>
    );
};

export default HomePage;
