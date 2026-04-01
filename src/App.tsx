/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wallet, Lightbulb, Trash2, PlusCircle, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Transaction {
  id: string;
  desc: string;
  valor: number;
  tipo: 'receita' | 'essencial' | 'superfluo';
  data: string;
}

export default function App() {
  const [transacoes, setTransacoes] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transacoes');
    return saved ? JSON.parse(saved) : [];
  });

  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'essencial' | 'superfluo'>('receita');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  const rendaTotal = transacoes
    .filter((t) => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);
  
  const gastosEssenciais = transacoes
    .filter((t) => t.tipo === 'essencial')
    .reduce((acc, t) => acc + t.valor, 0);
  
  const gastosSuperfluos = transacoes
    .filter((t) => t.tipo === 'superfluo')
    .reduce((acc, t) => acc + t.valor, 0);

  const gastosTotais = gastosEssenciais + gastosSuperfluos;
  const saldo = rendaTotal - gastosTotais;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !valor) return;

    const novaTransacao: Transaction = {
      id: crypto.randomUUID(),
      desc,
      valor: parseFloat(valor),
      tipo,
      data: new Date().toISOString(),
    };

    setTransacoes([novaTransacao, ...transacoes]);
    setDesc('');
    setValor('');
    setTipo('receita');
  };

  const remover = (id: string) => {
    setTransacoes(transacoes.filter((t) => t.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <nav className="bg-emerald-600 p-4 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">Ecolyncis</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8 max-w-6xl">
        {/* Catchy Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-10 shadow-2xl shadow-emerald-200/50 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-600/40 z-10" />
          <img 
            src="https://picsum.photos/seed/finance/1200/400?blur=2" 
            alt="Vida Financeira" 
            className="w-full h-48 md:h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-12">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight"
            >
              Domine seu Dinheiro, <br />
              <span className="text-emerald-300">Conquiste sua Liberdade.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm md:text-base max-w-md font-medium"
            >
              A Ecolyncis ajuda você a enxergar além dos números. Organize seus gastos e comece a construir o patrimônio que você merece.
            </motion.p>
          </div>
          <div className="absolute bottom-4 right-8 z-20 hidden md:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-white text-xs font-bold">
                Sua jornada para o <br /> sucesso começa aqui.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Renda Total</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(rendaTotal)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-200 self-end" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-rose-500 flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Gastos Totais</p>
              <p className="text-2xl font-bold text-rose-600">{formatCurrency(gastosTotais)}</p>
            </div>
            <TrendingDown className="w-6 h-6 text-rose-200 self-end" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-1">Saldo Disponível</p>
              <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(saldo)}
              </p>
            </div>
            <Wallet className="w-6 h-6 text-emerald-200 self-end" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold">Novo Lançamento</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descrição</label>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Ex: Aluguel, Netflix, Salário"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      placeholder="0,00"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as any)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none appearance-none"
                    >
                      <option value="receita">Receita (Ganho)</option>
                      <option value="essencial">Gasto Essencial</option>
                      <option value="superfluo">Gasto Supérfluo</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-100"
                >
                  Adicionar Lançamento
                </button>
              </form>
            </div>

            {/* Insights Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-800">Insights</h2>
                </div>
                <button 
                  onClick={() => setShowGuide(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
                >
                  Guia de Redução
                </button>
              </div>
              <div className="space-y-4">
                {rendaTotal === 0 ? (
                  <p className="text-gray-500 italic text-sm text-center py-4">
                    Adicione sua renda mensal para receber sugestões de economia personalizadas.
                  </p>
                ) : (
                  <>
                    {gastosSuperfluos > rendaTotal * 0.3 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-rose-50 p-4 rounded-xl border-l-4 border-rose-500 flex gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <p className="text-rose-700 font-bold text-sm">Alerta de Gastos!</p>
                          <p className="text-xs text-rose-600 mt-1">
                            Seus gastos supérfluos ({formatCurrency(gastosSuperfluos)}) estão acima de 30% da sua renda. 
                            Considere reduzir delivery ou assinaturas pouco utilizadas.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {gastosSuperfluos <= rendaTotal * 0.3 && gastosSuperfluos > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-emerald-50 p-4 rounded-xl border-l-4 border-emerald-500 flex gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-emerald-700 font-bold text-sm">Bom trabalho!</p>
                          <p className="text-xs text-emerald-600 mt-1">
                            Seus gastos supérfluos estão sob controle e dentro da margem recomendada.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {gastosTotais > rendaTotal && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-500 flex gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                        <div>
                          <p className="text-orange-700 font-bold text-sm">Atenção Crítica!</p>
                          <p className="text-xs text-orange-600 mt-1">
                            Você está gastando mais do que ganha. Revise seus gastos essenciais e elimine o que for possível.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {saldo > 0 && (
                      <p className="text-xs text-gray-500 text-center">
                        Você tem {formatCurrency(saldo)} sobrando. Que tal investir uma parte?
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold">Extrato Recente</h2>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                  {transacoes.length} Lançamentos
                </span>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Valor</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <AnimatePresence mode="popLayout">
                      {transacoes.length === 0 ? (
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center"
                        >
                          <td colSpan={4} className="p-12 text-gray-400 italic text-sm">
                            Nenhuma transação registrada ainda.
                          </td>
                        </motion.tr>
                      ) : (
                        transacoes.map((t) => (
                          <motion.tr
                            key={t.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, x: -20 }}
                            className="hover:bg-gray-50/50 transition-colors group"
                          >
                            <td className="p-4">
                              <div className="font-medium text-gray-800">{t.desc}</div>
                            </td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                                t.tipo === 'receita' ? 'bg-blue-50 text-blue-600' :
                                t.tipo === 'essencial' ? 'bg-gray-100 text-gray-600' :
                                'bg-orange-50 text-orange-600'
                              }`}>
                                {t.tipo === 'receita' ? 'Receita' : t.tipo === 'essencial' ? 'Essencial' : 'Supérfluo'}
                              </span>
                            </td>
                            <td className={`p-4 font-bold text-right ${
                              t.tipo === 'receita' ? 'text-blue-600' : 'text-rose-600'
                            }`}>
                              {t.tipo === 'receita' ? '+' : '-'} {formatCurrency(t.valor)}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => remover(t.id)}
                                className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {transacoes.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 italic text-sm">
                      Nenhuma transação registrada ainda.
                    </div>
                  ) : (
                    transacoes.map((t) => (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              t.tipo === 'receita' ? 'bg-blue-500' :
                              t.tipo === 'essencial' ? 'bg-gray-400' :
                              'bg-orange-500'
                            }`} />
                            <h3 className="font-bold text-gray-800 truncate">{t.desc}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            <span>{t.tipo}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`font-bold ${
                            t.tipo === 'receita' ? 'text-blue-600' : 'text-rose-600'
                          }`}>
                            {t.tipo === 'receita' ? '+' : '-'} {formatCurrency(t.valor)}
                          </div>
                          <button
                            onClick={() => remover(t.id)}
                            className="mt-1 text-rose-400 p-1 active:scale-90 transition-transform"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Economy Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuide(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Guia de Redução de Gastos</h2>
                </div>
                <button 
                  onClick={() => setShowGuide(false)}
                  className="p-2 hover:bg-emerald-500 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    A Regra 50/30/20
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Divida sua renda líquida em três partes: 
                    <strong className="text-gray-800"> 50% para necessidades básicas </strong> (aluguel, comida), 
                    <strong className="text-gray-800"> 30% para desejos pessoais </strong> (lazer, supérfluos) e 
                    <strong className="text-gray-800"> 20% para poupança ou dívidas</strong>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Corte de Assinaturas "Vampiras"
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Revise seu extrato bancário. Muitas vezes pagamos por streamings, aplicativos ou clubes de assinatura que não usamos mais. 
                    Cancele o que não é essencial hoje.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                    Planejamento de Refeições
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    O delivery é o maior vilão do orçamento. Planeje suas refeições da semana, faça uma lista de compras e cozinhe em casa. 
                    Isso pode reduzir seus gastos com alimentação em até 40%.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                    A Regra das 24 Horas
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Antes de fazer uma compra por impulso (especialmente online), espere 24 horas. 
                    Na maioria das vezes, o desejo passa e você percebe que não precisava do item.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                    Pague-se Primeiro
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Assim que receber seu salário, transfira o valor da poupança para outra conta. 
                    Não espere o final do mês para ver o que sobra, pois raramente sobra algo sem planejamento.
                  </p>
                </section>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowGuide(false)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  Entendido!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
