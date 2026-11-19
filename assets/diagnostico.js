/* Diagnóstico de RevOps: 10 perguntas, 5 dimensões, tudo no navegador */
(() => {
const el = document.getElementById('dg'); if (!el) return;
const ic = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
const DIMS = {
  dados: 'Dados e CRM', funil: 'Funil e SLA', forecast: 'Forecast', atrib: 'Atribuição', auto: 'Automação e rotina'
};
const Q = [
  ['dados', 'Marketing, Vendas e CS usam a mesma definição de MQL, SQL e oportunidade?', ['Não, cada área tem a sua', 'Existe, mas ninguém segue à risca', 'Sim, escrita e combinada', 'Sim, escrita e travada no CRM com regras de etapa']],
  ['dados', 'Quanto você confia nos números que saem do CRM?', ['Pouco, sempre tem que conferir na mão', 'Mais ou menos, depende do relatório', 'Confio na maior parte', 'Confio: tem validação e uma fonte oficial']],
  ['funil', 'Existe SLA entre Marketing e Vendas (tempo de contato, critério de aceite e devolução)?', ['Não existe', 'Combinado de boca', 'Escrito, mas sem acompanhamento', 'Escrito e medido toda semana']],
  ['funil', 'Você sabe a taxa de conversão de cada etapa do funil, por canal?', ['Não', 'Só a conversão geral', 'Por etapa, mas não por canal', 'Por etapa e por canal, comparada com a meta']],
  ['forecast', 'Como sai o forecast do mês?', ['Do feeling de cada vendedor', 'De uma planilha montada na mão', 'Do funil: entradas, conversões e ticket', 'Do funil, contra Budget e Commit, revisado toda semana']],
  ['forecast', 'Quando você descobre que o mês não vai bater a meta?', ['No último dia', 'Na última semana', 'Lá pelo meio do mês', 'Nas primeiras semanas, com alerta']],
  ['atrib', 'Existe uma regra escrita de quem gerou a receita (Marketing ou Vendas)?', ['Não, vira discussão', 'Cada área conta do seu jeito', 'Existe, mas não está no CRM', 'Existe, aprovada e aplicada no CRM']],
  ['atrib', 'O investimento em mídia é avaliado por quê?', ['Cliques e alcance', 'Volume de leads', 'MQL e oportunidades', 'Receita e CAC por canal, com conversões offline']],
  ['auto', 'Quanto das tarefas repetitivas da operação já está automatizado?', ['Quase nada', 'Algumas coisas soltas', 'Boa parte dos fluxos principais', 'Fluxos e integrações monitorados, com IA onde faz sentido']],
  ['auto', 'Existe um ritual em que a liderança olha o mesmo painel e decide?', ['Não, cada um olha o seu', 'Às vezes, quando dá problema', 'Sim, mensal', 'Sim, semanal, com o mesmo painel pra todo mundo']]
];
const LEVELS = [
  [0, 'Nível 1 · Reativo', 'A receita acontece, mas ninguém consegue explicar direito como.', 'Hoje a operação depende de pessoas e de esforço no fim do mês. O primeiro ganho vem de combinar as definições e fazer o dado nascer certo.'],
  [11, 'Nível 2 · Organizado', 'Já existe processo. Falta ele virar régua.', 'As peças estão aí, mas cada área ainda lê o resultado do seu jeito. O próximo salto é escrever as regras e medir o funil de ponta a ponta.'],
  [19, 'Nível 3 · Gerenciado', 'Você mede bem. Agora é prever.', 'Funil e dados já ajudam a decidir. O ganho agora está em antecipar: forecast saindo do funil, atribuição fechada e rituais com o mesmo número.'],
  [26, 'Nível 4 · Previsível', 'Receita previsível é sistema. Você tem um.', 'A operação já trabalha com uma régua só e enxerga o problema antes. O próximo passo é ganhar velocidade com automação e IA, sem perder governança.']
];
const NEXT = {
  dados: ['Escreva a definição de cada etapa (MQL, SQL, oportunidade, ganho e perda) e combine com as três áreas.', 'Trave essas regras no CRM com propriedades obrigatórias e regras de avanço de etapa.', 'Escolha uma fonte oficial pros números e crie uma tela de validação do que entra e do que fica de fora.'],
  funil: ['Defina um SLA simples: em quanto tempo o lead é contatado, o que Vendas aceita e o que devolve.', 'Meça a conversão de cada etapa por canal e compare com a meta toda semana.', 'Olhe primeiro a etapa com maior queda: é lá que está o dinheiro parado.'],
  forecast: ['Monte o forecast a partir do funil: entradas, taxas de conversão e ticket.', 'Coloque três linhas lado a lado: o que aconteceu, o que foi prometido (Budget) e o que vai acontecer no ritmo atual.', 'Use o feeling do vendedor como ajuste do número, não como base.'],
  atrib: ['Escreva uma regra de atribuição com janela ancorada no ciclo médio de vendas.', 'Aprove a regra com a liderança antes de olhar o resultado, e aplique no CRM.', 'Mande as conversões offline (oportunidade e venda) de volta pra mídia, pra otimizar por receita e não por clique.'],
  auto: ['Liste as tarefas repetitivas da semana e automatize as três que mais tomam tempo.', 'Crie um ritual semanal com um painel único pra liderança decidir em cima do mesmo número.', 'Use IA onde o gargalo é construir: painéis, integrações e leitura de dados, com regra e validação humanas.']
};
let i = 0; const ans = Array(Q.length).fill(null);
const draw = () => {
  const [d, q, opts] = Q[i];
  el.innerHTML = `<div class="dg-prog"><span>${String(i + 1).padStart(2, '0')} / ${Q.length}</span><div class="dg-bar"><i style="width:${(i / Q.length) * 100}%"></i></div><span>${DIMS[d]}</span></div>
  <div class="dg-q"><div class="dim">Pergunta ${i + 1} · ${DIMS[d]}</div><h2>${q}</h2>
  <div class="dg-opts">${opts.map((o, k) => `<button class="${ans[i] === k ? 'pick' : ''}" data-k="${k}"><i>${'ABCD'[k]}</i>${o}</button>`).join('')}</div></div>
  <div class="dg-nav"><button class="btn btn-ghost" ${i === 0 ? 'disabled style="visibility:hidden"' : ''} data-back>${'←'} Voltar</button><span style="font-size:13px;color:var(--muted);align-self:center">Escolha uma opção (ou use as teclas 1 a 4)</span></div>`;
  el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => pick(+b.dataset.k));
  const bk = el.querySelector('[data-back]'); if (bk) bk.onclick = () => { i = Math.max(0, i - 1); draw(); };
};
const pick = k => { ans[i] = k; el.querySelectorAll('[data-k]').forEach(b => b.classList.toggle('pick', +b.dataset.k === k)); setTimeout(() => { if (i < Q.length - 1) { i++; draw(); } else result(); }, 220); };
document.addEventListener('keydown', e => { if (!el.querySelector('.dg-q')) return; const n = +e.key; if (n >= 1 && n <= 4 && !/input|textarea/i.test(document.activeElement.tagName)) pick(n - 1); });
const result = () => {
  const total = ans.reduce((a, b) => a + b, 0); const max = Q.length * 3;
  const lv = [...LEVELS].reverse().find(l => total >= l[0]);
  const per = {}; Object.keys(DIMS).forEach(k => per[k] = { s: 0, m: 0 }); Q.forEach(([d], k) => { per[d].s += ans[k]; per[d].m += 3; });
  const low = Object.keys(per).sort((a, b) => per[a].s / per[a].m - per[b].s / per[b].m)[0];
  const pct = Math.round(total / max * 100); const C = 2 * Math.PI * 64;
  const txt = `Fiz o Diagnóstico de RevOps do Leandro Santana: ${pct}/100, ${lv[1]}. Ponto mais fraco: ${DIMS[low]}.`;
  el.innerHTML = `<div class="dg-res">
  <div class="dg-score"><div class="dg-ring"><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="64" fill="none" stroke="#262624" stroke-width="12"/><circle cx="75" cy="75" r="64" fill="none" stroke="#FF6A00" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" id="dgArc"/></svg><b>${pct}<small>de 100</small></b></div>
  <div><div class="lv">${lv[1]}</div><h2>${lv[2]}</h2><p>${lv[3]}</p></div></div>
  <div class="dg-dims">${Object.keys(DIMS).map(k => { const p = Math.round(per[k].s / per[k].m * 100); return `<div class="dg-dim${k === low ? ' low' : ''}"><small>${DIMS[k]}</small><div class="bar"><i style="width:${p}%"></i></div><b>${p}%</b>${k === low ? ' <span style="font-size:11px;color:var(--or-text);font-weight:800">· começar aqui</span>' : ''}</div>`; }).join('')}</div>
  <div class="dg-next"><div class="eyebrow"><b>Próximo passo</b></div><h3>Comece por ${DIMS[low]}.</h3><ol>${NEXT[low].map(t => `<li>${t}</li>`).join('')}</ol>
  <div class="btns" style="margin-top:22px"><a class="btn btn-ink" target="_blank" rel="noopener" href="https://wa.me/5511934751215?text=${encodeURIComponent(txt + ' Queria conversar sobre o resultado.')}">Conversar sobre o resultado ${ic('arrow')}</a><button class="btn btn-line" data-copy>${ic('copy')}Copiar resultado</button><button class="btn btn-ghost" data-redo>Refazer</button></div></div>
  </div>`;
  requestAnimationFrame(() => setTimeout(() => { const a = document.getElementById('dgArc'); if (a) { a.style.transition = 'stroke-dashoffset 1.1s ease'; a.style.strokeDashoffset = C * (1 - total / max); } }, 60));
  el.querySelector('[data-redo]').onclick = () => { i = 0; ans.fill(null); draw(); };
  el.querySelector('[data-copy]').onclick = async () => { try { await navigator.clipboard.writeText(txt + ' ' + location.href); } catch (e) {} el.querySelector('[data-copy]').innerHTML = ic('check') + 'Copiado'; };
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
draw();
})();
