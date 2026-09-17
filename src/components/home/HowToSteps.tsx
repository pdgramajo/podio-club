const steps = [
  { num: '01', title: 'Elegí tu remera', text: 'Talle y color incluidos en cada producto.' },
  { num: '02', title: 'Armá tu pedido', text: 'Agregá al carrito todo lo que quieras.' },
  { num: '03', title: 'Pedí por WhatsApp', text: 'El detalle va listo en tu mensaje.' },
]

export default function HowToSteps() {
  return (
    <section className="border-t border-line bg-paper-2 py-14">
      <div className="mx-auto max-w-[1120px] px-6">
        <header className="mb-12 max-w-[34rem] text-center">
          <p className="mb-2.5 font-display text-[0.78rem] font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Así de simple
          </p>
          <h2 className="m-0 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-semibold uppercase">
            Cómo pedir
          </h2>
        </header>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center px-4 py-2 text-center">
              <span className="mb-3 font-display text-[2.8rem] font-bold leading-none text-gold">
                {s.num}
              </span>
              <h3 className="mb-1.5 text-[1rem] font-semibold uppercase">{s.title}</h3>
              <p className="m-0 text-[0.95rem] text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
