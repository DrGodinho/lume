'use client';

import { format } from 'date-fns';
import { DateFieldWithPicker } from './DateFieldWithPicker';
import { WhatsAppTemplateMenu } from './WhatsAppTemplateMenu';
import type { CalculatorHistoryRow, CommercialActionDraft, Lead, LeadFormValues, LeadStatusHistoryEntry } from '../types';

interface LeadFormModalProps {
  isOpen: boolean;
  selectedLead: Lead | null;
  linkedOrcamento: CalculatorHistoryRow | null;
  activeFilmOptions: string[];
  neighborhoods: string[];
  leadForm: LeadFormValues;
  setLeadForm: (leadForm: LeadFormValues) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
  onOpenHistory: () => void;
  formatDateInputValue: (value?: string | null) => string;
}

export function LeadFormModal({
  isOpen,
  selectedLead,
  linkedOrcamento,
  activeFilmOptions,
  neighborhoods,
  leadForm,
  setLeadForm,
  onClose,
  onSubmit,
  onOpenHistory,
  formatDateInputValue,
}: LeadFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm transition duration-300">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#07111d] p-6 text-white shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-white/40 hover:text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="border-b border-white/5 pb-4 font-display text-xl font-black tracking-tight text-white">
          {selectedLead ? 'Editar Informações do Lead' : 'Cadastrar Novo Lead Comercial'}
        </h3>

        <form onSubmit={(event) => void onSubmit(event)} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Nome do Cliente *</label>
            <input
              type="text"
              required
              placeholder="Nome completo do lead"
              value={leadForm.name}
              onChange={(event) => setLeadForm({ ...leadForm, name: event.target.value })}
              className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
            />
          </div>

          {selectedLead && linkedOrcamento && (
            <div className="space-y-3 rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/5 p-4">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Orçamento do Supabase Encontrado
                </h4>
                <span className="text-[10px] text-white/40">
                  {linkedOrcamento.created_at ? new Date(linkedOrcamento.created_at).toLocaleDateString('pt-BR') : '—'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Película:</span>
                  <span className="font-semibold text-white">{linkedOrcamento.modo_otimizacao || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Valor:</span>
                  <span className="font-bold text-[#c9a227]">
                    {linkedOrcamento.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Qtd Vidros:</span>
                  <span className="font-semibold text-white">{linkedOrcamento.qtd || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Desconto:</span>
                  <span className="font-semibold text-emerald-400">
                    {linkedOrcamento.desconto ? `${linkedOrcamento.desconto}%` : '—'}
                  </span>
                </div>
              </div>
              {linkedOrcamento.vidros && linkedOrcamento.vidros.length > 0 && (
                <div className="mt-2 border-t border-white/5 pt-3">
                  <p className="mb-2 text-[10px] uppercase tracking-wider text-white/40">Vidros:</p>
                  <div className="flex flex-wrap gap-1">
                    {linkedOrcamento.vidros.map((vidro, index) => (
                      <span key={index} className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/70">
                        {vidro.h}x{vidro.w} {vidro.label && `(${vidro.label})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button type="button" onClick={onOpenHistory} className="mt-2 w-full text-xs font-semibold text-[#c9a227] hover:underline">
                Ver todos os orçamentos no Histórico →
              </button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Telefone/WhatsApp</label>
              <input
                type="text"
                placeholder="(21) XXXXX-XXXX"
                value={leadForm.phone}
                onChange={(event) => setLeadForm({ ...leadForm, phone: event.target.value })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">E-mail (Opcional)</label>
              <input
                type="email"
                placeholder="email@cliente.com"
                value={leadForm.email}
                onChange={(event) => setLeadForm({ ...leadForm, email: event.target.value })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Endereço Completo</label>
            <input
              type="text"
              placeholder="Av, Rua, Número, Bloco..."
              value={leadForm.address}
              onChange={(event) => setLeadForm({ ...leadForm, address: event.target.value })}
              className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Bairro do RJ</label>
              <select
                value={leadForm.neighborhood}
                onChange={(event) => setLeadForm({ ...leadForm, neighborhood: event.target.value })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none"
              >
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Película Desejada</label>
              <select
                value={leadForm.filmType}
                onChange={(event) => setLeadForm({ ...leadForm, filmType: event.target.value })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none"
              >
                {activeFilmOptions.map((film) => (
                  <option key={film} value={film}>{film}</option>
                ))}
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Área (m²)</label>
              <input
                type="number"
                step="0.01"
                value={leadForm.sqm || ''}
                onChange={(event) => setLeadForm({ ...leadForm, sqm: parseFloat(event.target.value) || 0 })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Valor Fechado (R$)</label>
              <input
                type="number"
                step="0.01"
                value={leadForm.value || ''}
                onChange={(event) => setLeadForm({ ...leadForm, value: parseFloat(event.target.value) || 0 })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Status Inicial</label>
              <select
                value={leadForm.status}
                onChange={(event) => setLeadForm({ ...leadForm, status: event.target.value as Lead['status'] })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none"
              >
                <option value="Novo">Novo</option>
                <option value="Em Contato">Em Contato</option>
                <option value="Agendado">Agendado</option>
                <option value="Fechado">Fechado</option>
                <option value="Perdido">Perdido</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Data do Serviço</label>
              <DateFieldWithPicker
                ariaLabel="Abrir calendário para data do serviço"
                value={formatDateInputValue(leadForm.dataServico)}
                onChange={(value) => setLeadForm({ ...leadForm, dataServico: value || null })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Próximo Contato</label>
              <DateFieldWithPicker
                ariaLabel="Abrir calendário para próximo contato"
                value={formatDateInputValue(leadForm.proximoContato)}
                onChange={(value) => setLeadForm({ ...leadForm, proximoContato: value || null })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Observações Comerciais</label>
            <textarea
              rows={3}
              placeholder="Instruções de instalação, preferências, horários..."
              value={leadForm.notes}
              onChange={(event) => setLeadForm({ ...leadForm, notes: event.target.value })}
              className="w-full resize-none rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 border-t border-white/5 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-white/5 bg-white/[0.01] py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5">
              Cancelar
            </button>
            <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-3 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition hover:brightness-110">
              {selectedLead ? 'Salvar Alterações' : 'Criar Novo Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface LeadDetailModalProps {
  leadDetail: Lead | null;
  leadStatusHistory: LeadStatusHistoryEntry[];
  loadingLeadStatusHistory: boolean;
  getLeadPhoneHref: (phone?: string | null) => string;
  getLeadStatusClasses: (status: Lead['status']) => string;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadFollowUpDate: (lead: Lead) => Date | null;
  getWhatsAppHref: (lead: Lead, template?: 'generic' | 'retorno' | 'servico') => string;
  formatCurrency: (value: number) => string;
  onClose: () => void;
  onOpenEdit: (lead: Lead) => void;
  onOpenCommercialAction: (lead: Lead, action: CommercialActionDraft['action']) => void;
}

export function LeadDetailModal({
  leadDetail,
  leadStatusHistory,
  loadingLeadStatusHistory,
  getLeadPhoneHref,
  getLeadStatusClasses,
  getLeadServiceDate,
  getLeadFollowUpDate,
  getWhatsAppHref,
  formatCurrency,
  onClose,
  onOpenEdit,
  onOpenCommercialAction,
}: LeadDetailModalProps) {
  if (!leadDetail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-black tracking-tight text-white">{leadDetail.name}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Telefone</span>
            {getLeadPhoneHref(leadDetail.phone) ? (
              <a href={getLeadPhoneHref(leadDetail.phone)} className="text-sm font-bold text-white transition hover:text-[#f5d77a]">
                {leadDetail.phone}
              </a>
            ) : (
              <span className="text-sm font-bold text-white">—</span>
            )}
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Status</span>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLeadStatusClasses(leadDetail.status)}`}>{leadDetail.status}</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Serviço</span>
            <span className="text-sm font-bold text-sky-300">
              {getLeadServiceDate(leadDetail) ? format(getLeadServiceDate(leadDetail)!, 'dd/MM/yyyy') : 'Sem data'}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Película</span>
            <span className="text-sm font-bold text-white">{leadDetail.filmType}</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Próxima Ação</span>
            <span className="text-sm font-bold text-[#f5d77a]">
              {getLeadFollowUpDate(leadDetail) ? format(getLeadFollowUpDate(leadDetail)!, 'dd/MM/yyyy') : 'Sem retorno'}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Valor</span>
            <span className="text-lg font-black text-[#c9a227]">R$ {formatCurrency(leadDetail.value)}</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Bairro</span>
            <span className="text-sm font-bold text-white">{leadDetail.neighborhood || '—'}</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Área</span>
            <span className="text-sm font-bold text-white">{leadDetail.sqm.toFixed(2)}m²</span>
          </div>
        </div>

        {leadDetail.email && (
          <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Email</span>
            <span className="text-sm font-bold text-white">{leadDetail.email}</span>
          </div>
        )}
        {leadDetail.notes && (
          <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Observações</span>
            <span className="whitespace-pre-wrap text-sm text-white/80">{leadDetail.notes}</span>
          </div>
        )}

        <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Histórico de status</span>
          {loadingLeadStatusHistory ? (
            <p className="text-sm text-white/45">Carregando histórico...</p>
          ) : leadStatusHistory.length === 0 ? (
            <p className="text-sm text-white/45">Nenhuma transição registrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {leadStatusHistory.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-white/5 bg-[#04080f]/70 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-white">
                      {entry.from_status ? `${entry.from_status} -> ${entry.to_status}` : `Entrada em ${entry.to_status}`}
                    </span>
                    <span className="text-[11px] text-white/40">{format(new Date(entry.changed_at), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                  {entry.changed_by && <p className="mt-1 text-[11px] text-white/35">por {entry.changed_by}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-2">
          {getLeadPhoneHref(leadDetail.phone) && (
            <a href={getLeadPhoneHref(leadDetail.phone)} className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2.5 text-center text-xs font-bold text-sky-300 transition hover:bg-sky-500/15">
              Ligar
            </a>
          )}
          {getWhatsAppHref(leadDetail) && (
            <a href={getWhatsAppHref(leadDetail)} target="_blank" rel="noreferrer" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-center text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/15">
              WhatsApp
            </a>
          )}
          <WhatsAppTemplateMenu className="col-span-2 sm:col-span-1" getHref={(template) => getWhatsAppHref(leadDetail, template)} />
          <button type="button" onClick={() => onOpenCommercialAction(leadDetail, 'retorno')} className="rounded-xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-2.5 text-xs font-bold text-[#f5d77a] transition hover:bg-[#c9a227]/15">
            Agendar Retorno
          </button>
          <button type="button" onClick={() => onOpenCommercialAction(leadDetail, 'servico')} className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2.5 text-xs font-bold text-sky-300 transition hover:bg-sky-500/15">
            Agendar Serviço
          </button>
          <button type="button" onClick={() => onOpenCommercialAction(leadDetail, 'fechado')} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/15">
            Fechar Venda
          </button>
          <button type="button" onClick={() => onOpenCommercialAction(leadDetail, 'perdido')} className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/15">
            Marcar Perdido
          </button>
        </div>

        <div className="mt-4 flex gap-3 border-t border-white/5 pt-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5">
            Fechar
          </button>
          <button onClick={() => onOpenEdit(leadDetail)} className="flex-1 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-2.5 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition hover:brightness-110">
            Editar Lead
          </button>
        </div>
      </div>
    </div>
  );
}

interface CommercialActionModalProps {
  commercialAction: CommercialActionDraft | null;
  title: string;
  label: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
  setCommercialAction: (action: CommercialActionDraft) => void;
}

export function CommercialActionModal({
  commercialAction,
  title,
  label,
  onClose,
  onSubmit,
  setCommercialAction,
}: CommercialActionModalProps) {
  if (!commercialAction) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={(event) => void onSubmit(event)} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]">Ação Comercial</p>
            <h3 className="mt-1 font-display text-lg font-black tracking-tight text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/50">{commercialAction.lead.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/5 p-2 text-white/40 transition hover:text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {commercialAction.action === 'retorno' && (
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Próximo contato</label>
              <DateFieldWithPicker
                ariaLabel="Abrir calendário para próximo contato"
                required
                value={commercialAction.followUpDate}
                onChange={(value) => setCommercialAction({ ...commercialAction, followUpDate: value })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
              />
            </div>
          )}

          {commercialAction.action === 'servico' && (
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Data do serviço</label>
              <DateFieldWithPicker
                ariaLabel="Abrir calendário para data do serviço"
                required
                value={commercialAction.serviceDate}
                onChange={(value) => setCommercialAction({ ...commercialAction, serviceDate: value })}
                className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-sky-400/40 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">
              {commercialAction.action === 'perdido' ? 'Motivo / observação' : 'Observação comercial'}
            </label>
            <textarea
              rows={4}
              value={commercialAction.note}
              onChange={(event) => setCommercialAction({ ...commercialAction, note: event.target.value })}
              placeholder={
                commercialAction.action === 'fechado'
                  ? 'Ex.: cliente confirmou pagamento, instalar pela manhã...'
                  : commercialAction.action === 'perdido'
                    ? 'Ex.: preço, prazo, concorrente, sem resposta...'
                    : 'Ex.: combinado, dúvida, pendência ou próximo passo...'
              }
              className="w-full resize-none rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3 border-t border-white/5 pt-4">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-white/5 bg-white/[0.01] py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5">
            Cancelar
          </button>
          <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-3 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition hover:brightness-110">
            {label}
          </button>
        </div>
      </form>
    </div>
  );
}
