/* Leandro Santana · comportamento comum do site */
(() => {
const B = document.body, R = B.dataset.root || './';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ic = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
const store = { get(k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set(k, v) { try { localStorage.setItem(k, v) } catch (e) {} } };

/* Endereço do assistente com IA (Cloudflare Worker). Vazio = respostas prontas. */
const ASK_URL = '';
const WA = '5511934751215';
const LINKEDIN = 'https://www.linkedin.com/in/leandrosantanamkt/';
const MAIL = 'leandrosantana.mkt@gmail.com';

/* ---------- toast ---------- */
const toastEl = document.createElement('div'); toastEl.className = 'toast'; B.appendChild(toastEl);
const toast = t => { toastEl.innerHTML = ic('check') + t; toastEl.classList.add('show'); clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 2400); };

/* ---------- tema ---------- */
const setTheme = t => { document.documentElement.dataset.theme = t; store.set('theme', t); const m = $('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#0C0C0B' : '#F6F5F2'; };
const toggleTheme = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
$$('[data-theme-toggle]').forEach(b => b.onclick = toggleTheme);

/* ---------- menu mobile ---------- */
const nav = $('.nav'); const burger = $('.burger');
if (burger) burger.onclick = () => nav.classList.toggle('open');
$$('.links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

/* ---------- resumo do perfil ---------- */
const RESUMO = `Leandro Santana · Revenue Operations e BizOps · São Paulo

Desde 2020 em operações comerciais B2B. Hoje em Revenue Operations na Octadesk (LWSA), com SMB e Enterprise: forecast, business plan, atribuição de receita, governança de CRM e dados, e ferramentas de receita construídas com IA.

Antes: Analista de Inteligência de Mercado Sr. na Prestex (lead scoring Fit x Potencial, curva ABC, régua de relacionamento e HubSpot, ações que ajudaram a receita a crescer 36%). No Grupo Ideal Trends, de Analista de CRM a Gerente de Inteligência Comercial, liderando 14 pessoas e 3 squads (CRM, Growth e SalesOps).

Ferramentas: HubSpot, BigQuery, SQL, Apps Script, n8n, Claude e MCP.

Portfólio: https://osantleandro.github.io
LinkedIn: linkedin.com/in/leandrosantanamkt
E-mail: ${MAIL}`;
const copy = async (txt, msg) => { try { await navigator.clipboard.writeText(txt); toast(msg) } catch (e) { const t = document.createElement('textarea'); t.value = txt; B.appendChild(t); t.select(); try { document.execCommand('copy'); toast(msg) } catch (_) {} t.remove(); } };
$$('[data-copy-resumo]').forEach(b => b.onclick = e => { e.preventDefault(); copy(RESUMO, 'Resumo copiado'); });

/* ---------- relógio de São Paulo ---------- */
const clk = $('[data-clock]');
if (clk) { const tick = () => clk.textContent = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }); tick(); setInterval(tick, 20000); }

/* ---------- entrada suave ---------- */
if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .1 }); $$('.rv').forEach(el => io.observe(el)); } else $$('.rv').forEach(el => el.classList.add('in'));

