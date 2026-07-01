'use client';

import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';
import { DEFAULT_CRM_FILM_OPTIONS } from '../constants';
import { formatDateInputValue } from './useAgenda';
import type { CalculatorHistoryRow, CreateLeadModalOptions, Lead, LeadFormValues } from '../types';

export interface UseLeadModalReturn {
  isModalOpen: boolean;
  selectedLead: Lead | null;
  leadDetail: Lead | null;
  setLeadDetail: (lead: Lead | null) => void;
  linkedOrcamento: CalculatorHistoryRow | null;
  linkedDetailOrcamento: CalculatorHistoryRow | null;
  pendingCalculatorHistoryId: string | null;
  leadForm: LeadFormValues;
  setLeadForm: Dispatch<SetStateAction<LeadFormValues>>;
  initialLeadForm: LeadFormValues;
  setInitialLeadForm: Dispatch<SetStateAction<LeadFormValues>>;
  isLeadFormDirty: boolean;
  availableFilmTypeOptions: string[];
  openCreateModal: (options?: CreateLeadModalOptions) => void;
  openEditModal: (lead: Lead) => Promise<void>;
  closeLeadModal: () => void;
  closeLeadDetailModal: () => void;
}

const buildEmptyLeadForm = (filmType: string): LeadFormValues => ({
  name: '',
  phone: '',
  email: '',
  address: '',
  neighborhood: 'Barra da Tijuca',
  filmType,
  sqm: 0,
  value: 0,
  status: 'Novo',
  statusChangedAt: new Date().toISOString().split('T')[0],
  dataServico: null,
  serviceStatus: null,
  proximoContato: null,
  dormant: false,
  pinned: false,
  notes: '',
});

export const useLeadModal = (
  defaultLeadFilmType: string,
  filmTypeOptions: string[],
  fetchLinkedOrcamento: (lead: Lead) => Promise<CalculatorHistoryRow | null>,
): UseLeadModalReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetail, setLeadDetail] = useState<Lead | null>(null);
  const [linkedOrcamento, setLinkedOrcamento] = useState<CalculatorHistoryRow | null>(null);
  const [linkedDetailOrcamento, setLinkedDetailOrcamento] = useState<CalculatorHistoryRow | null>(null);
  const [pendingCalculatorHistoryId, setPendingCalculatorHistoryId] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState<LeadFormValues>(() => buildEmptyLeadForm(DEFAULT_CRM_FILM_OPTIONS[0] || 'Outro'));
  const [initialLeadForm, setInitialLeadForm] = useState<LeadFormValues>(() => buildEmptyLeadForm(DEFAULT_CRM_FILM_OPTIONS[0] || 'Outro'));

  const availableFilmTypeOptions = useMemo(() => {
    if (!leadForm.filmType) return filmTypeOptions;
    return filmTypeOptions.includes(leadForm.filmType)
      ? filmTypeOptions
      : [leadForm.filmType, ...filmTypeOptions];
  }, [filmTypeOptions, leadForm.filmType]);

  const isLeadFormDirty = useMemo(() => {
    if (!isModalOpen) return false;
    return JSON.stringify(leadForm) !== JSON.stringify(initialLeadForm);
  }, [initialLeadForm, isModalOpen, leadForm]);

  useEffect(() => {
    if (!leadDetail) {
      const clearHandle = window.setTimeout(() => setLinkedDetailOrcamento(null), 0);
      return () => window.clearTimeout(clearHandle);
    }

    let cancelled = false;

    const loadLinkedOrcamento = async () => {
      const orcamento = await fetchLinkedOrcamento(leadDetail);
      if (!cancelled) {
        setLinkedDetailOrcamento(orcamento);
      }
    };

    void loadLinkedOrcamento();
    return () => {
      cancelled = true;
    };
  }, [leadDetail, fetchLinkedOrcamento]);

  const closeLeadModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLead(null);
    setLinkedOrcamento(null);
    setPendingCalculatorHistoryId(null);
    const emptyForm = buildEmptyLeadForm(defaultLeadFilmType);
    setInitialLeadForm(emptyForm);
    setLeadForm(emptyForm);
  }, [defaultLeadFilmType]);

  const closeLeadDetailModal = useCallback(() => {
    setLeadDetail(null);
  }, []);

  const openCreateModal = useCallback((options?: CreateLeadModalOptions) => {
    const initial = options?.prefill || buildEmptyLeadForm(defaultLeadFilmType);
    setSelectedLead(null);
    setLinkedOrcamento(null);
    setPendingCalculatorHistoryId(options?.sourceCalculatorHistoryId || null);
    setLeadForm(initial);
    setInitialLeadForm(initial);
    setIsModalOpen(true);
  }, [defaultLeadFilmType]);

  const openEditModal = useCallback(async (lead: Lead) => {
    const initial: LeadFormValues = {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      neighborhood: lead.neighborhood,
      filmType: lead.filmType,
      sqm: roundMeasure(lead.sqm),
      value: roundCurrency(lead.value),
      status: lead.status,
      statusChangedAt: lead.statusChangedAt,
      dataServico: formatDateInputValue(lead.dataServico),
      serviceStatus: lead.serviceStatus || null,
      proximoContato: formatDateInputValue(lead.proximoContato),
      dormant: lead.dormant,
      pinned: Boolean(lead.pinned),
      notes: lead.notes,
    };
    setSelectedLead(lead);
    setPendingCalculatorHistoryId(null);
    setLeadForm(initial);
    setInitialLeadForm(initial);
    setIsModalOpen(true);
    setLinkedOrcamento(await fetchLinkedOrcamento(lead));
  }, [fetchLinkedOrcamento]);

  return {
    isModalOpen,
    selectedLead,
    leadDetail,
    setLeadDetail,
    linkedOrcamento,
    linkedDetailOrcamento,
    pendingCalculatorHistoryId,
    leadForm,
    setLeadForm,
    initialLeadForm,
    setInitialLeadForm,
    isLeadFormDirty,
    availableFilmTypeOptions,
    openCreateModal,
    openEditModal,
    closeLeadModal,
    closeLeadDetailModal,
  };
};
