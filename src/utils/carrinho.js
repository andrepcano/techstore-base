// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function calcularTotal(carrinho = []) {
  return carrinho.reduce((total, produto) => {
    const valor = Number(produto?.price)
    return Number.isFinite(valor) ? total + valor : total
  }, 0)
}

export function calcularValorParaFreteGratis(valorTotal = 0) {
  const total = Number(valorTotal)
  if (!Number.isFinite(total)) return 0
  return Math.max(0, 200 - total)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
