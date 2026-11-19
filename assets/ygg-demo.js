

const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const icon=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
const toaster=el=>(t,s,ic='check')=>{el.innerHTML=icon(ic)+'<div>'+t+(s?`<small>${s}</small>`:'')+'</div>';el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2600)};

/* ===================== YGG HUB ===================== */
(() => {
const demo = $('#ygg'), page = $('#yPage'), tEl = $('#yToast');
const yt = (t, s, i = 'check') => { tEl.innerHTML = icon(i) + '<div>' + t + (s ? `<small>${s}</small>` : '') + '</div>'; tEl.classList.add('show'); clearTimeout(tEl._t); tEl._t = setTimeout(() => tEl.classList.remove('show'), 2800); };
const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
const PF = { EL: { n: 'Arquibancada', c: '#1E8E5A' }, RP: { n: 'Panorama', c: '#D23B2E' }, EN: { n: 'Faixa Bônus', c: '#E8730C' }, OI: { n: 'Contraponto', c: '#7C4DDB' }, LS: { n: 'Leandro Santana', c: '#3B5BDB' } };
const ST = [['ras', 'Rascunho', 'pencil'], ['rev', 'Em revisão', 'redo'], ['agu', 'Aguardando aprovação', 'thumb'], ['age', 'Agendado', 'cal'], ['pub', 'Publicado', 'check'], ['rep', 'Reprovado', 'x']];
const SC = { ras: '#8B8F98', rev: '#2F5BD6', agu: '#B8570F', age: '#7B5CF0', pub: '#1C7C54', rep: '#C62828' };
const av = (p, s = 26) => `<span class="y-av" style="background:${PF[p].c};width:${s}px;height:${s}px">${p}</span>`;
const th = (p) => `<span class="y-th" style="--c:${PF[p].c}"></span>`;
// contagens de base (o que não aparece como card na amostra) + amostra de cards
const BASE = { ras: 2, rev: 0, agu: 0, age: 86, pub: 25, rep: 20 };
let uid = 50, slot = 0, cur = 'inicio', sel = null, newN = 0, stab = 'fila', sfil = 'all', rtab = 'geral', atab = 'geral', pview = 'quadro', pperfil = 'all', open = { agu: 1, age: 1 };
const SLOTS = ['18 nov · 12:00', '18 nov · 18:30', '19 nov · 12:30', '19 nov · 19:00', '20 nov · 12:00'];
let posts = [
  { id: 1, p: 'LS', t: 'LinkedIn: como estamos no mês? (painel com IA)', f: 'Post', s: 'agu', d: '1 dez' },
  { id: 2, p: 'RP', t: 'Como um projeto vira lei: o caminho em 5 etapas', f: 'Vídeo', s: 'agu', d: '2 dez' },
  { id: 3, p: 'OI', t: 'A série que todo mundo largou merece outra chance', f: 'Vídeo narrado', s: 'ras', d: '—', work: 'Thor produzindo' },
  { id: 4, p: 'EN', t: 'Um disco, uma história: o lado B que virou hino', f: 'Carrossel', s: 'ras', d: '—' },
  { id: 5, p: 'EL', t: 'O que o convidado quis dizer com aquela resposta', f: 'Reels', s: 'rev', d: '—', work: 'Thor revisando' },
  { id: 6, p: 'EL', t: 'O narrador que não gritava gol', f: 'Reels', s: 'age', d: '17 nov · 12:30' },
  { id: 7, p: 'LS', t: 'Pipeline não é dinheiro', f: 'Carrossel', s: 'age', d: '17 nov · 18:00' },
  { id: 8, p: 'EN', t: 'O disco que ninguém ouviu inteiro', f: 'Reels', s: 'age', d: '17 nov · 20:00' },
  { id: 9, p: 'EL', t: 'O time que gastou pouco e chegou longe', f: 'Reels', s: 'pub', d: '15 nov', v: 1352 },
  { id: 10, p: 'RP', t: 'Três votos que mudaram uma eleição', f: 'Reels', s: 'pub', d: '14 nov', v: 412 },
  { id: 11, p: 'OI', t: 'O craque que a gente supervaloriza', f: 'Vídeo narrado', s: 'pub', d: '13 nov', v: 388 },
  { id: 12, p: 'LS', t: 'Forecast não é pesquisa de opinião', f: 'Post', s: 'pub', d: '12 nov', v: 296 },
];
const cnt = (s) => BASE[s] + posts.filter(x => x.s === s && (pperfil === 'all' || x.p === pperfil)).length * 1;
const total = () => ST.reduce((t, [k]) => t + cnt(k), 0);
let pedidos = [
  { p: 'EL', t: 'A homenagem que ninguém esperava no estádio', tp: 'Revisão', s: 'fila', em: '17 nov 13:11', n: 'Observação do Leandro aguardando o Thor.' },
  { p: 'RP', t: 'O que muda com a nova regra do orçamento', tp: 'Vídeo narrado', s: 'fila', em: '17 nov 13:10', n: 'Na fila da próxima rodada.' },
  { p: 'EL', t: '"A avaliação do meu trabalho não é só resultado"', tp: 'Corte', s: 'fila', em: '17 nov 13:10', n: 'Corte quente, passa na frente.' },
  { p: 'OI', t: 'A série que todo mundo largou', tp: 'Vídeo narrado', s: 'prod', em: '17 nov 12:58', n: 'Thor montando as cenas.' },
  { p: 'EN', t: 'Um disco, uma história', tp: 'Carrossel', s: 'fila', em: '17 nov 12:41', n: 'Na fila da próxima rodada.' },
  { p: 'RP', t: 'Três votos que mudaram uma eleição', tp: 'Corte', s: 'erro', em: '17 nov 01:12', n: 'Vídeo fora do ar no YouTube. Tentar outro link.' },
  { p: 'EL', t: 'O time que gastou pouco e chegou longe', tp: 'Corte', s: 'ok', em: '15 nov 00:41', n: 'Entregue pra aprovação.' },
  { p: 'LS', t: 'Pipeline não é dinheiro', tp: 'Carrossel', s: 'ok', em: '14 nov 16:20', n: 'Entregue pra aprovação.' },
];
const PED_BASE = { ok: 88 };
const AG = [
  { k: 'Thor', r: 'Produção do conteúdo', d: 'Você cria um post, manda um corte ou peça pra produção ou volta um post pra Rascunho.', q: 'De 4 em 4 h, 08:17 às 22:17', w: 'hub', m: 'Sonnet 5.5', teto: 3, g: 5.48, on: true },
  { k: 'Bragi', r: 'Pautas da semana', d: 'Semana seguinte, de segunda a domingo. Lê o Slack e as reuniões.', q: 'Sexta 17:47', w: 'claude', fix: 'claude', m: 'Plano do Claude', teto: null, g: null, on: true },
  { k: 'Sindri', r: 'Cortes da madrugada', d: 'Perfis de esporte e de política.', q: 'Todo dia 00:30', w: 'hub', m: 'Sonnet 5.5', teto: 3, g: 1.70, on: true },
  { k: 'Heimdall', r: 'Radar semanal', d: 'Agenda dos podcasts da semana.', q: 'Segunda 02:33', w: 'hub', m: 'Sonnet 5.5', teto: .8, g: .06, on: true },
  { k: 'Brokk', r: 'Montagem do Opiniões', d: 'Só pautas com todas as imagens na pasta.', q: 'Todo dia 07:23', w: 'hub', m: 'Sonnet 5.5', teto: 1, g: .09, on: true },
  { k: 'Hermod', r: 'Publicador · código', d: 'Agenda os aprovados e publica na hora marcada.', q: 'A cada minuto', w: 'hub', fix: 'hub', m: 'Sem IA', teto: null, g: 0, on: true },
  { k: 'Mímir', r: 'Métricas · código', d: 'Coleta as métricas e a foto das primeiras 24 h.', q: 'Todo dia 06:47', w: 'hub', fix: 'hub', m: 'Sem IA', teto: null, g: 0, on: true },
];
let execs = [{ ok: 1, a: 'Thor', h: '17 nov 08:18', d: 'Produziu 3 posts da fila e devolveu 1 revisão.', c: 1.78 }, { ok: 1, a: 'Brokk', h: '17 nov 07:23', d: 'Nenhuma pauta completa pra montar hoje.', c: .02 }, { ok: 1, a: 'Mímir', h: '17 nov 06:47', d: 'Coletou métricas de 29 posts publicados.', c: 0 }, { ok: 0, a: 'Sindri', h: '17 nov 01:12', d: '1 corte com erro: vídeo fora do ar.', c: .31 }, { ok: 1, a: 'Sindri', h: '17 nov 00:30', d: 'Entregou 6 cortes de 2 episódios.', c: 1.39 }];
let avisos = [{ h: '06:47', a: 'Mímir', t: 'Métricas de 29 posts coletadas. Melhor post: Arquibancada.' }, { h: '01:12', a: 'Sindri', t: '1 corte com erro: o vídeo saiu do ar. Pedido marcado pra revisão.' }, { h: '00:52', a: 'Sindri', t: 'Entregou 6 cortes de 2 episódios. 4 quentes, 2 atemporais.' }];
const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const aviso = (a, t) => { avisos.unshift({ h: now(), a, t, nw: 1 }); if (cur !== 'caixa') newN++; badges(); };
const badges = () => { const esp = cnt('agu') + cnt('rev') + cnt('ras'); $('#yHomeN').textContent = esp || ''; $('#yFila').textContent = pedidos.filter(x => x.s === 'fila' || x.s === 'prod').length || ''; $('#yNew').textContent = newN || ''; $('#yBellN').textContent = newN || ''; };

/* ---------- telas ---------- */
const head = (pre, t, p, r = '') => `<div class="y-h"><div>${pre ? `<small>${pre}</small>` : ''}<h4>${t}</h4>${p ? `<p>${p}</p>` : ''}</div>${r}</div>`;
const postCard = (x) => `<div class="y-post ${sel === x.id ? 'sel' : ''}" data-id="${x.id}"><div class="pf">${av(x.p, 18)}${PF[x.p].n}</div><div class="bd">${th(x.p)}<b>${x.t}</b></div><div class="ft">${icon('ig')}${x.f} · ${x.d}</div>${x.work ? `<div class="work"><span class="y-spin"></span>${x.work}</div>` : ''}${sel === x.id && x.s === 'agu' ? `<div class="y-acts"><button class="y-btn ok" data-act="ok">${icon('check')}Aprovar</button><button class="y-btn" data-act="rev">${icon('redo')}Revisar</button><button class="y-btn bad" data-act="no" aria-label="Reprovar">${icon('x')}</button></div>` : ''}</div>`;
const V = {
  inicio: () => {
    const esp = cnt('agu') + cnt('rev') + cnt('ras'), fila = pedidos.filter(x => x.s === 'fila' || x.s === 'prod').length, err = pedidos.filter(x => x.s === 'erro').length, top = posts.find(x => x.id === 9);
    const tot = total();
    const need = posts.filter(x => x.s === 'agu' || x.s === 'rev');
    return `${head('Terça, 17 de novembro', 'Bom dia, Leandro')}
    <div class="y-g y-g4">
      <button class="y-card y-k y-kb" data-go="pipeline"><div class="l">Esperando você</div><div class="v" style="color:var(--st-agu)">${esp}</div><div class="s">${cnt('agu')} pra aprovar · ${cnt('rev')} em revisão · ${cnt('ras')} rascunhos</div></button>
      <button class="y-card y-k y-kb" data-go="estudio"><div class="l">Na fila de produção</div><div class="v" style="color:var(--st-rev)">${fila}</div><div class="s">0 esperando material · ${err} com erro</div></button>
      <button class="y-card y-k y-kb" data-go="pipeline"><div class="l">Agendados</div><div class="v">${cnt('age')}</div><div class="s">${posts.filter(x => x.s === 'age' && x.d.startsWith('17')).length + 3} vão ao ar hoje</div></button>
      <button class="y-card y-k y-kb" data-go="relatorios"><div class="l">Publicados</div><div class="v" style="color:var(--st-pub)">${cnt('pub')}</div><div class="s">3.802 views somadas</div></button>
    </div>
    <div class="y-card" style="margin-top:10px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">${th('EL').replace('y-th', 'y-th" style="width:52px;height:66px;--c:#1E8E5A')}<div style="flex:1;min-width:200px"><div style="font-size:10px;font-weight:600;letter-spacing:.1em;color:var(--y-or-t)">POST DO PERÍODO</div><b style="font-size:14px;font-weight:600">${top.t}</b><div style="font-size:11px;color:var(--y-muted)">Arquibancada · Reels · publicado 15 nov</div></div><div style="text-align:right"><b style="font-size:20px;font-weight:600">${fmt(top.v)}</b> <span style="color:#1C7C54;font-size:18px;font-weight:600;margin-left:10px">35,6%</span><div style="font-size:10.5px;color:var(--y-muted)">views · das 3.802 views de 29 posts</div></div></div>
    <div class="y-card" style="margin-top:10px"><div style="display:flex;justify-content:space-between;font-size:12.5px"><b style="font-weight:600">Fluxo de conteúdo</b><span style="color:var(--y-muted);font-size:11px">do rascunho à publicação · clique numa etapa</span></div>
      <div class="y-flow">${ST.map(([k]) => `<i data-go="pipeline" data-open="${k}" style="flex:${Math.max(.6, cnt(k))};background:${SC[k]}" title="${k}"></i>`).join('')}</div>
      <div class="y-leg">${ST.map(([k, n]) => `<button data-go="pipeline" data-open="${k}"><span class="y-dot" style="background:${SC[k]}"></span>${n} <b>${cnt(k)}</b></button>`).join('')}</div></div>
    <div class="y-g y-g2" style="margin-top:10px"><div class="y-card"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><b style="font-size:12.5px;font-weight:600">Precisa de você <span style="color:var(--y-faint);font-weight:400">${need.length}</span></b><button class="y-btn ghost" data-go="pipeline" style="height:22px;color:var(--st-rev)">Abrir o pipeline</button></div>
      ${need.map(x => `<div class="y-row">${th(x.p)}<div class="t"><b>${x.t}</b><small>${PF[x.p].n} · ${x.f}</small></div>${x.s === 'agu' ? `<span class="y-pill" style="background:#FFF1E6;color:var(--st-agu)">Aguardando aprovação</span><button class="y-btn ok" data-ok="${x.id}">Aprovar</button>` : `<span class="y-pill" style="background:#EAF0FF;color:var(--st-rev)"><span class="y-spin"></span>Thor revisando</span>`}</div>`).join('') || '<div style="color:var(--y-muted);font-size:12px;padding:14px 0">Nada esperando você. Bom trabalho.</div>'}</div>
      <div class="y-card"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><b style="font-size:12.5px;font-weight:600">No ar hoje</b><button class="y-btn ghost" data-go="pipeline" data-view="cal" style="height:22px;color:var(--st-rev)">Calendário</button></div>
      ${[['12:00', 'RP', 'Como um projeto vira lei em Brasília'], ['12:30', 'EL', 'O narrador que não gritava gol'], ['18:00', 'LS', 'Pipeline não é dinheiro'], ['20:00', 'EN', 'O disco que ninguém ouviu inteiro']].map(([h, p, t]) => `<div class="y-row"><b style="font-size:11.5px;font-weight:600;width:38px">${h}</b>${th(p)}<div class="t"><b>${t}</b><small>${PF[p].n} · Reels</small></div></div>`).join('')}</div></div>`;
  },
  pipeline: () => {
    const vis = posts.filter(x => pperfil === 'all' || x.p === pperfil);
    const q = ($('#ySearch').value || '').toLowerCase().trim(); const vq = q ? vis.filter(x => x.t.toLowerCase().includes(q)) : vis;
    const filters = `<div class="y-card" style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:12px"><label style="font-size:10.5px;color:var(--y-muted)">Perfil<br><select class="y-sel" id="yPf"><option value="all">Todos</option>${Object.entries(PF).map(([k, v]) => `<option value="${k}" ${pperfil === k ? 'selected' : ''}>${v.n}</option>`).join('')}</select></label><label style="font-size:10.5px;color:var(--y-muted)">Rede<br><select class="y-sel"><option>Todas</option><option>Instagram</option><option>TikTok</option></select></label>${q ? `<span class="y-pill">Busca: “${esc(q)}” <button class="y-btn ghost" id="yClr" style="height:18px;padding:0 4px">×</button></span>` : ''}<span style="margin-left:auto;font-size:11px;color:var(--y-muted)">${total()} conteúdos</span></div>`;
    let body = '';
    if (pview === 'quadro') body = `<div class="y-board">${ST.map(([k, n, ico]) => { const l = vq.filter(x => x.s === k); return open[k] ? `<div class="y-col open" style="--c:${SC[k]}"><div class="hd" data-col="${k}"><span class="ci">${icon(ico)}</span><b>${n}</b><span class="n">${cnt(k)}</span>${icon('chev')}</div>${k === 'age' ? '<div class="sub">O Hermod publica sozinho</div>' : k === 'agu' ? '<div class="sub">A única etapa humana do fluxo</div>' : ''}${l.map(postCard).join('') || '<div class="sub" style="padding:8px 2px">Nada aqui</div>'}${cnt(k) > l.length ? `<div class="sub">+ ${cnt(k) - l.length} conteúdos</div>` : ''}</div>` : `<div class="y-col" data-col="${k}" style="--c:${SC[k]}" title="Abrir ${n}"><span class="ci">${icon(ico)}</span><span class="vt">${n}</span><span class="n">${cnt(k)}</span></div>`; }).join('')}</div>`;
    else if (pview === 'lista') body = `<div class="y-card" style="padding:0"><div class="y-tw"><table class="y-tbl"><thead><tr><th>Conteúdo</th><th>Etapa</th><th>Formato</th><th>Data</th></tr></thead><tbody>${vq.map(x => `<tr><td><div class="pd">${th(x.p)}<div><b>${x.t}</b><small>${PF[x.p].n}</small></div></div></td><td><span class="y-pill" style="background:${SC[x.s]}1A;color:${SC[x.s]}">${ST.find(s => s[0] === x.s)[1]}</span></td><td>${x.f}</td><td>${x.d}</td></tr>`).join('')}</tbody></table></div></div>`;
    else { const days = ['17 nov', '18 nov', '19 nov', '20 nov']; body = `<div class="y-g y-g4">${days.map(d => `<div class="y-card"><b style="font-size:12px;font-weight:600">${d}</b>${vq.filter(x => x.s === 'age' && x.d.startsWith(d)).map(x => `<div class="y-row">${av(x.p, 22)}<div class="t"><b>${x.t}</b><small>${x.d.split('· ')[1] || ''}</small></div></div>`).join('') || '<div style="font-size:11px;color:var(--y-muted);padding-top:8px">Vagas livres na cadência</div>'}</div>`).join('')}</div>`; }
    return head('', 'Pipeline', `${total()} conteúdos · clique numa etapa pra abrir · clique num card em Aguardando aprovação pra decidir`, `<div class="y-seg">${[['quadro', 'Quadro'], ['lista', 'Lista'], ['cal', 'Calendário']].map(([k, n]) => `<button data-pv="${k}" class="${pview === k ? 'on' : ''}">${n}</button>`).join('')}</div>`) + filters + body;
  },
  estudio: () => {
    const c = { all: pedidos.length + PED_BASE.ok, fila: pedidos.filter(x => x.s === 'fila' || x.s === 'prod').length, mat: 0, erro: pedidos.filter(x => x.s === 'erro').length, ok: pedidos.filter(x => x.s === 'ok').length + PED_BASE.ok };
    const tabs = `<div class="y-tabs">${[['fila', 'Fila de pedidos'], ['cortes', 'Cortes com IA'], ['narrado', 'Vídeo narrado'], ['musica', 'Música']].map(([k, n]) => `<button data-st="${k}" class="${stab === k ? 'on' : ''}">${n}</button>`).join('')}</div>`;
    const hd = head('', 'Estúdio', 'Os pedidos aos agentes e as ferramentas de produção num lugar só.', `<div style="display:flex;gap:8px"><button class="y-btn" data-st="cortes">Editar um vídeo</button><button class="y-btn dark" data-st="cortes">+ Pedir pra IA</button></div>`);
    if (stab === 'fila') {
      const lst = pedidos.filter(x => sfil === 'all' || (sfil === 'fila' ? (x.s === 'fila' || x.s === 'prod') : x.s === sfil));
      const SP = { fila: ['Na fila', '#EAF0FF', '#2F5BD6'], prod: ['Produzindo', '#F1ECFF', '#7B5CF0'], erro: ['Com erro', '#FDECEC', '#C62828'], ok: ['Pronto', '#E7F5EE', '#1C7C54'] };
      return hd + tabs + `<p style="font-size:11.5px;color:var(--y-muted);margin-bottom:10px">Cada pedido, quem faz e o que falta. Clique num número pra filtrar.</p><div class="y-g y-g5">${[['all', 'Todos', c.all, 'pedidos no total', ''], ['fila', 'Na fila', c.fila, 'próxima rodada do Thor 12:17', '#2F5BD6'], ['mat', 'Esperando material', c.mat, 'Huginn buscando de 2 em 2 h', '#B8570F'], ['erro', 'Com erro', c.erro, 'ver a nota do agente', '#C62828'], ['ok', 'Prontos', c.ok, 'entregues pra aprovação', '#1C7C54']].map(([k, l, v, s, col]) => `<button class="y-card y-k y-kb ${sfil === k ? 'sel' : ''}" data-sf="${k}"><div class="l">${l}</div><div class="v" ${col ? `style="color:${col}"` : ''}>${v}</div><div class="s">${s}</div></button>`).join('')}</div>
      <div class="y-card" style="padding:0;margin-top:10px"><div class="y-tw"><table class="y-tbl"><thead><tr><th>Pedido</th><th>Tipo</th><th>Situação</th><th>Pedido em</th><th>Nota do agente</th></tr></thead><tbody>${lst.map(x => `<tr><td><div class="pd">${th(x.p)}<div><b>${x.t}</b><small>${PF[x.p].n}</small></div></div></td><td>${x.tp}</td><td><span class="y-pill" style="background:${SP[x.s][1]};color:${SP[x.s][2]}">${x.s === 'prod' ? '<span class="y-spin"></span>' : ''}${SP[x.s][0]}</span></td><td style="white-space:nowrap">${x.em}</td><td style="color:var(--y-muted)">${x.n}</td></tr>`).join('') || '<tr><td colspan="5" style="color:var(--y-muted)">Nenhum pedido nessa situação.</td></tr>'}</tbody></table></div></div>`;
    }
    if (stab === 'cortes') return hd + tabs + `<div class="y-card"><b style="font-size:13px;font-weight:600">Novo corte</b><p style="font-size:11.5px;color:var(--y-muted);margin:2px 0 10px">Cole o link de um episódio. O Hub baixa, transcreve, acha os trechos com gancho e entrega os cortes em 9:16, todos com mais de 1 minuto.</p><div style="display:flex;gap:8px"><input class="y-input" id="yLink" value="https://youtube.com/watch?v=episodio-exemplo" aria-label="Link do vídeo"><select class="y-sel" id="yLp" style="height:36px">${['EL', 'RP'].map(k => `<option value="${k}">${PF[k].n}</option>`).join('')}</select><button class="y-btn dark" id="yGen" style="height:36px">${icon('scissors')}Gerar cortes</button></div><ul class="y-steps" id="ySteps"></ul><div id="yCuts"></div></div>`;
    const txt = stab === 'narrado' ? ['Vídeo narrado', 'A pauta vira roteiro, a voz sai do ElevenLabs, o worker busca imagens e clipes reais e o render roda no GitHub Actions. O post volta pra aprovação já montado.'] : ['Música', 'Cada post de música é um disco: capa, contracapa e a história contada em carrossel ou vídeo, com transições na batida da música.'];
    return hd + tabs + `<div class="y-card"><b style="font-size:14px;font-weight:600">${txt[0]}</b><p style="font-size:12.5px;color:var(--y-ink2);margin:6px 0 12px;max-width:62ch">${txt[1]}</p><button class="y-btn dark" data-st="fila">Ver os pedidos desse tipo na fila</button></div>`;
  },
  agentes: () => {
    const tabs = `<div class="y-tabs"><button data-at="geral" class="${atab === 'geral' ? 'on' : ''}">Visão geral</button><button data-at="conv" class="${atab === 'conv' ? 'on' : ''}">Editar e conversar</button></div>`;
    const hd = head('', 'Agentes', 'Quem trabalha sozinho, quando roda, onde roda e quanto gastou em novembro', `<div style="display:flex;gap:8px"><button class="y-btn" id="yAllC">Tudo pelo Claude</button><button class="y-btn or" data-at="conv">Novo agente</button></div>`);
    if (atab === 'conv') return hd + tabs + `<div class="y-card"><b style="font-size:13px;font-weight:600">Criar com IA</b><p style="font-size:11.5px;color:var(--y-muted);margin:2px 0 10px">Descreva o agente em uma frase. A IA desenha o fluxo: gatilho, passos e onde ele roda.</p><div class="y-chat" id="yChat"><div class="y-msg bot">O que esse agente precisa fazer?</div></div><form id="yChatF" style="display:flex;gap:8px"><input class="y-input" placeholder="Ex.: toda segunda, sugerir 3 pautas de NBA pro Opiniões" aria-label="Descrever o agente"><button class="y-btn dark" style="height:36px">${icon('send')}</button></form></div>`;
    const g = AG.reduce((t, a) => t + (a.on && a.g ? a.g : 0), 0);
    return hd + tabs + `<div class="y-card" style="padding:0"><div class="y-tw"><table class="y-tbl"><thead><tr><th>Agente</th><th>Quando roda</th><th>Onde roda</th><th>Modelo</th><th>Teto/rodada</th><th>Gasto no mês</th><th>Ligado</th></tr></thead><tbody>${AG.map((a, j) => `<tr style="${a.on ? '' : 'opacity:.5'}"><td style="min-width:230px"><b style="font-weight:600">${a.k} · ${a.r}</b><div style="font-size:10.5px;color:var(--y-muted)">${a.d}</div></td><td style="white-space:nowrap">${a.q}</td><td><div class="y-tog">${['hub', 'claude'].map(w => `<button data-w="${j}:${w}" class="${a.w === w ? 'on' : ''}" ${a.fix ? 'disabled' : ''}>${w === 'hub' ? 'Hub' : 'Claude'}</button>`).join('')}</div></td><td style="white-space:nowrap">${a.m}</td><td>${a.teto ? 'US$ ' + a.teto.toFixed(2).replace('.', ',') : '—'}</td><td><b style="font-weight:600">${a.g == null ? '—' : 'US$ ' + a.g.toFixed(2).replace('.', ',')}</b></td><td>${a.fix === 'claude' ? '<span class="y-pill" style="background:#F1ECFF;color:#7B5CF0">Pelo Claude</span>' : `<button class="y-sw ${a.on ? 'on' : ''}" data-sw="${j}" aria-label="Ligar ou desligar ${a.k}"></button>`}</td></tr>`).join('')}<tr><td colspan="5" style="text-align:right;color:var(--y-muted)">Total em novembro</td><td><b style="font-weight:600">US$ ${g.toFixed(2).replace('.', ',')}</b></td><td></td></tr></tbody></table></div></div>
    <div class="y-card" style="margin-top:10px"><b style="font-size:12.5px;font-weight:600">Últimas execuções</b>${execs.map(e => `<div class="y-row"><span class="y-pill" style="background:${e.ok ? '#E7F5EE' : '#FDECEC'};color:${e.ok ? '#1C7C54' : '#C62828'}">${e.ok ? 'OK' : 'Erro'}</span><div class="t"><b>${e.a} · ${e.h}</b><small>${e.d}</small></div><b style="font-size:12px;font-weight:600">US$ ${e.c.toFixed(2).replace('.', ',')}</b></div>`).join('')}</div>`;
  },
  relatorios: () => {
    const tabs = `<div class="y-tabs">${[['geral', 'Visão geral'], ['horarios', 'Melhores horários'], ['posts', 'Posts'], ['conc', 'Concorrentes']].map(([k, n]) => `<button data-rt="${k}" class="${rtab === k ? 'on' : ''}">${n}</button>`).join('')}</div>`;
    const hd = head('', 'Relatórios', 'Instagram dos 5 perfis · o Mímir coleta todo dia às 06:47', '<button class="y-btn" id="yCsv">Exportar CSV</button>');
    const pts = []; let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    Object.keys(PF).forEach((p, j) => { const n = [9, 12, 2, 1, 4][j]; for (let i = 0; i < n; i++) pts.push({ p, d: Math.floor(rnd() * 28), v: Math.round(60 + rnd() * 260 * (p === 'EL' ? 1.6 : 1)) }); });
    pts.push({ p: 'EL', d: 25, v: 1352 });
    if (rtab === 'geral') {
      const W = 640, H = 210, x = (d) => 40 + d / 27 * (W - 60), mx = 1500, y = (v) => H - 22 - Math.sqrt(v / mx) * (H - 40), med = 113;
      return hd + tabs + `<div class="y-g y-g6">${[['Seguidores', '1.284', '+96 no período'], ['Visualizações', '3.797', '+18% vs. anterior'], ['Alcance', '3.076', '+11% vs. anterior'], ['Interações', '183', '+9% vs. anterior'], ['Taxa de engajamento', '5,9%', 'interações ÷ alcance'], ['Mediana de views', '113', '28 posts no período']].map(([l, v, s]) => `<div class="y-card y-k"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`).join('')}</div>
      <div class="y-card" style="margin-top:10px"><b style="font-size:12.5px;font-weight:600">Views por post, na data de publicação</b><p style="font-size:11px;color:var(--y-muted)">Cada ponto é um post. A linha tracejada é a mediana do período. Passe o mouse num ponto pra ver o post.</p>
      <div class="y-leg" style="margin:8px 0">${Object.entries(PF).map(([k, v]) => `<span><span class="y-dot" style="background:${v.c};border-radius:50%"></span>${v.n}</span>`).join('')}</div>
      <svg viewBox="0 0 ${W} ${H}" width="100%">${[0, 100, 500, 1500].map(v => `<line x1="40" x2="${W - 20}" y1="${y(v)}" y2="${y(v)}" stroke="#ECECF0"/><text x="32" y="${y(v) + 3}" text-anchor="end" font-size="9" fill="#9A9AA6">${fmt(v)}</text>`).join('')}<line x1="40" x2="${W - 20}" y1="${y(med)}" y2="${y(med)}" stroke="#9A9AA6" stroke-dasharray="4 4"/>${pts.map(t => `<circle cx="${x(t.d)}" cy="${y(t.v)}" r="${t.v > 1000 ? 6 : 4.5}" fill="${PF[t.p].c}" opacity=".85"><title>${PF[t.p].n} · ${fmt(t.v)} views</title></circle>`).join('')}<text x="${x(25) - 10}" y="${y(1352) + 4}" text-anchor="end" font-size="10.5" font-weight="600" fill="#16161D">O time que gastou pouco e chegou longe · 1.352</text></svg></div>`;
    }
    if (rtab === 'horarios') {
      const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], hs = ['08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];
      return hd + tabs + `<div class="y-card"><b style="font-size:12.5px;font-weight:600">Melhores horários pra publicar</b><p style="font-size:11px;color:var(--y-muted);margin-bottom:10px">Mediana de views nas primeiras 24 h, por dia e hora. É daqui que sai a cadência que o Hermod usa.</p><div class="y-heat"><span></span>${hs.map(h => `<span>${h}</span>`).join('')}${dias.map((d, i) => `<span>${d}</span>${hs.map((h, j) => { const v = Math.max(.05, Math.min(1, .25 + .5 * Math.exp(-((j - 2) ** 2) / 2) + .45 * Math.exp(-((j - 6) ** 2) / 1.5) - (i > 4 ? .15 : 0) + (rnd() - .5) * .15)); return `<span style="background:rgba(255,106,0,${(.08 + v * .8).toFixed(2)});color:${v > .6 ? '#fff' : '#3A3A46'}" title="${d} ${h}">${Math.round(v * 180)}</span>`; }).join('')}`).join('')}</div></div>`;
    }
    return hd + tabs + `<div class="y-card"><b style="font-size:14px;font-weight:600">${rtab === 'posts' ? 'Posts' : 'Concorrentes'}</b><p style="font-size:12.5px;color:var(--y-ink2);margin-top:6px;max-width:62ch">${rtab === 'posts' ? 'Cada post com views, alcance, salvamentos e a foto das primeiras 24 horas, pra comparar formatos e ganchos.' : 'Perfis de referência acompanhados lado a lado: frequência, formatos e o que está performando fora da casa.'}</p></div>`;
  },
  caixa: () => head('', 'Caixa de entrada', 'Tudo que os agentes fazem vira aviso aqui e chega no celular.') + `<div class="y-card">${avisos.map(v => `<div class="y-ev ${v.nw ? 'new' : ''}"><time>${v.h}</time><span class="who">${v.a}</span><span>${v.t}</span></div>`).join('')}</div>`,
};
const URL = { inicio: '', pipeline: 'editora', estudio: 'estudio-de-video', agentes: 'automacoes', relatorios: 'relatorios', caixa: 'avisos' };
function render() { page.innerHTML = V[cur](); badges(); bind(); }
function go(v) { cur = v; sel = null; if (v === 'caixa') newN = 0; page.classList.add('fade'); setTimeout(() => { render(); page.scrollTop = 0; page.classList.remove('fade'); if (v === 'caixa') setTimeout(() => avisos.forEach(a => a.nw = 0), 2500); }, 140); $('#yUrl').textContent = URL[v]; $$('.y-ri', demo).forEach(b => b.classList.toggle('on', b.dataset.v === v)); }
$$('.y-ri', demo).forEach(b => b.onclick = () => go(b.dataset.v));
$('#yBell').onclick = () => go('caixa');
$('#ySearch').onkeydown = (e) => { if (e.key === 'Enter') { pview = 'lista'; go('pipeline'); } };
$('#yNewBtn').onclick = (e) => { e.stopPropagation(); const w = e.target.parentElement; const old = $('.y-menu', w); if (old) return old.remove(); const m = document.createElement('div'); m.className = 'y-menu'; m.innerHTML = `<button data-c="cortes">Corte de um link<small>Estúdio · Cortes com IA</small></button><button data-c="pedido">Pedir pra IA<small>Vai pra fila do Thor</small></button><button data-c="agente">Novo agente<small>Criar com IA, conversando</small></button>`; w.appendChild(m); m.onclick = (ev) => { const c = ev.target.closest('[data-c]')?.dataset.c; m.remove(); if (c === 'cortes') { stab = 'cortes'; go('estudio'); } if (c === 'agente') { atab = 'conv'; go('agentes'); } if (c === 'pedido') { pedidos.unshift({ p: 'LS', t: 'Novo pedido feito pelo + Criar', tp: 'Post', s: 'fila', em: '17 nov ' + now(), n: 'Na fila da próxima rodada do Thor.' }); stab = 'fila'; sfil = 'all'; go('estudio'); yt('Pedido na fila', 'O Thor pega na próxima rodada', 'send'); aviso('Hub', 'Novo pedido entrou na fila do Thor.'); } }; };
demo.addEventListener('click', (e) => { if (!e.target.closest('.y-menu,#yNewBtn')) $('.y-menu', demo)?.remove(); });

function thorDelivers(x, ms) { setTimeout(() => { if (x.s !== 'rev' && x.s !== 'ras') return; x.s = 'agu'; x.work = null; aviso('Thor', `Entregou "${x.t}". Aguardando aprovação.`); yt('O Thor entregou um post', 'Está em Aguardando aprovação', 'bot'); if (cur === 'pipeline' || cur === 'inicio') render(); else badges(); }, ms); }
function approve(x) { x.s = 'age'; x.d = SLOTS[slot++ % SLOTS.length]; aviso('Hermod', `Agendou "${x.t}" para ${x.d}, na próxima vaga da cadência.`); yt('Aprovado', 'O Hermod agendou para ' + x.d, 'cal'); }
function bind() {
  $$('[data-go]', page).forEach(b => b.onclick = () => { if (b.dataset.open) open[b.dataset.open] = 1; if (b.dataset.view) pview = b.dataset.view; go(b.dataset.go); });
  $$('[data-ok]', page).forEach(b => b.onclick = () => { approve(posts.find(x => x.id === +b.dataset.ok)); render(); });
  $$('[data-pv]', page).forEach(b => b.onclick = () => { pview = b.dataset.pv; render(); });
  $$('[data-col]', page).forEach(b => b.onclick = () => { const k = b.dataset.col; open[k] = !open[k]; render(); });
  const pf = $('#yPf', page); if (pf) pf.onchange = () => { pperfil = pf.value; render(); };
  const clr = $('#yClr', page); if (clr) clr.onclick = () => { $('#ySearch').value = ''; render(); };
  $$('.y-post', page).forEach(el => el.onclick = (e) => {
    const x = posts.find(p => p.id === +el.dataset.id), act = e.target.closest('[data-act]')?.dataset.act;
    if (x.s !== 'agu') return yt(x.s === 'age' ? 'Agendado: o Hermod publica sozinho' : x.s === 'pub' ? `${fmt(x.v || 0)} views até agora` : 'Os agentes estão cuidando deste', PF[x.p].n, 'check');
    if (!act) { sel = sel === x.id ? null : x.id; return render(); }
    sel = null;
    if (act === 'ok') approve(x);
    if (act === 'rev') { x.s = 'rev'; x.work = 'Thor revisando'; aviso('Thor', `Recebeu pedido de revisão de "${x.t}". A observação vira aprendizado.`); yt('Revisão pedida', 'O Thor refaz e devolve pra aprovação', 'redo'); thorDelivers(x, 4500); }
    if (act === 'no') { x.s = 'rep'; aviso('Hub', `"${x.t}" reprovado.`); yt('Reprovado', 'O post sai do fluxo', 'x'); }
    render();
  });
  $$('[data-st]', page).forEach(b => b.onclick = () => { stab = b.dataset.st; render(); });
  $$('[data-sf]', page).forEach(b => b.onclick = () => { sfil = b.dataset.sf; render(); });
  $$('[data-at]', page).forEach(b => b.onclick = () => { atab = b.dataset.at; render(); });
  $$('[data-rt]', page).forEach(b => b.onclick = () => { rtab = b.dataset.rt; render(); });
  $$('[data-w]', page).forEach(b => b.onclick = () => { const [j, w] = b.dataset.w.split(':'); const a = AG[+j]; if (a.w === w) return; a.w = w; aviso(a.k, w === 'hub' ? 'Passou a rodar no Hub. A tarefa do Claude encerra sozinha.' : 'Voltou pro Claude. Desligado no Hub.'); yt(`${a.k} agora roda ${w === 'hub' ? 'no Hub' : 'no Claude'}`, w === 'hub' ? 'A tarefa do Claude checa e não executa' : 'Desligado no Hub', 'bot'); render(); });
  $$('[data-sw]', page).forEach(b => b.onclick = () => { const a = AG[+b.dataset.sw]; a.on = !a.on; aviso(a.k, a.on ? 'Ligado pelo dono.' : 'Desligado pelo dono.'); render(); });
  const allc = $('#yAllC', page); if (allc) allc.onclick = () => { AG.forEach(a => { if (!a.fix) a.w = 'claude'; }); aviso('Hub', 'Tudo pelo Claude: os agentes de IA voltaram pro Claude. Hermod e Mímir seguem no Hub.'); yt('Tudo pelo Claude', 'Hermod e Mímir são código e seguem no Hub', 'bot'); render(); };
  const csv = $('#yCsv', page); if (csv) csv.onclick = () => { const a = document.createElement('a'); a.href = URL_.createObjectURL(new Blob(['﻿perfil;post;views\n' + posts.filter(x => x.s === 'pub').map(x => `${PF[x.p].n};${x.t};${x.v}`).join('\n')], { type: 'text/csv' })); a.download = 'ygg-relatorio.csv'; a.click(); yt('CSV baixado', 'Posts publicados com views', 'download'); };
  const cf = $('#yChatF', page); if (cf) cf.onsubmit = (e) => { e.preventDefault(); const i = $('input', cf), t = i.value.trim(); if (!t) return; i.value = ''; const ch = $('#yChat', page); ch.insertAdjacentHTML('beforeend', `<div class="y-msg me">${esc(t)}</div><div class="y-msg bot"><span class="y-spin"></span></div>`); ch.scrollTop = 1e6; setTimeout(() => { ch.lastElementChild.outerHTML = `<div class="y-msg bot">Desenhei assim:<br><b>Gatilho:</b> agenda que você descreveu.<br><b>Passos:</b> lê o histórico do perfil → busca os assuntos da semana → escreve as pautas → manda pro Pipeline em Rascunho.<br><b>Roda:</b> no Hub, com Sonnet 5.5 e teto de US$ 1,00 por rodada.<br>Quer que eu crie?</div>`; ch.scrollTop = 1e6; }, 1100); };
  const g = $('#yGen', page); if (g) g.onclick = () => {
    const steps = ['Baixando o episódio', 'Transcrevendo palavra por palavra', 'Achando os trechos com gancho', 'Renderizando em 9:16 com legenda', 'Separando quente e atemporal']; const pr = $('#yLp', page).value;
    const CUTS = [{ q: 'Ninguém lê o projeto inteiro antes de votar', d: '1:12', hot: 1 }, { q: 'O erro foi achar que o público não ia entender', d: '1:05', hot: 0 }, { q: 'Eu mudaria a regra do jogo no primeiro dia', d: '1:21', hot: 1 }];
    g.disabled = true; const ul = $('#ySteps', page); $('#yCuts', page).innerHTML = ''; ul.innerHTML = steps.map(s => `<li><i></i>${s}</li>`).join(''); const lis = [...ul.children];
    lis.forEach((li, i) => { setTimeout(() => li.className = 'run', i * 800); setTimeout(() => { li.className = 'done'; li.firstChild.innerHTML = icon('check'); }, i * 800 + 750); });
    setTimeout(() => { g.disabled = false; aviso('Sindri', `Gerou 3 cortes do link enviado pra ${PF[pr].n}. 2 quentes, 1 atemporal.`);
      $('#yCuts', page).innerHTML = `<div class="y-cuts">${CUTS.map((c, i) => `<div class="y-cut" style="animation-delay:${i * .1}s"><div class="tb"><small>${c.d}</small><q>“${c.q}”</q></div><div class="bd"><div style="display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--y-muted)">${av(pr, 18)}${PF[pr].n}<span class="y-pill" style="margin-left:auto;${c.hot ? 'background:#FFF1E6;color:#B8570F' : ''}">${c.hot ? 'Quente · 5 dias' : 'Atemporal'}</span></div><button class="y-btn" data-cut="${i}">${icon('send')}Mandar pro Pipeline</button></div></div>`).join('')}</div>`;
      $$('[data-cut]', page).forEach(b => b.onclick = () => { const c = CUTS[+b.dataset.cut]; const x = { id: ++uid, p: pr, t: c.q, f: 'Reels', s: 'ras', d: '—', work: 'Thor conferindo legenda e capa' }; posts.unshift(x); pedidos.unshift({ p: pr, t: c.q, tp: 'Corte', s: 'fila', em: '17 nov ' + now(), n: 'Corte entrou em Rascunho. O Thor confere e manda pra aprovação.' }); b.disabled = true; b.innerHTML = icon('check') + 'No Pipeline'; aviso('Hub', `Corte "${c.q}" entrou em Rascunho.`); yt('Corte no Pipeline', 'Entrou em Rascunho; o Thor confere e manda pra aprovação', 'send'); thorDelivers(x, 5000); badges(); });
    }, steps.length * 800 + 250);
  };
}
const URL_ = window.URL;
go('inicio');
const t3 = posts.find(x => x.id === 3); let started = false;
new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !started) { started = true; thorDelivers(t3, 8000); } }), { threshold: .3 }).observe(demo);
})();

