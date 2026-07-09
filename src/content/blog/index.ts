import { precoInsulfilmResidencialRioDeJaneiro } from './posts/preco-insulfilm-residencial-rio-de-janeiro';
import { comoProtegerSeusMoveisDosRaiosUv } from './posts/como-proteger-seus-moveis-dos-raios-uv';
import { comoProtegerMoveisDanosSol } from './posts/como-proteger-moveis-danos-sol';
import { guiaInsulfilmResidencial } from './posts/guia-insulfilm-residencial';
import { comoEscolherInsulfilmResidencial } from './posts/como-escolher-insulfilm-residencial';
import { cortinaPersianaOuInsulfilm } from './posts/cortina-persiana-ou-insulfilm';
import type { BlogPost } from '@/lib/blog';

export const blogPosts = [
  cortinaPersianaOuInsulfilm,
  precoInsulfilmResidencialRioDeJaneiro,
  comoProtegerMoveisDanosSol,
  comoProtegerSeusMoveisDosRaiosUv,
  guiaInsulfilmResidencial,
  comoEscolherInsulfilmResidencial,
] satisfies BlogPost[];
