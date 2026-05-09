import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0a0f1e',
    color: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 10,
    color: '#c9a227',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  rightHeader: {
    textAlign: 'right',
  },
  dateLabel: {
    fontSize: 8,
    color: '#888888',
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: 12,
    color: '#aaaaaa',
    marginTop: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#c9a227',
    marginBottom: 20,
    opacity: 0.5,
  },
  clientSection: {
    marginBottom: 25,
  },
  clientLabel: {
    fontSize: 8,
    color: '#888888',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clientResponsavel: {
    fontSize: 12,
    color: '#aaaaaa',
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  groupHeader: {
    backgroundColor: '#1f2937',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 4,
  },
  groupHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#c9a227',
    textTransform: 'uppercase',
  },
  itemLabel: {
    fontSize: 11,
    color: '#cccccc',
    flex: 2,
  },
  itemDims: {
    fontSize: 16,
    color: '#888888',
    flex: 1,
  },
  itemQty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'right',
  },
  summarySection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
  },
  summaryBoxLast: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 4,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#888888',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c9a227',
    padding: 15,
    borderRadius: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 22,
    color: '#000000',
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 9,
    color: '#888888',
  },
});

interface InvoicePDFProps {
    cliente: string;
    userName: string;
    resumo: { label: string; h: number; w: number; q: number }[];
    totalAreaM2: number;
    areaV: number;
    eficiencia: number;
    finalPrice: number;
    descontoInput: string;
}

export const InvoicePDF = ({ cliente, userName, resumo, totalAreaM2, areaV, eficiencia, finalPrice, descontoInput }: InvoicePDFProps) => {
  
  // Group items by label
  const groupedResumo = resumo.reduce((acc, item) => {
    const groupName = item.label || 'Sem Ambiente';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {} as Record<string, typeof resumo>);

  return (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.title, { color: '#ffffff' }]}>LU</Text>
            <Text style={[styles.title, { color: '#c9a227' }]}>ME</Text>
          </View>
          <Text style={styles.subtitle}>Películas Premium</Text>
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.dateLabel}>Orçamento</Text>
          <Text style={styles.dateValue}>{new Date().toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.clientSection}>
        <Text style={styles.clientLabel}>Para</Text>
        <Text style={styles.clientName}>{cliente || 'Consumidor Final'}</Text>
        <Text style={styles.clientResponsavel}>Responsável: {userName}</Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        {Object.entries(groupedResumo).map(([groupName, items], gIdx) => (
          <View key={gIdx} style={{ marginBottom: 8 }}>
            {groupName !== 'Sem Ambiente' && (
                <View style={styles.groupHeader}>
                    <Text style={styles.groupHeaderText}>{groupName}</Text>
                </View>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 4 }}>
              {items.map((item, idx) => (
                <View key={idx} style={[styles.itemRow, { width: '47%' }]}>
                  <Text style={styles.itemDims}>{item.h} x {item.w} cm</Text>
                  <Text style={styles.itemQty}>{item.q} un</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total de Peças</Text>
          <Text style={styles.summaryValue}>{resumo.reduce((acc, item) => acc + item.q, 0)} un</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Área Líquida</Text>
          <Text style={styles.summaryValue}>{totalAreaM2.toFixed(2)} m²</Text>
        </View>
        <View style={styles.summaryBoxLast}>
          <Text style={styles.summaryLabel}>Área de Rolo (Total)</Text>
          <Text style={styles.summaryValue}>{(areaV / 10000).toFixed(2)}m²</Text>
        </View>
      </View>

      <View style={styles.totalSection}>
        <View>
            <Text style={styles.totalLabel}>Total Final</Text>
            {parseFloat(descontoInput) > 0 && (
                <View style={{backgroundColor: '#000000', padding: '3 8', borderRadius: 4, marginTop: 6}}>
                    <Text style={{fontSize: 10, color: '#ef4444', fontWeight: 'bold'}}>
                        DESCONTO: - R$ {parseFloat(descontoInput).toFixed(2)}
                    </Text>
                </View>
            )}
        </View>
        <View style={{textAlign: 'right'}}>
            <Text style={styles.totalValue}>
                {finalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Text>
            <View style={{marginTop: 6}}>
                <Text style={{fontSize: 10, color: '#000000', fontWeight: 'bold'}}>lumecontrolesolar.com.br</Text>
                <Text style={{fontSize: 10, color: '#000000', fontWeight: 'bold', marginTop: 1}}>(21) 96514-0612</Text>
            </View>
        </View>
      </View>
    </Page>
  </Document>
)};
