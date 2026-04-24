import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';
import { Info } from 'lucide-react';

interface SpecTooltipProps {
    term: 'VLT' | 'UVR' | 'IRR' | 'TSER';
    children: React.ReactNode;
}

const descriptions = {
    VLT: {
        title: 'VLT (Visible Light Transmission)',
        text: 'Percentual de luz visível que atravessa o vidro com película aplicada. Valores mais baixos indicam películas mais escuras, que bloqueiam mais luz. Por exemplo, VLT de 5% significa que apenas 5% da luz visível passa pelo vidro, resultando em maior privacidade, enquanto VLT de 70% mantém o ambiente bem iluminado.',
    },
    UVR: {
        title: 'UVR (UV Rejection)',
        text: 'Percentual de radiação ultravioleta bloqueada pela película. Raios UV são responsáveis pelo desbotamento de móveis, pisos, estofados e obras de arte, além de serem prejudiciais à saúde da pele. Películas de qualidade rejeitam 99% ou mais da radiação UV.',
    },
    IRR: {
        title: 'IRR (Infrared Rejection)',
        text: 'Percentual de radiação infravermelha bloqueada. A radiação infravermelha é a principal responsável pela sensação de calor solar. Maiores índices de IRR significam maior conforto térmico, pois menos calor atravessa o vidro. Películas cerâmicas de alta performance atingem até 97% de rejeição de infravermelho.',
    },
    TSER: {
        title: 'TSER (Total Solar Energy Rejected)',
        text: 'Medida mais completa do desempenho térmico da película, representa o percentual total de energia solar rejeitada, incluindo luz visível, ultravioleta e infravermelho. TSER é o melhor indicador para comparar a eficiência geral de diferentes películas, pois considera todos os comprimentos de onda da radiação solar.',
    },
};

export function SpecTooltip({ term, children }: SpecTooltipProps) {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dotted border-[#c9a227]/50 hover:border-[#c9a227] transition-colors inline-flex items-center gap-1 group">
                        {children}
                        <Info size={14} className="text-[#c9a227] opacity-50 group-hover:opacity-100 transition-opacity" />
                    </span>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-[300px] p-4 bg-[#04080f] border border-[#c9a227]/30 text-white rounded-xl shadow-2xl"
                >
                    <div className="space-y-2">
                        <h4 className="font-bold text-[#c9a227] text-sm font-montserrat">{descriptions[term].title}</h4>
                        <p className="text-xs leading-relaxed text-gray-200">{descriptions[term].text}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
