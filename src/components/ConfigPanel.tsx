import React from 'react';
import { LogOut, Settings, X } from 'lucide-react';
import {
  AppConfig,
  FILM_TYPE_KEYS,
  FILM_TYPE_LABELS,
  FilmTypeKey,
} from '../lib/films';

interface ConfigPanelProps {
  aberto: boolean;
  setAberto: (v: boolean) => void;
  config: AppConfig;
  onUpdate: <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => void;
  onLogout?: () => void | Promise<void>;
  loggingOut?: boolean;
}

const inputClass = 'w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#c9a227]/50 transition-colors';
const centeredInputClass = `${inputClass} text-center`;

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

function FieldShortcut({ current, onAdjust, adjustLabel }: { current: string; onAdjust: () => void; adjustLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#040811] px-4 py-3">
      <div>
        <p className="text-[9px] uppercase text-gray-500 font-bold">Atual</p>
        <p className="text-sm font-bold text-white">{current}</p>
      </div>
      <button
        onClick={onAdjust}
        className="shrink-0 rounded-lg border border-[#c9a227]/40 bg-[#c9a227]/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#c9a227] transition-colors hover:bg-[#c9a227]/20"
      >
        {adjustLabel}
      </button>
    </div>
  );
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  aberto,
  setAberto,
  config,
  onUpdate,
  onLogout,
  loggingOut = false,
}) => {
  // A4: Algoritmo e Cor moram no painel principal — aqui é só atalho que foca o campo.
  const goToField = (targetId: string) => {
    setAberto(false);
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  };
  const algoritmoLabel =
    config.modoOtimizacao === 'densidade' ? 'Densidade' : config.modoOtimizacao === 'facilidade' ? 'Corte Fácil v1' : 'Corte Fácil v2';
  const corLabel = config.modoCorConfig === 'ambiente' ? 'Por ambiente' : 'Por tamanho';
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#070f1f] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-[#c9a227]" />
            <span className="font-bold text-sm uppercase tracking-wider">Configurações Padrão</span>
          </div>

          <div className="flex items-center gap-2">
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
                    {FILM_TYPE_LABELS[key]}
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
              <FieldLabel>Algoritmo</FieldLabel>
              <FieldShortcut current={algoritmoLabel} onAdjust={() => goToField('calc-algoritmo')} adjustLabel="Ajustar" />
              <HelpText>
                O ajuste mora no painel principal, junto ao mapa de corte.
              </HelpText>
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
              <FieldShortcut current={corLabel} onAdjust={() => goToField('calc-cor-esquema')} adjustLabel="Ajustar" />
              <HelpText>
                O ajuste mora no painel principal, junto às medidas. Usa uma cor única por ambiente ou cores por tamanho de cada peça.
              </HelpText>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <FieldLabel>Tempo de Auto-Save (min)</FieldLabel>
                <span className="text-[10px] text-white font-black bg-[#040811] border border-white/10 rounded-lg px-2 py-1">
                  {config.draftExpiration} min
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={120}
                step={5}
                value={config.draftExpiration}
                onChange={(e) => onUpdate('draftExpiration', parseInt(e.target.value, 10))}
                className="w-full accent-[#c9a227]"
              />
              <div className="flex justify-between text-[9px] text-gray-600 mt-1 font-bold uppercase">
                <span>0 (desligado)</span>
                <span>120 min</span>
              </div>
              <HelpText>
                Rascunhos salvos retomam apenas dentro desse tempo. Após isso, a calculadora abre vazia para novos clientes. Padrão: 15 min.
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
            {onLogout && (
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={onLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-red-300 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut size={14} />
                  {loggingOut ? 'Saindo...' : 'Sair da Conta'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {aberto && (
        <div onClick={() => setAberto(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
      )}
    </>
  );
};
