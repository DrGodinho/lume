'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { CalculatorHistoryRow, Lead } from '../types';

export interface UseLeadOrcamentoReturn {
  linkCalculatorHistoryToLead: (calculatorHistoryId: string, leadId: string) => Promise<boolean>;
  fetchLinkedOrcamento: (lead: Lead) => Promise<CalculatorHistoryRow | null>;
}

export const useLeadOrcamento = (): UseLeadOrcamentoReturn => {
  const linkCalculatorHistoryToLead = useCallback(async (calculatorHistoryId: string, leadId: string) => {
    if (!supabase) return false;

    const { error } = await supabase
      .from('calculator_history')
      .update({ lead_id: leadId })
      .eq('id', calculatorHistoryId);

    return !error;
  }, []);

  const fetchLinkedOrcamento = useCallback(async (lead: Lead): Promise<CalculatorHistoryRow | null> => {
    if (!supabase) return null;

    const { data: linkedByLeadId } = await supabase
      .from('calculator_history')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (linkedByLeadId) {
      return linkedByLeadId as CalculatorHistoryRow;
    }

    if (!lead.name) {
      return null;
    }

    const { data: linkedByName } = await supabase
      .from('calculator_history')
      .select('*')
      .is('lead_id', null)
      .ilike('cliente', `%${lead.name}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return (linkedByName as CalculatorHistoryRow | null) || null;
  }, []);

  return { linkCalculatorHistoryToLead, fetchLinkedOrcamento };
};
