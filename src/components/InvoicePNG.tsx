import React, { forwardRef } from 'react';

interface InvoicePNGProps {
    cliente: string;
    userName: string;
    vidrosCount: number;
    groupedResumo: Record<string, { h: number, w: number, q: number, label: string }[]>;
    totalAreaM2: number;
    finalPrice: number;
    subtotalBruto: number;
    desconto: number;
    formatBRL: (v: number) => string;
}

export const InvoicePNG = forwardRef<HTMLDivElement, InvoicePNGProps>(({
    cliente,
    userName,
    vidrosCount,
    groupedResumo,
    totalAreaM2,
    finalPrice,
    subtotalBruto,
    desconto,
    formatBRL
}, ref) => {
    return (
        <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '400px' }}>
            <div
                ref={ref}
                style={{
                    width: '390px',
                    boxSizing: 'border-box',
                    background: '#0a0f1e',
                    padding: '28px 24px 24px',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    color: '#ffffff',
                    position: 'relative',
                }}
            >
                {/* Branding e Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', width: '100%' }}>
                    <div style={{ flexShrink: 0 }}>
                        <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1, display: 'flex' }}>
                            <span style={{ color: '#ffffff' }}>LU</span>
                            <span style={{ color: '#c9a227' }}>ME</span>
                        </div>
                        <div style={{ fontSize: '7.5px', fontWeight: '800', letterSpacing: '4px', color: '#c9a227', marginTop: '3px', textTransform: 'uppercase' }}>Películas Premium</div>
                    </div>
                    <div style={{ textAlign: 'right', paddingTop: '4px', flexShrink: 0 }}>
                        <div style={{ fontSize: '7.5px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '2px' }}>Orçamento</div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#d1d5db', marginTop: '3px' }}>{new Date().toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>

                <div style={{ height: '2px', background: 'linear-gradient(90deg, #c9a227 0%, rgba(201,162,39,0.2) 60%, transparent 100%)', marginBottom: '18px', borderRadius: '2px' }} />

                <div style={{ marginBottom: '16px', width: '100%' }}>
                    <div style={{ fontSize: '7.5px', fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '4px' }}>Para</div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
                        {cliente || 'Consumidor Final'}
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: '600', color: '#9ca3af', marginTop: '2px' }}>
                        Responsável: {userName}
                    </div>
                </div>

                <div style={{ marginBottom: '18px', width: '100%' }}>
                    {Object.entries(groupedResumo).map(([groupName, items], gIdx) => (
                        <div key={gIdx} style={{ marginBottom: '12px' }}>
                            {groupName !== 'Sem Ambiente' && (
                                <div style={{ fontSize: '8px', fontWeight: '800', color: '#c9a227', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', borderLeft: '2px solid #c9a227', paddingLeft: '6px' }}>
                                    {groupName}
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '100%' }}>
                                {items.map((r, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.035)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        borderRadius: '10px',
                                        padding: '9px 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        overflow: 'hidden',
                                        minWidth: 0,
                                    }}>
                                        <div style={{
                                            background: '#c9a227',
                                            color: '#000000',
                                            fontWeight: '900',
                                            fontSize: '11px',
                                            borderRadius: '6px',
                                            padding: '3px 7px',
                                            minWidth: '26px',
                                            textAlign: 'center',
                                            flexShrink: 0,
                                        }}>{r.q}x</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1, overflow: 'hidden' }}>
                                                {Math.round(r.h)}<span style={{ color: '#9ca3af', fontSize: '11px', margin: '0 1px' }}>×</span>{Math.round(r.w)}
                                                <span style={{ display: 'inline-block', fontSize: '8px', color: '#9ca3af', fontWeight: '600', marginLeft: '2px' }}>cm</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '18px' }} />

                <div style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.10) 0%, rgba(16,185,129,0.06) 100%)',
                    border: '1px solid rgba(201,162,39,0.22)',
                    borderRadius: '16px',
                    padding: '18px 20px 16px',
                    marginBottom: '16px',
                    position: 'relative',
                    width: '100%',
                    boxSizing: 'border-box',
                }}>
                    {desconto > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#e5e7eb' }}>Subtotal</span>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#e5e7eb' }}>{formatBRL(subtotalBruto)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#f87171' }}>Desconto</span>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#f87171' }}>– {formatBRL(desconto)}</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '10px 0 0' }} />
                        </div>
                    )}

                    <div style={{ fontSize: '8px', fontWeight: '800', color: '#c9a227', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '5px', marginTop: desconto > 0 ? '8px' : '0' }}>
                        Total à Vista
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexShrink: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '30px', fontWeight: '900', color: '#ffffff', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                                {formatBRL(finalPrice)}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '800', color: '#d1d5db', paddingBottom: '2px', whiteSpace: 'nowrap' }}>
                                ({totalAreaM2.toFixed(2)} m²)
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '7.5px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        lumecontrolesolar.com.br
                    </span>
                    <span style={{ fontSize: '7.5px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        (21) 96514-0612
                    </span>
                </div>
            </div>
        </div>
    );
});

InvoicePNG.displayName = 'InvoicePNG';
