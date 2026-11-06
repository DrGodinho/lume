import { NextRequest, NextResponse } from 'next/server';

interface ExtractedPiece {
    ambiente: string;
    altura: number;
    largura: number;
    quantidade: number;
    observacoes?: string;
    confianca: 'alta' | 'media' | 'baixa';
}

interface VisionApiResponse {
    items: ExtractedPiece[];
    cliente?: string;
    bairro?: string;
    telefone?: string;
    resumoTexto?: string;
}

const SYSTEM_PROMPT = `Você é um assistente especialista em leitura e transcrição de medidas técnicas para vidraçaria e corte de películas (insulfilm).
Sua missão é analisar entradas multimodais (fotos de anotações manuais, textos digitados/mensagens do WhatsApp ou gravações de áudio de instaladores) e extrair uma lista de peças para cálculo de corte, além de dados do cliente quando mencionados.

REGRAS OBRIGATÓRIAS DE LEITURA E CONVERSÃO:
1. UNIDADE PADRÃO: O usuário mede predominantemente em CENTÍMETROS (cm).
   - "210 x 80" ou "210 por 80" -> altura: 210, largura: 80 (em cm).
   - Se falado ou anotado em metros (ex: "2.10 x 0.80", "2 e 15 por 80", "2 vírgula 10 por 80", "1 metro e 20 por 1 metro"), CONVERTA TUDO PARA CENTÍMETROS (ex: 210, 215, 120, 100).
   - Se em milímetros (ex: "2100 x 800"), CONVERTA PARA CENTÍMETROS (210 e 80).
   - Mantenha decimais se especificado (ex: "80,5 cm" -> 80.5, "115.8" -> 115.8).
   - Na vidraçaria, o maior valor ou primeiro número costuma ser a altura (vertical) e o outro a largura (horizontal). Preserve a lógica coerente de portas/janelas.
2. QUANTIDADE:
   - Identifique multiplicadores falados ou escritos: "4x", "4 peças", "4 pçs", "2 folhas", "3 vidros", "quatro janelas". Se houver multiplicador, defina quantidade com esse número. Se for apenas 1 peça, quantidade: 1.
3. AMBIENTE:
   - Identifique o cômodo / ambiente indicado (ex: "Varanda", "Sala", "Quarto Casal", "Cozinha", "Box", "Porta Principal"). Se não houver nome, use "Geral".
4. OBSERVAÇÕES:
   - Registre detalhes mencionados como tipo de película ("fumê", "nano cerâmica", "refletiva"), tipo de esquadria ("porta de correr", "fixo", "bandeira", "basculante") no campo 'observacoes'.
5. GRAU DE CONFIANÇA:
   - 'alta': letra ou áudio claro e nítido.
   - 'media': algum número pode estar com ruído ou caligrafia duvidosa.
   - 'baixa': áudio com eco inaudível ou letra ilegível.
6. DADOS DO CLIENTE E LOCALIZAÇÃO:
   - Se na anotação, cabeçalho, mensagem ou áudio for falado o nome do cliente (ex: "Cliente: Carla", "Orçamento pro Marcos", "Apto da Dra. Beatriz"), extraia em 'cliente'.
   - Se for citado o bairro ou cidade (ex: "Barra da Tijuca", "Recreio", "Copacabana", "Tijuca", "Ipanema"), extraia em 'bairro'.
   - Se houver número de contato ou telefone, extraia em 'telefone'.`;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Chave GEMINI_API_KEY não configurada no servidor.' },
                { status: 500 }
            );
        }

        const contentType = req.headers.get('content-type') || '';
        const parts: any[] = [{ text: SYSTEM_PROMPT }];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = (formData.get('file') || formData.get('image') || formData.get('audio')) as File | null;
            const textInput = formData.get('text') as string | null;

            if (textInput && textInput.trim()) {
                parts.push({
                    text: `Analise a seguinte mensagem/anotação de texto e extraia todas as medidas de vidros e dados do cliente encontrados:\n\n${textInput.trim()}`
                });
            } else if (file) {
                const rawMime = (file.type || '').split(';')[0].trim().toLowerCase();
                const fileName = (file.name || '').toLowerCase();
                const isAudio = rawMime.startsWith('audio/') || fileName.endsWith('.mp3') || fileName.endsWith('.ogg') || fileName.endsWith('.m4a') || fileName.endsWith('.wav') || fileName.endsWith('.webm');

                let resolvedMime = rawMime || 'application/octet-stream';
                if (isAudio) {
                    if (rawMime.includes('webm') || fileName.endsWith('.webm')) resolvedMime = 'audio/webm';
                    else if (rawMime.includes('ogg') || fileName.endsWith('.ogg')) resolvedMime = 'audio/ogg';
                    else if (rawMime.includes('mp4') || rawMime.includes('m4a') || fileName.endsWith('.m4a')) resolvedMime = 'audio/mp4';
                    else if (rawMime.includes('wav') || fileName.endsWith('.wav')) resolvedMime = 'audio/wav';
                    else if (rawMime.includes('mp3') || rawMime.includes('mpeg') || fileName.endsWith('.mp3')) resolvedMime = 'audio/mp3';
                    else resolvedMime = 'audio/webm';
                }

                const arrayBuffer = await file.arrayBuffer();
                const base64Data = Buffer.from(arrayBuffer).toString('base64');

                parts.push({
                    inlineData: {
                        mimeType: resolvedMime,
                        data: base64Data,
                    },
                });
                parts.push({
                    text: isAudio
                        ? 'Ouça este áudio de medição em português, transcreva e extraia todas as medidas de vidros, quantidades, ambientes e dados do cliente/bairro em formato JSON estrito conforme o schema.'
                        : 'Analise a imagem da anotação e extraia todas as medidas de vidros e dados do cliente/bairro encontrados no formato JSON estrito conforme o schema.'
                });
            } else {
                return NextResponse.json({ error: 'Nenhum arquivo ou texto enviado.' }, { status: 400 });
            }
        } else if (contentType.includes('application/json')) {
            const body = await req.json();

            if (body.text && typeof body.text === 'string' && body.text.trim()) {
                // Entrada via Texto Livre
                parts.push({
                    text: `Analise a seguinte mensagem/anotação de texto e extraia todas as medidas de vidros e dados do cliente encontrados:\n\n${body.text.trim()}`
                });
            } else if (body.audioBase64) {
                // Entrada via Áudio Base64
                const cleanBase64 = body.audioBase64.replace(/^data:audio\/[a-z0-9_-]+;base64,/, '');
                const rawMime = (body.mimeType || 'audio/webm').split(';')[0].trim().toLowerCase();
                parts.push({
                    inlineData: {
                        mimeType: rawMime.includes('webm') ? 'audio/webm' : (rawMime.includes('mp4') || rawMime.includes('m4a') ? 'audio/mp4' : rawMime),
                        data: cleanBase64,
                    },
                });
                parts.push({
                    text: 'Ouça este áudio de medição em português, transcreva com atenção e extraia todas as medidas de vidros, ambientes, quantidades e dados do cliente/bairro em formato JSON estrito conforme o schema.'
                });
            } else if (body.imageBase64) {
                // Entrada via Imagem Base64
                const cleanBase64 = body.imageBase64.replace(/^data:image\/[a-z0-9_-]+;base64,/, '');
                const mime = body.mimeType || 'image/jpeg';
                parts.push({
                    inlineData: {
                        mimeType: mime,
                        data: cleanBase64,
                    },
                });
                parts.push({
                    text: 'Analise a imagem da anotação e extraia todas as medidas de vidros e dados do cliente/bairro encontrados no formato JSON estrito conforme o schema.'
                });
            } else {
                return NextResponse.json({ error: 'Nenhum dado válido (text, imageBase64 ou audioBase64) fornecido.' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: 'Content-Type inválido.' }, { status: 400 });
        }

        const geminiPayload = {
            contents: [{ parts }],
            generationConfig: {
                responseMimeType: 'application/json',
                thinkingConfig: {
                    thinkingLevel: 'low',
                },
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        cliente: { type: 'STRING' },
                        bairro: { type: 'STRING' },
                        telefone: { type: 'STRING' },
                        items: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: {
                                    ambiente: { type: 'STRING' },
                                    altura: { type: 'NUMBER' },
                                    largura: { type: 'NUMBER' },
                                    quantidade: { type: 'INTEGER' },
                                    observacoes: { type: 'STRING' },
                                    confianca: { type: 'STRING', enum: ['alta', 'media', 'baixa'] },
                                },
                                required: ['ambiente', 'altura', 'largura', 'quantidade', 'confianca'],
                            },
                        },
                        resumoTexto: { type: 'STRING' },
                    },
                    required: ['items'],
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
            console.error('[Gemini Multimodal API Error]:', errBody);
            return NextResponse.json(
                { error: `Erro na comunicação com Google AI (${response.status}): ${errBody}` },
                { status: 502 }
            );
        }

        const data = await response.json();
        const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawJsonText) {
            return NextResponse.json(
                { error: 'O modelo não retornou conteúdo estruturado para esta entrada.' },
                { status: 500 }
            );
        }

        const parsed: VisionApiResponse = JSON.parse(rawJsonText);
        return NextResponse.json({
            success: true,
            items: parsed.items || [],
            cliente: parsed.cliente || '',
            bairro: parsed.bairro || '',
            telefone: parsed.telefone || '',
            resumoTexto: parsed.resumoTexto || '',
        });
    } catch (err: unknown) {
        console.error('[Multimodal Route Exception]:', err);
        const msg = err instanceof Error ? err.message : 'Erro interno ao processar medidas.';
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
