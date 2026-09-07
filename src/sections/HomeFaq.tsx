import { homeFaqs } from '../content/homeFaq';

export function HomeFaq() {
  return (
    <section className="py-20 bg-[#04080f]">
      <div className="container-lume max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-sm uppercase tracking-widest font-medium">Dúvidas frequentes</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-montserrat">
            Perguntas <span className="text-gradient-gold">Frequentes</span>
          </h2>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
            >
              <summary className="cursor-pointer list-none font-montserrat text-base md:text-lg font-bold text-white">
                {faq.q}
                <span className="float-right text-[#c9a227] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-7 text-gray-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