/* ---------- busca (Ctrl+K) ---------- */
const P = [
  ['Páginas', 'Início', '', 'home'], ['Páginas', 'Sobre', 'sobre/', 'user'], ['Páginas', 'Cases', 'cases/', 'board'],
  ['Páginas', 'Projetos com IA', 'projetos/', 'spark'], ['Páginas', 'Notas', 'notas/', 'pencil'], ['Páginas', 'Now: o que estou fazendo agora', 'now/', 'pulse'],
  ['Páginas', 'Diagnóstico de RevOps', 'diagnostico/', 'chart'],
  ['Cases', 'Octadesk · Revenue Operations', 'cases/octadesk/', 'board'], ['Cases', 'Prestex · Inteligência de Mercado', 'cases/prestex/', 'board'], ['Cases', 'Grupo Ideal Trends · Inteligência Comercial', 'cases/ideal-trends/', 'board'],
  ['Projetos', 'Norn · painel de RevOps (demo)', 'projetos/norn/', 'tv'], ['Projetos', 'Ygg Hub · operação de conteúdo com agentes (demo)', 'projetos/ygg-hub/', 'bot'],
  ['Projetos', 'Sistemas: BP, atribuição, BigQuery, automações', 'projetos/#sistemas', 'chart'],
  ['Notas', 'Forecast não é pesquisa de opinião', 'notas/forecast/', 'pencil'], ['Notas', 'Quem trouxe essa receita? (atribuição)', 'notas/atribuicao/', 'pencil'], ['Notas', 'Construí um painel de receita com IA', 'notas/painel-com-ia/', 'pencil'],
  ['Sobre', 'Trajetória', 'sobre/#trajetoria', 'cal'], ['Sobre', 'Competências', 'sobre/#competencias', 'check'], ['Sobre', 'Além do trabalho', 'sobre/#vida', 'user'],
  ['Ações', 'Perguntar ao assistente', '#ask', 'msg'], ['Ações', 'Copiar resumo do perfil', '#copy', 'download'], ['Ações', 'Alternar tema claro/escuro', '#theme', 'spark'],
  ['Contato', 'WhatsApp', '#wa', 'msg'], ['Contato', 'LinkedIn', '#in', 'arrow'], ['Contato', 'E-mail', '#mail', 'send']
];
const pal = document.createElement('div'); pal.className = 'pal'; pal.innerHTML = `<div class="pal-box" role="dialog" aria-label="Buscar no site"><label class="pal-in">${ic('search')}<input placeholder="Buscar páginas, cases, notas ou ações" aria-label="Buscar"><kbd>Esc</kbd></label><div class="pal-list"></div></div>`; B.appendChild(pal);
const pin = $('input', pal), plist = $('.pal-list', pal); let sel = 0, cur = [];
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const renderPal = () => { const q = norm(pin.value.trim()); cur = P.filter(p => !q || norm(p[0] + ' ' + p[1]).includes(q)); sel = Math.min(sel, Math.max(cur.length - 1, 0)); let g = '', h = ''; cur.forEach((p, i) => { if (p[0] !== g) { g = p[0]; h += `<div class="pal-g">${g}</div>`; } h += `<div class="pal-it${i === sel ? ' on' : ''}" data-i="${i}">${ic(p[3])}${p[1]}<small>${p[2].startsWith('#') ? 'ação' : '↵'}</small></div>`; }); plist.innerHTML = h || '<div class="pal-empty">Nada encontrado. Tenta perguntar ao assistente.</div>'; $$('.pal-it', plist).forEach(el => { el.onclick = () => runPal(cur[+el.dataset.i]); el.onmousemove = () => { sel = +el.dataset.i; $$('.pal-it', plist).forEach(x => x.classList.toggle('on', x === el)); }; }); };
const openPal = () => { pal.classList.add('open'); pin.value = ''; sel = 0; renderPal(); setTimeout(() => pin.focus(), 20); };
const closePal = () => pal.classList.remove('open');
const runPal = p => { if (!p) return; closePal(); const a = p[2];
  if (a === '#ask') return openAsk(); if (a === '#copy') return copy(RESUMO, 'Resumo copiado'); if (a === '#theme') return toggleTheme();
  if (a === '#wa') return window.open(`https://wa.me/${WA}`, '_blank'); if (a === '#in') return window.open(LINKEDIN, '_blank'); if (a === '#mail') return location.href = 'mailto:' + MAIL;
  location.href = R + a; };
pin.oninput = () => { sel = 0; renderPal(); };
pin.onkeydown = e => { if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, cur.length - 1); renderPal(); e.preventDefault(); } else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); renderPal(); e.preventDefault(); } else if (e.key === 'Enter') runPal(cur[sel]); };
pal.onclick = e => { if (e.target === pal) closePal(); };
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.classList.contains('open') ? closePal() : openPal(); } else if (e.key === 'Escape') { closePal(); closeAsk(); } });
$$('[data-pal]').forEach(b => b.onclick = openPal);

