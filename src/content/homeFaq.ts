/**
 * FAQ da página principal — fonte única consumida pela seção visível
 * (`HomeFaq`) e pelo JSON-LD `FAQPage` (SEO). O conteúdo do schema precisa
 * ser idêntico ao visível na página.
 */
export interface HomeFaq {
  q: string;
  a: string;
}

export const homeFaqs: HomeFaq[] = [
  {
    q: 'Quanto custa insulfilm residencial no Rio de Janeiro?',
    a: 'De R$ 80/m² (carbono) a R$ 200/m² (nano cerâmica), com instalação. Uma janela de 1 m² sai a partir de R$ 80 e uma porta de vidro de 1,60 m² fica em torno de R$ 144 na refletiva.',
  },
  {
    q: 'Vocês atendem o meu bairro?',
    a: 'Nossa base é a Zona Oeste — Bangu, Campo Grande, Realengo, Jacarepaguá, Barra da Tijuca, Recreio e Sulacap — e atendemos também outros bairros da cidade do Rio de Janeiro. Chame no WhatsApp informando seu bairro que confirmamos o atendimento.',
  },
  {
    q: 'O insulfilm tem garantia?',
    a: 'Sim. A LUME dá 2 anos de garantia contra descolamento, bolhas e desbotamento precoce, além da garantia do fabricante da película.',
  },
  {
    q: 'Existe película com privacidade à noite?',
    a: 'Sim: a jateada, por ser fosca, bloqueia a visão nos dois sentidos de dia e de noite. Já refletiva e carbono dependem da diferença de luz — à noite, com a casa iluminada, quem está fora enxerga dentro; nesses casos indicamos cortina nos quartos.',
  },
  {
    q: 'Como peço um orçamento?',
    a: 'Envie pelo WhatsApp uma foto das janelas ou portas de vidro, as medidas aproximadas e seu bairro. Na maioria dos casos passamos o preço sem precisar de visita técnica.',
  },
  {
    q: 'Quanto tempo leva a instalação?',
    a: 'Uma janela leva minutos e uma casa ou apartamento inteiro costuma ficar pronto no mesmo dia, sem sujeira de obra. Nos primeiros 5 dias após instalar, é só não limpar os vidros.',
  },
];
