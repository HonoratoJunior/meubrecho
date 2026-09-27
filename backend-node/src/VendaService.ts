export class VendaService {
  public static calcularComissao(precoTotal: number) {
    const TAXA_PLATAFORMA = 0.03; // Sua taxa de 3%
    
    const taxaPlataforma = Number((precoTotal * TAXA_PLATAFORMA).toFixed(2));
    const valorVendedor = Number((precoTotal - taxaPlataforma).toFixed(2));

    return {
      valorTotal: precoTotal,
      taxaPlataforma, // 3% pra você
      valorVendedor   // 97% pro lojista
    };
  }
}