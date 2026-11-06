import { NextRequest, NextResponse } from 'next/server';

interface Simulation100 {
    fitsAllPieces: boolean;
    maxY100: number;
    eficiencia100: number;
    metrosComprar100: number;
    metrosComprar152: number;
    diferencaMetros: number;
    economiaReais: number;
}

interface RetalhoNobre {
    largura: number;
    comprimento: number;
    areaM2: number;
}

interface CutAdvisorPayload {
    selectedFilm: string;
    filmName: string;
    currentRollW: number;
    currentMaxY: number;
    currentEficiencia: number;
    totalAreaM2: number;
    priceM2: number;
    canUseRoll100: boolean;
    roll100Simulation?: Simulation100;
    totalPecas: number;
    retalhoNobre?: RetalhoNobre;
}

const SYSTEM_PROMPT = `Você é o Consultor Estratégico de Rentabilidade e Corte de Películas da LUME.
Sua missão é emitir um diagnóstico comercial inteligente, direto e conciso (máximo 2 frases) para o operador da calculadora.

REGRAS DE CATÁLOGO BLUETECH (RIGOROSAMENTE OBRIGATÓRIAS):
1. Apenas a família NANO CERÂMICA (id: 'nano_ceramica' ou 'nano_ceramica_g20') tem opção de bobina de 1,00m (100cm) na Bluetech.
2. Todas as demais linhas (Carbono G5/G20, Refletiva, Dupla Camada, Jateado, Nano Carbon, Window Blue) só existem em bobina de 1,52m (152cm). NUNCA sugira bobina de 1,00m para películas que não sejam Nano Cerâmica!
3. Se o pedido for Nano Cerâmica e a bobina de 1,00m for mais vantajosa (e todas as peças couberem), destaque a economia real em metros e em reais.
4. Se o pedido for Nano Cerâmica mas alguma peça for maior que 1,00m (não cabe), alerte que a bobina de 1,52m é obrigatória para evitar emendas.
5. Se houver um Retalho Nobre identificado, mencione a utilidade da sobra (ex: janelas menores ou veículos) para evitar descarte.
6. Mantenha tom executivo, motivador e focado em lucro líquido.`;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Chave GEMINI_API_KEY não configurada no servidor.' },
                { status: 500 }
            );
        }

        const body: CutAdvisorPayload = await req.json();
        const {
            selectedFilm,
            filmName,
            currentRollW,
            currentMaxY,
            currentEficiencia,
            totalAreaM2,
            priceM2,
            canUseRoll100,
            roll100Simulation,
            totalPecas,
            retalhoNobre,
        } = body;

        const isNanoCeramica = selectedFilm === 'nano_ceramica' || selectedFilm === 'nano_ceramica_g20';

        const promptContext = `
DADOS DO CORTE ATUAL:
- Película: ${filmName || selectedFilm} (Família Nano Cerâmica Bluetech: ${isNanoCeramica ? 'SIM' : 'NÃO - Apenas 1,52m disponível'})
- Largura da Bobina Atual: ${currentRollW} cm
- Metro Linear Utilizado: ${(currentMaxY / 100).toFixed(2)} m
- Eficiência de Aproveitamento Atual: ${currentEficiencia.toFixed(1)}%
- Área de Vidros Total: ${totalAreaM2.toFixed(2)} m²
- Preço de Venda do m²: R$ ${priceM2.toFixed(2)}
- Total de Peças: ${totalPecas}

SIMULAÇÃO BOBINA 1,00m (BLUETECH):
${
    isNanoCeramica && roll100Simulation
        ? `- As peças cabem em 1,00m? ${roll100Simulation.fitsAllPieces ? 'SIM' : 'NÃO (peça muito larga)'}
- Metro linear em 1,00m: ${(roll100Simulation.maxY100 / 100).toFixed(2)} m
- Eficiência em 1,00m: ${roll100Simulation.eficiencia100.toFixed(1)}%
- Metros a Comprar em 1,52m: ${roll100Simulation.metrosComprar152} m
- Metros a Comprar em 1,00m: ${roll100Simulation.metrosComprar100} m
- Economia Estimada em Material: R$ ${roll100Simulation.economiaReais.toFixed(2)}`
        : `Linha sem opção de bobina de 1,00m na Bluetech. Manter bobina de 1,52m.`
}

RETALHO NOBRE DETECTADO:
${
    retalhoNobre
        ? `- Sobra contínua de ${retalhoNobre.largura}cm x ${retalhoNobre.comprimento}cm (${retalhoNobre.areaM2.toFixed(2)} m²).`
        : `Nenhum retalho grande contínuo.`
}
`;

        const geminiPayload = {
            contents: [
                {
                    parts: [
                        { text: SYSTEM_PROMPT },
                        { text: promptContext },
                        {
                            text: 'Gere a análise estratégica em JSON estrito conforme o schema. Forneça o status, a recomendação direta, a sugestão de ação de bobina (se houver) e destaque do retalho.'
                        }
                    ],
                },
            ],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        status: { type: 'STRING', enum: ['excelente', 'oportunidade', 'atencao'] },
                        titulo: { type: 'STRING' },
                        diagnostico: { type: 'STRING' },
                        sugestaoBobina: {
                            type: 'OBJECT',
                            properties: {
                                sugerirTroca: { type: 'BOOLEAN' },
                                novaLargura: { type: 'INTEGER' },
                                motivo: { type: 'STRING' },
                                economiaEstimada: { type: 'STRING' },
                            },
                            required: ['sugerirTroca'],
                        },
                        retalhoDestaque: {
                            type: 'OBJECT',
                            properties: {
                                existe: { type: 'BOOLEAN' },
                                descricao: { type: 'STRING' },
                                usoSugerido: { type: 'STRING' },
                            },
                            required: ['existe'],
                        },
                    },
                    required: ['status', 'titulo', 'diagnostico', 'sugestaoBobina', 'retalhoDestaque'],
                },
            },
        };

        const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload),
            }
        );

        if (!response.ok) {
            const errBody = await response.text();
            console.error('[Gemini Cut Advisor Error]:', errBody);
            return NextResponse.json(
                { error: `Erro na comunicação com Google AI (${response.status}): ${errBody}` },
                { status: 502 }
            );
        }

        const data = await response.json();
        const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawJsonText) {
            return NextResponse.json(
                { error: 'Não foi possível gerar análise para este corte.' },
                { status: 500 }
            );
        }

        const parsed = JSON.parse(rawJsonText);
        return NextResponse.json({
            success: true,
            analysis: parsed,
        });
    } catch (err: unknown) {
        console.error('[Cut Advisor Route Exception]:', err);
        const msg = err instanceof Error ? err.message : 'Erro interno ao consultar IA.';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

