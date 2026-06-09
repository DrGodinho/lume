import React from 'react';
import { Settings, X, Cloud, CloudOff, Loader2 } from 'lucide-react';

type FilmTypeKey = 'carbono' | 'refletiva' | 'dupla_camada' | 'nano_ceramica' | 'jateado';

const FILM_TYPE_LABELS: Record<FilmTypeKey, string> = {
  carbono: 'Carbono',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Cerâmica',
  jateado: 'Jateado',
};

interface AppConfig {
  rollW: number;
  price: number;
  margin: number;
  modoOtimizacao: 'densidade' | 'facilidade' | 'facilidade_v2';
  userName: string;
  modoPerdas: 'dinamico' | 'fixo';
  perdasFixas: number;
  modoCorConfig: 'ambiente' | 'tamanho';
  agressividadeCorte: number;
  filmTypes: Record<FilmTypeKey, number>;
  selectedFilm: FilmTypeKey;
}

interface ConfigPanelProps {
  aberto: boolean;
  setAberto: (v: boolean) => void;
  config: AppConfig;
  onUpdate: <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => void;
  cloudStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  aberto,
  setAberto,
  config,
  onUpdate,
  cloudStatus,
}) => {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#070f1f] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-[#c9a227]" />
            <span className="font-bold text-sm uppercase tracking-wider">Configuracoes Padrao</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" title={cloudStatus === 'synced' ? 'Sincronizado' : cloudStatus === 'syncing' ? 'Sincronizando...' : cloudStatus === 'error' ? 'Erro de sincronizacao' : 'Auto-save'}>
              {cloudStatus === 'syncing' && <Loader2 size={12} className="text-[#c9a227] animate-spin" />}
              {cloudStatus === 'synced' && <Cloud size={12} className="text-green-400" />}
              {cloudStatus === 'error' && <CloudOff size={12} className="text-red-400" />}
              {cloudStatus === 'idle' && <Cloud size={12} className="text-gray-600" />}
            </div>
            <button onClick={() => setAberto(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div>
            <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
              Alteracoes sao salvas automaticamente na nuvem.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Nome do Responsavel</label>
              <input
                type="text"
                value={config.userName}
                onChange={(e) => onUpdate('userName', e.target.value)}
                placeholder="Seu Nome"
                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#c9a227]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Largura do Rolo (cm)</label>
              <input
                type="number"
                value={config.rollW}
                onChange={(e) => onUpdate('rollW', parseFloat(e.target.value) || 0)}
                onFocus={(e) => e.target.select()}
                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
              />
            </div>
<div>
          <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Película Padrão</label>
          <select
            value={config.selectedFilm}
            onChange={(e) => onUpdate('selectedFilm', e.target.value as FilmTypeKey)}
            className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors appearance-none cursor-pointer"
          >
            {(Object.keys(FILM_TYPE_LABELS) as FilmTypeKey[]).map((key) => (
              <option key={key} value={key}>{FILM_TYPE_LABELS[key]} — R${config.filmTypes[key]}/m²</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Preços por Película (R$/m²)</label>
          <div className="space-y-2">
            {(Object.keys(FILM_TYPE_LABELS) as FilmTypeKey[]).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold w-24 truncate">{FILM_TYPE_LABELS[key]}</span>
                <input
                  type="number"
                  value={config.filmTypes[key]}
                  onChange={(e) => {
                    const updated = { ...config.filmTypes, [key]: parseFloat(e.target.value) || 0 };
                    onUpdate('filmTypes', updated);
                  }}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 bg-[#040811] border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
            <div>
              <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Margem de Corte (cm)</label>
              <input
                type="number"
                value={config.margin}
                onChange={(e) => onUpdate('margin', parseFloat(e.target.value) || 0)}
                onFocus={(e) => e.target.select()}
                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Algoritmo Padrao</label>
              <div className="flex bg-[#040811] border border-white/10 p-1 rounded-xl">
                <button
                  onClick={() => onUpdate('modoOtimizacao', 'densidade')}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${config.modoOtimizacao === 'densidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Densidade
                </button>
                <button
                  onClick={() => onUpdate('modoOtimizacao', 'facilidade')}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${config.modoOtimizacao === 'facilidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Facil v1
                </button>
                <button
                  onClick={() => onUpdate('modoOtimizacao', 'facilidade_v2')}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${config.modoOtimizacao === 'facilidade_v2' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Facil v2
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Modo de Perdas</label>
              <div className="flex bg-[#040811] border border-white/10 p-1 rounded-xl">
                <button
                  onClick={() => onUpdate('modoPerdas', 'dinamico')}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${config.modoPerdas === 'dinamico' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Dinamico
                </button>
                <button
                  onClick={() => onUpdate('modoPerdas', 'fixo')}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${config.modoPerdas === 'fixo' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Fixo
                </button>
              </div>
              <p className="text-[9px] text-gray-600 mt-2 leading-relaxed">
                {config.modoPerdas === 'dinamico'
                  ? 'Calcula a perda automaticamente com base na eficiencia do corte.'
                  : 'Aplica uma porcentagem fixa de perda sobre o subtotal.'}
              </p>
              {config.modoPerdas === 'fixo' && (
                <div className="mt-3">
                  <label className="block text-[9px] uppercase text-gray-400 font-bold mb-1">Porcentagem Fixa (%)</label>
                  <input
                    type="number"
                    value={config.perdasFixas}
                    onChange={(e) => onUpdate('perdasFixas', parseFloat(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()}
                    min={0}
                    max={100}
                    className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Modo de Cor</label>
              <div className="flex bg-[#040811] border border-white/10 p-1 rounded-xl">
                <button
                  onClick={() => onUpdate('modoCorConfig', 'ambiente')}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${config.modoCorConfig === 'ambiente' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Ambiente
                </button>
                <button
                  onClick={() => onUpdate('modoCorConfig', 'tamanho')}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${config.modoCorConfig === 'tamanho' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Tamanho
                </button>
              </div>
              <p className="text-[9px] text-gray-600 mt-2 leading-relaxed">
                {config.modoCorConfig === 'ambiente'
                  ? 'Usa uma cor unica por ambiente/identificacao.'
                  : 'Usa cores baseadas no tamanho de cada peca.'}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className="block text-[10px] uppercase text-[#c9a227] font-bold">Agressividade do Corte Facil v2</label>
                <span className="text-[10px] text-white font-black bg-[#040811] border border-white/10 rounded-lg px-2 py-1">
                  {config.agressividadeCorte}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={config.agressividadeCorte}
                onChange={(e) => onUpdate('agressividadeCorte', parseInt(e.target.value, 10))}
                className="w-full accent-[#c9a227]"
              />
              <div className="flex justify-between text-[9px] text-gray-600 mt-1 font-bold uppercase">
                <span>Mais linhas de corte</span>
                <span>Mais economico</span>
              </div>
              <p className="text-[9px] text-gray-600 mt-2 leading-relaxed">
                Valores menores aproximam bordas em linhas horizontais. Valores maiores apertam mais as pecas para economizar rolo.
              </p>
            </div>
          </div>
        </div>
      </div>
      {aberto && (
        <div onClick={() => setAberto(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
      )}
    </>
  );
};