/* ---------- assistente ---------- */
const AV = R + 'img/avatar.jpg';
const link = (t, h) => `<a href="${h.startsWith('http') || h.startsWith('mailto') ? h : R + h}"${h.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
const LOCAL = [
  [/(vc|voce|tu) acha|faz (mais )?sentido|devo |deveria|recomenda|minha empresa|tenho uma empresa|meu time|minha operacao|como eu |o que eu faco|qual (e o )?melhor/, () => `Boa pergunta, e a resposta depende do contexto da sua operação: ticket, ciclo de venda, tamanho da base e do time. É o tipo de conversa que o Leandro prefere ter direto. Fala com ele no ${link('WhatsApp', 'https://wa.me/' + WA)}. Se quiser um ponto de partida, o ${link('diagnóstico de RevOps', 'diagnostico/')} mostra onde a operação está mais fraca.`],
  [/\bcases?\b|empresas (que|onde)|onde (ele )?trabalh|experiencia|onde (ele|voce|vc)/, () => `O Leandro passou por três operações B2B:\n• Octadesk (LWSA), hoje, em Revenue Operations\n• Prestex, em Inteligência de Mercado\n• Grupo Ideal Trends, de analista de CRM a gerente de Inteligência Comercial\n\nCada uma tem uma página: ${link('ver cases', 'cases/')}.`],
  [/\bia\b|inteligencia artificial|claude|agente|norn|ygg|painel|mcp|constru/, () => `Ele construiu dois produtos com IA:\n• Norn, painel de RevOps usado pela liderança, com 40+ telas\n• Ygg Hub, operação de conteúdo tocada por agentes\n\nAs duas demos funcionam de verdade: ${link('projetos com IA', 'projetos/')}.`],
  [/forecast|previs|pipeline|meta|budget|commit/, () => `Pro Leandro, forecast sai do funil, não do feeling do vendedor: entradas, taxas de conversão e ticket, comparados com o budget. Assim o problema aparece semanas antes. Ele escreveu sobre isso: ${link('Forecast não é pesquisa de opinião', 'notas/forecast/')}.`],
  [/atribu|sourced|origem|cac/, () => `Ele desenhou uma política de atribuição de 90 dias que separa Marketing Sourced de Sales Sourced, aprovada e em vigor no HubSpot. Detalhes: ${link('a nota sobre atribuição', 'notas/atribuicao/')}.`],
  [/hubspot|n8n|integra|automa|zapier|make|webhook|api|bigquery|sql/, () => `Alguns exemplos:\n• conversões offline do HubSpot pro Google Ads via webhook e n8n\n• chatbot da Octadesk integrado ao HubSpot nos dois sentidos (SLA e comunicação com o lead)\n• API do HubSpot pro BigQuery por Apps Script\n• workflows, lead score e régua de relacionamento no HubSpot\n\nTem mais em ${link('sistemas', 'projetos/#sistemas')}.`],
  [/lider|gest|time|equipe|squad|coorden|gerente|trajet|carreira/, () => `Ele foi coordenador de 14 pessoas e depois gerente de Inteligência Comercial com 3 squads (CRM, Growth Hacking e SalesOps), respondendo a CEO e sócios. Tá na ${link('trajetória', 'sobre/#trajetoria')}.`],
  [/36|prestex|lead scor|curva|abc|regua|régua/, () => `Na Prestex ele montou o lead scoring Fit x Potencial, a curva ABC da carteira e a régua de relacionamento por perfil, e implementou o HubSpot. Foram ações do time que ajudaram a receita a crescer 36%. ${link('Ver o case', 'cases/prestex/')}.`],
  [/diagn|maturidade|teste|avali/, () => `Tem um diagnóstico de RevOps com 10 perguntas rápidas. Ele devolve o nível de maturidade da operação e o próximo passo: ${link('fazer o diagnóstico', 'diagnostico/')}.`],
  [/flamengo|futebol|hobb|pessoal|gosta|fora do trabalho|musica|música|serie|série|corr/, () => `Fora do trabalho: Flamengo, NBA (Denver), rock, reggae e trap, Game of Thrones, The Last of Us, corrida e mitologia nórdica, que deu nome ao Ygg. ${link('Mais sobre ele', 'sobre/#vida')}.`],
  [/contat|whats|email|e-mail|falar|conversar|vaga|entrevista|linkedin|telefone/, () => `O jeito mais rápido de falar com ele é o ${link('WhatsApp', 'https://wa.me/' + WA)}. Também tem o ${link('LinkedIn', LINKEDIN)} e o e-mail ${link(MAIL, 'mailto:' + MAIL)}.`],
  [/quem|sobre|resum|apresent|faz o que|o que (ele|voce|vc) faz/, () => `O Leandro é de Revenue Operations, em São Paulo. Ele trabalha onde a estratégia comercial vira operação: forecast, business plan, atribuição, governança de CRM e as ferramentas que a liderança usa pra decidir, muitas construídas com IA. ${link('Sobre', 'sobre/')}.`]
];
const localAnswer = q => { const n = norm(q); for (const [re, f] of LOCAL) if (re.test(n)) return f(); return `Essa eu não sei responder por aqui. Dá uma olhada em ${link('cases', 'cases/')} e ${link('projetos', 'projetos/')}, ou fala direto com ele no ${link('WhatsApp', 'https://wa.me/' + WA)}.`; };
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const fmtAI = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, h) => link(t, h.replace(/^https:\/\/osantleandro\.github\.io\/?/, '').replace(/^\//, ''))).replace(/(^|\n)[-*] /g, '$1• ');
const history = [];
const askHTML = (inline) => `<div class="ask-top"><img src="${AV}" alt=""><div><b>Pergunte ao Leandro</b><small>Assistente com IA</small></div>${inline ? '' : `<button class="icon-btn x" aria-label="Fechar">${ic('x')}</button>`}</div>
<div class="ask-log" aria-live="polite"><div class="msg bot">Oi! Sou o assistente do Leandro. Posso falar dos cases, dos projetos com IA, da trajetória ou de como falar com ele. O que você quer saber?</div></div>
<div class="ask-chips"><button>Cases</button><button>Projetos com IA</button><button>Integrações e automações</button><button>Como falar com ele</button></div>
<form class="ask-form"><input placeholder="Pergunte algo..." aria-label="Sua pergunta" maxlength="400"><button aria-label="Enviar">${ic('send')}</button></form>
<div class="ask-note">Respostas geradas por IA a partir do conteúdo do site. Podem conter erros.</div>`;
const boxes = [];
let busy = false, autoOpened = false;
const addAll = (cls, html) => boxes.map(bx => { const log = $('.ask-log', bx); const d = document.createElement('div'); d.className = 'msg ' + cls; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; });
const setBusy = v => { busy = v; boxes.forEach(bx => $('.ask-form button', bx).disabled = v); };
const send = async q => { q = (q || '').trim(); if (!q || busy) return; addAll('me', esc(q)); boxes.forEach(bx => $('.ask-form input', bx).value = ''); setBusy(true); const ty = addAll('bot typing', '<i></i><i></i><i></i>');
  let out = null;
  if (ASK_URL) { try { const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 20000);
    const r = await fetch(ASK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ q, history: history.slice(-6) }), signal: ctl.signal }); clearTimeout(tm);
    if (r.ok) { const j = await r.json(); if (j && j.answer) out = fmtAI(j.answer); } } catch (e) {} }
  if (!out) { await new Promise(r => setTimeout(r, 450)); out = localAnswer(q); }
  history.push({ role: 'user', content: q }, { role: 'assistant', content: out.replace(/<[^>]+>/g, '') });
  ty.forEach(t => t.remove()); addAll('bot', out); setBusy(false); };
const wire = box => {
  boxes.push(box);
  const form = $('.ask-form', box), inp = $('input', form);
  form.onsubmit = e => { e.preventDefault(); send(inp.value); };
  $$('.ask-chips button', box).forEach(b => b.onclick = () => send(b.textContent));
  const x = $('.x', box); if (x) x.onclick = () => { autoOpened = false; closeAsk(); };
};
const inline = $('[data-ask-inline]');
if (inline) { inline.classList.add('ask-card'); inline.innerHTML = askHTML(true); wire(inline); }

const fab = document.createElement('div'); fab.className = 'fab';
fab.innerHTML = `<a class="fab-wa" href="https://wa.me/${WA}?text=${encodeURIComponent('Oi Leandro! Vi seu portfólio e queria conversar.')}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2zm0 1.8a8 8 0 1 1-4.1 14.9l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4zm-3.3 3.9c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 2.1.8 2.6.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4l-.7-1.8c-.2-.5-.4-.4-.6-.4h-.4z"/></svg></a>
<button class="fab-btn" aria-label="Abrir assistente"><img src="${AV}" alt=""><span>Pergunte ao Leandro</span></button>`;
B.appendChild(fab);
const pop = document.createElement('div'); pop.className = 'ask-card ask-pop'; pop.innerHTML = askHTML(false); B.appendChild(pop); wire(pop);
function openAsk() { pop.classList.add('open'); const l = $('.ask-log', pop); l.scrollTop = l.scrollHeight; setTimeout(() => $('input', pop).focus({ preventScroll: true }), 60); }
function closeAsk() { pop.classList.remove('open'); }
$('.fab-btn', fab).onclick = () => { autoOpened = false; pop.classList.contains('open') ? closeAsk() : openAsk(); };
$$('[data-ask]').forEach(b => b.onclick = e => { e.preventDefault(); openAsk(); });
/* Na home o assistente da entrada acompanha a página: quando ele sai da tela,
   aparece o botão flutuante e, se já tem conversa, ela continua na janela flutuante. */
if (inline && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => {
    const vis = e.isIntersecting;
    B.classList.toggle('scrolled', !vis);
    if (!vis && history.length && !pop.classList.contains('open')) { autoOpened = true; openAsk(); }
    if (vis && autoOpened) { autoOpened = false; closeAsk(); }
  }, { threshold: 0.25 }).observe(inline);
} else B.classList.add('scrolled');
})();
