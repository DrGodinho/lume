import { precoInsulfilmResidencialRioDeJaneiro } from './posts/preco-insulfilm-residencial-rio-de-janeiro';
import { comoProtegerSeusMoveisDosRaiosUv } from './posts/como-proteger-seus-moveis-dos-raios-uv';
import { comoProtegerMoveisDanosSol } from './posts/como-proteger-moveis-danos-sol';
import { guiaInsulfilmResidencial } from './posts/guia-insulfilm-residencial';
import { comoEscolherInsulfilmResidencial } from './posts/como-escolher-insulfilm-residencial';
import { elNino2026CasasMaisQuentesArCondicionado } from './posts/el-nino-2026-casas-mais-quentes-ar-condicionado';
import { cortinaPersianaOuInsulfilm } from './posts/cortina-persiana-ou-insulfilm';
import type { BlogPost } from '@/lib/blog';

export const blogPosts = [
  elNino2026CasasMaisQuentesArCondicionado,
  cortinaPersianaOuInsulfilm,
  precoInsulfilmResidencialRioDeJaneiro,
  comoProtegerMoveisDanosSol,
  comoProtegerSeusMoveisDosRaiosUv,
  guiaInsulfilmResidencial,
  comoEscolherInsulfilmResidencial,
] satisfies BlogPost[];
