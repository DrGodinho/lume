import { isLeadStatus } from '../constants';
import type { FollowUpPlaybookRule, Lead, LeadStatus, SellerPlaybook } from '../types';

const DEFAULT_SELLER_ID = 'equipe-lume';
const MAX_OFFSET_DAYS = 60;

const defaultRuleMeta: Array<Pick<FollowUpPlaybookRule, 'id' | 'triggerStatus' | 'scheduleOffsetDays'>> = [
  { id: 'novo-d2', triggerStatus: 'Novo', scheduleOffsetDays: 2 },
  { id: 'em-contato-d7', triggerStatus: 'Em Contato', scheduleOffsetDays: 7 },
  { id: 'agendado-d15', triggerStatus: 'Agendado', scheduleOffsetDays: 15 },
];

const clampOffsetDays = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), MAX_OFFSET_DAYS);
};

export const normalizeSellerId = (value: string) => {
  const cleanValue = value.trim().toLowerCase().replace(/\s+/g, '-');
  return cleanValue || DEFAULT_SELLER_ID;
};

export const createDefaultPlaybookRules = (): FollowUpPlaybookRule[] =>
  defaultRuleMeta.map((rule) => ({
    ...rule,
    scheduleOffsetDays: clampOffsetDays(rule.scheduleOffsetDays),
    actionType: 'follow_up',
    enabled: true,
  }));

export const createDefaultSellerPlaybook = (sellerId = DEFAULT_SELLER_ID): SellerPlaybook => ({
  sellerId: normalizeSellerId(sellerId),
  rules: createDefaultPlaybookRules(),
});

export const sanitizePlaybookRules = (rules: FollowUpPlaybookRule[]) => {
  const byStatus = new Map<LeadStatus, FollowUpPlaybookRule>();

  for (const fallbackRule of createDefaultPlaybookRules()) {
    byStatus.set(fallbackRule.triggerStatus, fallbackRule);
  }

  for (const rule of rules) {
    if (!isLeadStatus(rule.triggerStatus) || rule.actionType !== 'follow_up') continue;
    byStatus.set(rule.triggerStatus, {
      id: rule.id || `${rule.triggerStatus}-follow-up`,
      triggerStatus: rule.triggerStatus,
      scheduleOffsetDays: clampOffsetDays(rule.scheduleOffsetDays),
      actionType: 'follow_up',
      enabled: rule.enabled !== false,
    });
  }

  return Array.from(byStatus.values());
};

export const buildFollowUpDateIso = (baseDate: Date, offsetDays: number) => {
  const date = Number.isNaN(baseDate.getTime()) ? new Date() : new Date(baseDate);
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + clampOffsetDays(offsetDays));
  return date.toISOString();
};

export const getPlaybookFollowUpDate = (
  status: LeadStatus,
  currentFollowUp: string | null | undefined,
  rules: FollowUpPlaybookRule[],
  options: { baseDate?: Date; overwriteExisting?: boolean } = {},
) => {
  if (!options.overwriteExisting && currentFollowUp) return currentFollowUp;
  if (status === 'Fechado' || status === 'Perdido') return currentFollowUp || null;

  const rule = sanitizePlaybookRules(rules).find((entry) => (
    entry.enabled
    && entry.actionType === 'follow_up'
    && entry.triggerStatus === status
  ));
  if (!rule) return currentFollowUp || null;

  return buildFollowUpDateIso(options.baseDate || new Date(), rule.scheduleOffsetDays);
};

export const applyFollowUpPlaybook = (
  lead: Lead,
  rules: FollowUpPlaybookRule[],
  options: { baseDate?: Date; overwriteExisting?: boolean } = {},
): Lead => {
  const nextFollowUp = getPlaybookFollowUpDate(lead.status, lead.proximoContato, rules, options);
  if (nextFollowUp === (lead.proximoContato || null)) return lead;

  return {
    ...lead,
    proximoContato: nextFollowUp,
  };
};
