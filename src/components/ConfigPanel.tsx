import React from 'react';
import { Cloud, CloudOff, Loader2, Settings, X } from 'lucide-react';

type FilmTypeKey = 'carbono' | 'refletiva' | 'dupla_camada' | 'nano_ceramica' | 'jateado';
type OptimizationMode = 'densidade' | 'facilidade' | 'facilidade_v2';
type LossMode = 'dinamico' | 'fixo';
type ColorMode = 'ambiente' | 'tamanho';
type CloudStatus = 'idle' | 'syncing' | 'synced' | 'error';

const FILM_TYPE_LABELS: Record<FilmTypeKey, string> = {
  carbono: 'Carbono',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Cerâmica',
  jateado: 'Jateado',
};

const FILM_TYPE_KEYS = Object.keys(FILM_TYPE_LABELS) as FilmTypeKey[];
const inputClass = 'w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#c9a227]/50 transition-colors';
const centeredInputClass = `${inputClass} text-center`;

interface AppConfig {
  rollW: number;
  price: number;
  margin: number;
  modoOtimizacao: OptimizationMode;
  userName: string;
  modoPerdas: LossMode;
  perdasFixas: number;
  modoCorConfig: ColorMode;
  agressividadeCorte: number;
  filmTypes: Record<FilmTypeKey, number>;
  selectedFilm: FilmTypeKey;
}

interface ConfigPanelProps {
  aberto: boolean;
  setAberto: (v: boolean) => void;
  config: AppConfig;
  onUpdate: <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => void;
  cloudStatus: CloudStatus;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">
      {children}
    </label>
  );
}

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] text-gray-600 mt-2 leading-relaxed">{children}</p>;
}

function NumberField({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      onFocus={(e) => e.target.select()}
      min={min}
      max={max}
      step={step}
      className={centeredInputClass}
    />
  );
}

function SegmentGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ label: string; value: T }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex bg-[#040811] border border-white/10 p-1 rounded-xl">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
            value === option.value ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function CloudIndicator({ status }: { status: CloudStatus }) {
  const title =
    status === 'synced'
      ? 'Sincronizado'
      : status === 'syncing'
        ? 'Sincronizando...'
        : status === 'error'
          ? 'Erro de sincronização'
          : 'Auto-save';

  return (
    <div className="flex items-center gap-1" title={title}>
      {status === 'syncing' && <Loader2 size={12} className="text-[#c9a227] animate-spin" />}
      {status === 'synced' && <Cloud size={12} className="text-green-400" />}
      {status === 'error' && <CloudOff size={12} className="text-red-400" />}
      {status === 'idle' && <Cloud size={12} className="text-gray-600" />}
    </div>
  );
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
            <span className="font-bold text-sm uppercase tracking-wider">Configurações Padrão</span>
          </div>

          <div className="flex items-center gap-2">
            <CloudIndicator status={cloudStatus} />
            <button onClick={() => setAberto(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
            Alterações são salvas automaticamente na nuvem.
          </p>

          <div className="space-y-4">
            <div>
              <FieldLabel>Nome do Responsável</FieldLabel>
              <input
                type="text"
                value={config.userName}
                onChange={(e) => onUpdate('userName', e.target.value)}
                placeholder="Seu Nome"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel>Largura do Rolo (cm)</FieldLabel>
                <NumberField value={config.rollW} onChange={(value) => onUpdate('rollW', value)} />
              </div>

              <div>
                <FieldLabel>Margem de Corte (cm)</FieldLabel>
                <NumberField value={config.margin} onChange={(value) => onUpdate('margin', value)} />
              </div>
            </div>

            <div>
              <FieldLabel>Película Padrão</FieldLabel>
              <select
                value={config.selectedFilm}
                onChange={(e) => onUpdate('selectedFilm', e.target.value as FilmTypeKey)}
                className={`${centeredInputClass} appearance-none cursor-pointer`}
              >
                {FILM_TYPE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {FILM_TYPE_LABELS[key]} - R${config.filmTypes[key]}/m²
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Preços por Película (R$/m²)</FieldLabel>
              <div className="space-y-2">
                {FILM_TYPE_KEYS.map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-bold w-24 truncate">
                      {FILM_TYPE_LABELS[key]}
                    </span>
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
              <FieldLabel>Algoritmo Padrão</FieldLabel>
              <SegmentGroup
                value={config.modoOtimizacao}
                onChange={(value) => onUpdate('modoOtimizacao', value)}
                options={[
                  { label: 'Densidade', value: 'densidade' },
                  { label: 'Fácil v1', value: 'facilidade' },
                  { label: 'Fácil v2', value: 'facilidade_v2' },
                ]}
              />
            </div>

            <div className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/[0.04] p-4">
              <FieldLabel>Comportamento do Botao de Perdas</FieldLabel>
              <SegmentGroup
                value={config.modoPerdas}
                onChange={(value) => onUpdate('modoPerdas', value)}
                options={[
                  { label: 'Dinâmico', value: 'dinamico' },
                  { label: 'Fixo', value: 'fixo' },
                ]}
              />
              <HelpText>
                {config.modoPerdas === 'dinamico'
                  ? 'O botao usa a eficiencia do corte atual para calcular a perda automaticamente.'
                  : 'O botao aplica sempre a porcentagem fixa configurada abaixo.'}
              </HelpText>

              <div className="mt-3">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <label className="block text-[9px] uppercase text-gray-400 font-bold">
                    Porcentagem fixa (%)
                  </label>
                  <span className={`text-[9px] font-black uppercase ${config.modoPerdas === 'fixo' ? 'text-[#f5d77a]' : 'text-gray-600'}`}>
                    {config.modoPerdas === 'fixo' ? 'ativa' : 'reserva'}
                  </span>
                </div>
                <NumberField
                  value={config.perdasFixas}
                  onChange={(value) => onUpdate('perdasFixas', value)}
                  min={0}
                  max={100}
                  step={0.5}
                />
                <HelpText>
                  Padrao recomendado: 20%. Este valor fica salvo mesmo quando o modo dinamico esta ativo.
                </HelpText>
              </div>
            </div>

            <div>
              <FieldLabel>Modo de Cor</FieldLabel>
              <SegmentGroup
                value={config.modoCorConfig}
                onChange={(value) => onUpdate('modoCorConfig', value)}
                options={[
                  { label: 'Ambiente', value: 'ambiente' },
                  { label: 'Tamanho', value: 'tamanho' },
                ]}
              />
              <HelpText>
                {config.modoCorConfig === 'ambiente'
                  ? 'Usa uma cor única por ambiente/identificação.'
                  : 'Usa cores baseadas no tamanho de cada peça.'}
              </HelpText>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <FieldLabel>Agressividade do Corte Fácil v2</FieldLabel>
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
                <span>Mais econômico</span>
              </div>
              <HelpText>
                Valores menores aproximam bordas em linhas horizontais. Valores maiores apertam mais as peças para economizar rolo.
              </HelpText>
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
