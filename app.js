/* Portal do Aluno & Candidato Behring — protótipo de alta fidelidade.
   Dados simulados (hard coded); o estado vive em memória e em sessionStorage. */
'use strict';

/* ------------------------------------------------------------------ */
/* Ícones                                                              */
/* ------------------------------------------------------------------ */
const ICONS = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  hourglass: '<path d="M7 3h10M7 21h10M8 3v3a4 4 0 0 0 8 0V3M8 21v-3a4 4 0 0 1 8 0v3"/>',
  alert: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
  file: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>',
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  message: '<path d="M4 5h16v11H9l-5 4z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  megaphone: '<path d="M3 10v4h4l7 5V5l-7 5z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
  edit: '<path d="M4 20h4L20 8l-4-4L4 16z"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
  save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
  graduation: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
};
const icon = (name, cls = 'ico') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

const STATUS_ICON = { done: 'check', todo: 'clock', wait: 'hourglass', fix: 'alert', future: 'calendar' };
const status = (kind, text) => `<span class="status ${kind}">${icon(STATUS_ICON[kind])}${text}</span>`;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ------------------------------------------------------------------ */
/* Glossário (ajuda contextual "?")                                    */
/* ------------------------------------------------------------------ */
const GLOSSARY = {
  edital: ['Edital', 'Documento oficial com as regras, os requisitos e os prazos do programa.'],
  comprobatoria: ['Documentação comprobatória', 'Documentos que comprovam o que você informou, como renda ou matrícula.'],
  media: ['Média geral', 'Média das suas notas finais do ensino médio. Ela aparece no seu histórico escolar.'],
  renda: ['Renda familiar mensal', 'Soma do que todas as pessoas que moram com você recebem por mês, antes dos descontos.'],
  analise: ['Análise documental', 'Etapa em que a equipe da Fundação confere se os documentos enviados atendem ao edital.'],
  triagem: ['Triagem', 'Etapa em que a Fundação avalia o perfil dos candidatos para selecionar quem segue para a entrevista.'],
  protocolo: ['Número de protocolo', 'Código que identifica a sua inscrição. Use-o se precisar falar com a Fundação.'],
};
let helpSeq = 0;
const help = key => {
  const id = `help-${key}-${++helpSeq}`;
  const [term, text] = GLOSSARY[key];
  return `<button type="button" class="help-btn" data-help="${id}" aria-expanded="false" aria-controls="${id}" aria-label="O que é ${term.toLowerCase()}?">?</button>`
    + `<span class="help-pop" id="${id}" role="note"><strong>${term}:</strong> ${text}</span>`;
};

/* ------------------------------------------------------------------ */
/* Dados fixos                                                         */
/* ------------------------------------------------------------------ */
const USER = { nome: 'Kira Almeida', primeiro: 'Kira', email: 'kira.almeida@email.com', iniciais: 'KA' };

const PROGRAMS = {
  scholars: {
    nome: 'Behring Scholars 2027', curto: 'Behring Scholars', situacao: 'abertas', ate: '15/11/2026',
    resumo: 'Bolsas de estudo para estudantes de graduação em áreas de tecnologia.',
    etapas: ['Inscrição', 'Análise documental', 'Triagem', 'Entrevista', 'Resultado'],
    docs: [['Documento de identidade', 'PDF, JPG ou PNG, até 5 MB'], ['Histórico escolar do ensino médio', 'PDF, até 5 MB'], ['Comprovante de renda familiar', 'PDF, JPG ou PNG, até 5 MB'], ['Comprovante de matrícula na graduação', 'PDF, até 5 MB (pedido após a inscrição)']],
    requisitos: [['Matrícula ativa em curso de graduação', true, 'Universidade de São Paulo — do seu perfil'], ['Histórico escolar do ensino médio', true, 'Em Meus documentos'], ['Renda familiar informada', false, 'Informe na etapa 3 da inscrição']],
  },
  founders: {
    nome: 'Behring Founders 2027', curto: 'Behring Founders', situacao: 'abertas', ate: '30/11/2026',
    resumo: 'Apoio e aceleração para fundadores de startups de tecnologia.',
    etapas: ['Inscrição', 'Avaliação do projeto', 'Pitch', 'Resultado'],
    docs: [['Documento de identidade', 'PDF, JPG ou PNG, até 5 MB'], ['Apresentação da startup', 'PDF, até 20 MB'], ['Contrato social ou CNPJ', 'PDF, até 5 MB']],
    requisitos: [['Ser maior de 18 anos', true, 'Do seu perfil'], ['Ter uma startup de tecnologia em operação', false, 'Não informado no perfil'], ['CNPJ ativo', false, 'Não informado no perfil']],
  },
  academy: {
    nome: 'Behring Academy 2027', curto: 'Behring Academy', situacao: 'breve', ate: '01/02/2027',
    resumo: 'Mentoria e cursos para estudantes do ensino médio de escolas públicas.',
    etapas: ['Inscrição', 'Prova on-line', 'Entrevista', 'Resultado'],
    docs: [['Documento de identidade', 'PDF, JPG ou PNG, até 5 MB'], ['Declaração escolar', 'PDF, até 5 MB'], ['Autorização dos responsáveis', 'PDF, até 5 MB']],
    requisitos: [['Estar cursando o ensino médio em escola pública', false, 'Você concluiu o ensino médio em 2025']],
  },
};

const DOC_INFO = {
  identidade: { nome: 'Documento de identidade', formato: 'PDF, JPG ou PNG', max: 5, conteudo: 'Frente e verso legíveis, sem cortes.' },
  historico: { nome: 'Histórico escolar do ensino médio', formato: 'PDF', max: 5, conteudo: 'Todas as séries do ensino médio, com assinatura da escola.' },
  renda: { nome: 'Comprovante de renda familiar', formato: 'PDF, JPG ou PNG', max: 5, conteudo: 'Holerites ou declaração de IR de todos os moradores da casa, com nomes e valores visíveis.' },
  matricula: { nome: 'Comprovante de matrícula na graduação', formato: 'PDF', max: 5, conteudo: 'Declaração da universidade com curso e período atual, emitida há no máximo 30 dias.' },
  residencia: { nome: 'Comprovante de residência', formato: 'PDF, JPG ou PNG', max: 5, conteudo: 'Conta de consumo emitida nos últimos 3 meses.' },
};

/* ------------------------------------------------------------------ */
/* Cenários                                                            */
/* ------------------------------------------------------------------ */
const SCENARIOS = {
  inscricao: 'Inscrição em andamento (20/10/2026)',
  correcao: 'Correção solicitada (06/11/2026)',
  aguardando: 'Aguardando a Fundação (14/11/2026)',
  bolsa: 'Bolsa ativa (10/08/2027)',
};

function scenarioState(s) {
  const st = {
    scenario: s, logged: true, readNotices: [],
    today: { inscricao: '20/10/2026', correcao: '06/11/2026', aguardando: '14/11/2026', bolsa: '10/08/2027' }[s],
    lastVisit: { inscricao: '15/10', correcao: '01/11', aguardando: '06/11', bolsa: '20/07' }[s],
    insc: {
      status: s === 'inscricao' ? 'andamento' : 'enviada', etapa: 2, protocolo: 'BS-2027-0198', enviadaEm: '28/10/2026',
      f: { nome: 'Kira Almeida', nascimento: '14/03/2008', cpf: '123.456.789-09', email: USER.email, telefone: '(16) 99876-5432',
        instituicao: 'Universidade de São Paulo (USP)', curso: 'Ciência da Computação', periodo: '1º ano', conclusaoEM: '2025', media: '',
        rendaFaixa: '', pessoas: '', motivacao: '' },
      docs: { identidade: 'reuse', historico: 'reuse', renda: null },
      savedAt: '14:32',
    },
    docs: {
      identidade: { status: 'done', label: 'Aprovado', arquivo: 'RG_Kira_Almeida.pdf', usado: ['Scholars 2027', 'Academy 2024'], data: 'Aprovado em 29/10/2026' },
      historico: { status: 'done', label: 'Aprovado', arquivo: 'Historico_escolar_EM.pdf', usado: ['Scholars 2027'], data: 'Aprovado em 04/11/2026' },
      renda: { status: null, usado: ['Scholars 2027'] },
      matricula: { status: null, usado: ['Scholars 2027'] },
      residencia: { status: 'todo', label: 'Vencendo', expiring: true, arquivo: 'Conta_luz_ago2026.pdf', usado: ['Academy 2024'], prazo: '18/11/2026', data: 'Vence em 18/11/2026' },
    },
    entregas: null,
  };
  const d = st.docs;
  if (s === 'inscricao') {
    d.identidade.data = 'Aprovado em 12/02/2024'; d.identidade.usado = ['Academy 2024'];
    d.historico.data = 'Enviado em 15/10/2026'; d.historico.usado = ['Academy 2024'];
    d.renda = { status: 'todo', label: 'Para fazer', usado: ['Scholars 2027'], prazo: '15/11/2026', data: 'Pedido na etapa 4 da inscrição' };
    d.residencia.status = 'done'; d.residencia.label = 'Válido'; d.residencia.expiring = false; d.residencia.data = 'Válido até 18/11/2026';
    st.insc.f.media = '';
  } else {
    Object.assign(st.insc.f, { media: '8,7', rendaFaixa: 'De 1 a 3 salários mínimos', pessoas: '4', motivacao: 'Quero me dedicar integralmente à graduação em Ciência da Computação...' });
    st.insc.docs.renda = 'Comprovante_renda.jpg';
  }
  if (s === 'correcao') {
    d.renda = { status: 'fix', label: 'Corrigir', arquivo: 'Comprovante_renda.jpg', usado: ['Scholars 2027'], prazo: '13/11/2026', motivo: 'A foto enviada está desfocada e não é possível ler os valores.', data: 'Correção solicitada em 05/11/2026' };
    d.matricula = { status: 'todo', label: 'Para fazer', usado: ['Scholars 2027'], prazo: '20/11/2026', data: 'Pedido em 04/11/2026' };
    d.residencia.data = 'Vence em 12 dias (18/11/2026)';
  }
  if (s === 'aguardando') {
    d.renda = { status: 'wait', label: 'Em análise', arquivo: 'Comprovante_renda_2.pdf', usado: ['Scholars 2027'], previsao: '20/11/2026', data: 'Enviado em 07/11/2026' };
    d.matricula = { status: 'wait', label: 'Em análise', arquivo: 'Declaracao_matricula_USP.pdf', usado: ['Scholars 2027'], previsao: '20/11/2026', data: 'Enviado em 10/11/2026' };
    d.residencia = { status: 'done', label: 'Aprovado', arquivo: 'Conta_luz_out2026.pdf', usado: ['Academy 2024', 'Scholars 2027'], data: 'Atualizado em 12/11/2026' };
  }
  if (s === 'bolsa') {
    st.insc.status = 'bolsa';
    for (const k of ['renda', 'matricula']) d[k] = { status: 'done', label: 'Aprovado', arquivo: k === 'renda' ? 'Comprovante_renda_2.pdf' : 'Declaracao_matricula_USP.pdf', usado: ['Scholars 2027'], data: 'Aprovado em 18/11/2026' };
    d.residencia = { status: 'done', label: 'Aprovado', arquivo: 'Conta_luz_out2026.pdf', usado: ['Academy 2024', 'Scholars 2027'], data: 'Aprovado em 13/11/2026' };
    st.entregas = [
      { id: 'mat1', nome: 'Comprovante de matrícula — 1º semestre', status: 'done', label: 'Aprovado', data: 'Entregue em 02/03/2027' },
      { id: 'rel1', nome: 'Relatório de acompanhamento — 1º semestre', status: 'done', label: 'Aprovado', data: 'Entregue em 15/07/2027' },
      { id: 'hist1', nome: 'Histórico da graduação — 1º semestre', status: 'todo', label: 'Para fazer', prazo: '31/08/2027', dias: 21 },
      { id: 'rel2', nome: 'Relatório de acompanhamento — 2º semestre', status: 'future', label: 'Em breve', data: 'Envio abre em 01/12/2027' },
    ];
  }
  return st;
}

/* Estado persistido por aba (sessionStorage), com tolerância a falhas. */
const STORE_KEY = 'behring-proto-v1';
let state;
function load() {
  const params = new URLSearchParams(location.search);
  const forced = params.get('s');
  if (forced && SCENARIOS[forced]) return scenarioState(forced);
  if (forced === 'revisao') {
    // Variante usada nas capturas: inscrição completa, faltando só o comprovante de renda.
    const st = scenarioState('inscricao');
    Object.assign(st.insc.f, { media: '8,7', rendaFaixa: 'De 1 a 3 salários mínimos', pessoas: '4', motivacao: 'Quero me dedicar integralmente à graduação em Ciência da Computação.' });
    st.insc.etapa = 4;
    return st;
  }
  try { const raw = sessionStorage.getItem(STORE_KEY); if (raw) return JSON.parse(raw); } catch (e) { /* sem storage */ }
  return scenarioState('correcao');
}
function save() { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* sem storage */ } }
state = load();

/* ------------------------------------------------------------------ */
/* Regras derivadas                                                    */
/* ------------------------------------------------------------------ */
const daysLeft = { '13/11/2026': 7, '15/11/2026': 26, '20/11/2026': 14, '18/11/2026': 12, '31/08/2027': 21 };
function prazoText(prazo) {
  const n = daysLeft[prazo];
  return n == null ? `até ${prazo.slice(0, 5)}` : `até ${prazo.slice(0, 5)} — faltam ${n} dias`;
}

function tasks() {
  const t = [];
  const d = state.docs;
  if (state.insc.status === 'andamento') {
    t.push({ tone: 'todo', icon: 'edit', titulo: 'Continuar inscrição', programa: 'Behring Scholars 2027', detalhe: `Você parou na etapa ${state.insc.etapa} de 4`, prazo: '15/11/2026', acao: 'Continuar', href: `#/inscricao/${state.insc.etapa}` });
  }
  for (const [id, doc] of Object.entries(d)) {
    if (doc.status === 'fix') t.push({ tone: 'fix', icon: 'alert', titulo: `Corrigir ${DOC_INFO[id].nome.toLowerCase()}`, programa: 'Behring Scholars 2027', detalhe: doc.motivo, prazo: doc.prazo, acao: 'Resolver', href: `#/documentos/corrigir/${id}`, urgent: true });
  }
  for (const [id, doc] of Object.entries(d)) {
    // Documentos vencendo ficam em Meus documentos; aqui entram só as pendências dos processos.
    if (doc.status === 'todo' && !doc.expiring && state.insc.status !== 'andamento') {
      t.push({ tone: 'todo', icon: 'upload', titulo: `Enviar ${DOC_INFO[id].nome.toLowerCase()}`, programa: 'Behring Scholars 2027', detalhe: 'Pedido pela Fundação para a análise documental', prazo: doc.prazo, acao: 'Enviar', href: `#/documentos/enviar/${id}` });
    }
  }
  if (state.entregas) {
    for (const e of state.entregas) if (e.status === 'todo') t.push({ tone: 'todo', icon: 'upload', titulo: `Enviar ${e.nome.toLowerCase()}`, programa: 'Bolsa Behring Scholars', detalhe: 'Entrega periódica da bolsa', prazo: e.prazo, acao: 'Enviar', href: '#/bolsa' });
  }
  const order = p => daysLeft[p] ?? 99;
  return t.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || order(a.prazo) - order(b.prazo));
}

function waiting() {
  return Object.entries(state.docs).filter(([, d]) => d.status === 'wait')
    .map(([id, d]) => ({ titulo: DOC_INFO[id].nome, programa: 'Behring Scholars 2027', previsao: d.previsao }));
}

function inscPendencias() {
  const f = state.insc.f, p = [];
  if (!f.media) p.push({ etapa: 2, texto: 'Média geral do ensino médio não informada', campo: 'media' });
  if (!f.rendaFaixa) p.push({ etapa: 3, texto: 'Renda familiar mensal não informada', campo: 'rendaFaixa' });
  if (!f.pessoas) p.push({ etapa: 3, texto: 'Número de moradores não informado', campo: 'pessoas' });
  if (!f.motivacao) p.push({ etapa: 3, texto: 'Resposta sobre motivação em branco', campo: 'motivacao' });
  if (!state.insc.docs.renda) p.push({ etapa: 4, texto: 'Comprovante de renda familiar não enviado', campo: 'doc-renda' });
  return p;
}

function processStage() {
  // Índices das etapas do Behring Scholars: 0 Inscrição, 1 Análise documental, 2 Triagem, 3 Entrevista, 4 Resultado.
  if (state.insc.status === 'andamento') return 0;
  if (state.insc.status === 'bolsa') return 5;
  return 1;
}
const hasFix = () => Object.values(state.docs).some(d => d.status === 'fix');

function notices() {
  const n = [];
  const s = state.scenario;
  if (state.insc.status === 'bolsa') {
    n.push({ id: 'b1', icon: 'clock', titulo: 'Prazo próximo: histórico da graduação', texto: 'Envie o histórico do 1º semestre até 31/08/2027.', data: '01/08/2027' });
    n.push({ id: 'b2', icon: 'check', titulo: 'Relatório do 1º semestre aprovado', texto: 'Sua entrega foi aprovada pela equipe da Fundação.', data: '20/07/2027' });
    n.push({ id: 'b3', icon: 'graduation', titulo: 'Parabéns! Você é bolsista Behring Scholars', texto: 'Sua candidatura foi aprovada. A área da bolsa já está disponível.', data: '15/02/2027' });
    return n;
  }
  if (state.docs.renda.status === 'wait' && state.insc.status === 'enviada') n.push({ id: 'w1', icon: 'hourglass', titulo: 'Comprovante de renda recebido', texto: 'O documento está em análise. Resposta prevista até 20/11/2026.', data: 'Hoje' });
  if (state.justSubmitted) n.push({ id: 'sub', icon: 'check', titulo: 'Inscrição enviada', texto: `Protocolo ${state.insc.protocolo}. A análise documental começa em seguida.`, data: 'Hoje' });
  if (s !== 'inscricao') {
    n.push({ id: 'c1', icon: 'alert', titulo: 'Correção solicitada: comprovante de renda', texto: 'A foto enviada está desfocada. Envie um novo arquivo até 13/11/2026.', data: '05/11/2026' });
    n.push({ id: 'c2', icon: 'check', titulo: 'Histórico escolar aprovado', texto: 'O documento foi aprovado na análise documental.', data: '04/11/2026' });
    n.push({ id: 'c3', icon: 'upload', titulo: 'Novo documento pedido: comprovante de matrícula', texto: 'Envie até 20/11/2026.', data: '04/11/2026' });
    n.push({ id: 'c4', icon: 'check', titulo: 'Inscrição recebida', texto: 'Protocolo BS-2027-0198.', data: '28/10/2026' });
  }
  n.push({ id: 'g1', icon: 'megaphone', titulo: 'Behring Founders 2027: inscrições abertas', texto: 'Inscrições até 30/11/2026.', data: '10/10/2026' });
  n.push({ id: 'g2', icon: 'calendar', titulo: 'Lembrete: inscrições do Behring Scholars terminam em 15/11', texto: 'Seu progresso está salvo. Continue de onde parou.', data: '01/10/2026' });
  return n;
}
const unreadCount = () => notices().filter(n => !state.readNotices.includes(n.id)).length;

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
const NAV = [
  ['inicio', 'Início', 'home'],
  ['programas', 'Programas', 'grid'],
  ['documentos', 'Documentos', 'folder'],
  ['avisos', 'Avisos', 'bell'],
  ['perfil', 'Perfil', 'user'],
];
function layout(active, content, head = '') {
  const unread = unreadCount();
  const pend = Object.values(state.docs).filter(d => d.status === 'fix' || d.status === 'todo').length;
  const badge = id => {
    const n = id === 'avisos' ? unread : id === 'documentos' ? pend : 0;
    return n ? `<span class="count" aria-label="${n} ${id === 'avisos' ? 'não lidos' : 'pendentes'}">${n}</span>` : '';
  };
  const links = cls => NAV.map(([id, label, ic]) =>
    `<a href="#/${id}" ${active === id ? 'aria-current="page"' : ''}>${cls === 'bottom' ? icon(ic, 'ico-l') : ''}<span>${label}</span>${badge(id)}</a>`).join('');
  return `
  <header class="topbar on-dark">
    <div class="topbar-inner">
      <a class="brand" href="#/inicio"><img class="logo-light" src="assets/logo-fundacao-behring-branco.png" alt="Fundação Behring"><img class="logo-dark" src="assets/logo-fundacao-behring.png" alt="Fundação Behring"><span class="brand-sub">Portal do Aluno &amp; Candidato</span></a>
      <nav class="mainnav" aria-label="Principal">${links('top')}</nav>
      <a class="user-chip" href="#/perfil" aria-label="Seu perfil: ${USER.nome}"><span class="avatar" aria-hidden="true">${USER.iniciais}</span><span class="name">${USER.primeiro}</span></a>
    </div>
  </header>
  <main id="conteudo" tabindex="-1">${head}<div class="wrap">${content}</div></main>
  <nav class="bottomnav" aria-label="Principal (celular)">${links('bottom')}</nav>
  ${protoPanel()}`;
}

function protoPanel() {
  return `<aside class="proto-panel" aria-label="Controles do protótipo">
    <details><summary>Protótipo · cenário</summary>
      ${Object.entries(SCENARIOS).map(([k, v]) => `<button type="button" data-action="scenario" data-s="${k}" aria-pressed="${state.scenario === k}">${v}</button>`).join('')}
      <button type="button" data-action="logout">Ver tela de login</button>
    </details></aside>`;
}

const breadcrumb = items => `<nav class="breadcrumb" aria-label="Você está em">${items.map(([label, href], i) =>
  href ? `<a href="${href}">${i === 0 ? icon('left', 'ico') : ''}${label}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${label}</span>`).join('')}</nav>`;

/* Barras decorativas das páginas de programa do site (aria-hidden). */
const BARS = `<div class="bars" aria-hidden="true"><span style="width:140px;bottom:12px;left:0"></span><span class="w" style="width:56px;bottom:12px;left:150px"></span><span style="width:28px;bottom:12px;left:214px"></span></div>`;

/* Faixa de título quadrada, na cor do programa. */
function band({ title, sub = '', crumbs, kicker = '', program = '', extra = '' }) {
  return `<section class="band on-dark ${program}">${BARS}<div class="band-inner">
    ${crumbs ? breadcrumb(crumbs) : ''}${kicker ? `<div class="kicker">${kicker}</div>` : ''}
    <div class="row" style="align-items:flex-end"><div style="flex:1;min-width:260px"><h1 tabindex="-1">${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${extra}</div>
  </div></section>`;
}

const panel = (title, body, { count, link, id } = {}) => `<section class="panel" ${id ? `aria-labelledby="${id}"` : ''}>
  <div class="panel-head"><h2 ${id ? `id="${id}"` : ''}>${title}</h2>${count != null ? `<span class="count-muted">(${count})</span>` : ''}${link ? `<a href="${link[1]}">${link[0]}</a>` : ''}</div>${body}</section>`;

/* Trilha de etapas (vinda do estilo "Jornada"). */
const STAGE_ICONS = ['edit', 'folder', 'search', 'chat', 'star'];
function trail(etapas, stage, { attention = false, flag = '', compact = false } = {}) {
  return `<ol class="trail${compact ? ' compact' : ''}" aria-label="Etapas do processo">${etapas.map((e, i) => {
    const [label, date] = Array.isArray(e) ? e : [e, ''];
    const cls = i < stage ? 'done' : i === stage ? `current${attention ? ' attention' : ''}` : 'future';
    const sr = i < stage ? 'concluída' : i === stage ? 'etapa atual' : 'próxima';
    const ic = i < stage ? 'check' : i === stage && attention ? 'alert' : STAGE_ICONS[i] || 'star';
    return `<li class="${cls}"><span class="node">${icon(ic)}</span>${i === stage && flag ? `<span class="flag">${flag}</span>` : ''}<span class="label">${label}</span>${date ? `<span class="date">${date}</span>` : ''}<span class="sr-only">(${sr})</span></li>`;
  }).join('')}</ol>`;
}
const SCHOLARS_STEPS = () => [
  ['Inscrição', state.insc.status === 'andamento' ? 'até 15/11' : 'Enviada 28/10'],
  ['Análise documental', 'até 20/11'], ['Triagem', 'Dezembro'], ['Entrevista', 'Janeiro'], ['Resultado', 'Fevereiro'],
];

/* ------------------------------------------------------------------ */
/* Telas                                                               */
/* ------------------------------------------------------------------ */
function taskRow(t) {
  return `<article class="task tone-${t.tone}">
    <span class="icon-badge">${icon(t.icon, 'ico-l')}</span>
    <div>
      <h3>${t.titulo}</h3>
      <div class="meta">${t.programa}${t.detalhe ? ` · ${t.detalhe}` : ''}</div>
      ${t.prazo ? `<div class="deadline">${icon('calendar')} ${prazoText(t.prazo)}</div>` : ''}
    </div>
    <a class="btn ${t.tone === 'fix' ? 'btn-danger' : 'btn-primary'}" href="${t.href}">${t.acao}<span class="sr-only">: ${t.titulo}</span></a>
  </article>`;
}

function screenInicio() {
  const t = tasks(), w = waiting();
  const urgent = t.find(x => x.urgent);
  const stage = processStage();
  const bolsa = state.insc.status === 'bolsa';

  let sub, spot;
  if (urgent) {
    sub = `Falta pouco. ${t.length > 1 ? `Você tem ${t.length} tarefas, 1 delas urgente.` : 'Você tem 1 tarefa urgente.'}`;
    spot = `<div class="spot fix"><div class="kick">${icon('alert')} Ação necessária · ${prazoText(urgent.prazo).replace('até ', '')}</div>
      <h2>${urgent.titulo.replace('Corrigir', 'Corrija o')}</h2><p>${urgent.detalhe}</p>
      <a class="btn btn-danger" href="${urgent.href}">Resolver agora ${icon('right')}</a></div>`;
  } else if (t.length) {
    sub = state.insc.status === 'andamento' ? 'Sua inscrição no Behring Scholars 2027 está salva. Continue de onde parou.' : `Você tem ${t.length} tarefa${t.length > 1 ? 's' : ''} para fazer.`;
    spot = `<div class="spot"><div class="kick" style="color:var(--todo)">${icon('clock')} Próxima tarefa · ${prazoText(t[0].prazo).replace('até ', '')}</div>
      <h2>${t[0].titulo}</h2><p>${t[0].programa} · ${t[0].detalhe}</p>
      <a class="btn btn-primary" href="${t[0].href}">${t[0].acao} ${icon('right')}</a></div>`;
  } else {
    sub = bolsa ? 'Sua bolsa está ativa e todas as entregas estão em dia.' : 'Tudo em dia. Agora é com a Fundação.';
    spot = `<div class="spot ok"><div class="kick">${icon('check')} Tudo em dia</div>
      <h2>Nenhuma ação necessária</h2><p>${bolsa ? 'Avisaremos quando a próxima entrega abrir.' : 'A Fundação está analisando seus documentos. Resultado da análise previsto até 20/11/2026.'}</p>
      <a href="#/processo/scholars">Acompanhar o processo</a></div>`;
  }
  const head = `<section class="band hero on-dark">${BARS}<div class="band-inner">
      <div><div class="kicker">Hoje, ${state.today}</div><h1 tabindex="-1">Olá, ${USER.primeiro}.</h1><p>${sub}</p></div>${spot}</div></section>`;

  const nextDeadline = t.filter(x => x.prazo).map(x => x.prazo).sort((a, b) => (daysLeft[a] ?? 99) - (daysLeft[b] ?? 99))[0];
  const fixN = t.filter(x => x.urgent).length;
  const kpis = `<div class="kpis" role="list" aria-label="Resumo">
    <div class="kpi ${fixN ? 'is-fix' : ''}" role="listitem"><div class="l">${icon('alert')} Correções</div><div class="v">${fixN}</div><div class="s">${fixN ? 'precisa da sua ação' : 'nenhuma'}</div></div>
    <div class="kpi" role="listitem"><div class="l">${icon('clock')} Para fazer</div><div class="v">${t.length}</div><div class="s">${t.length ? 'tarefas abertas' : 'nada pendente'}</div></div>
    <div class="kpi" role="listitem"><div class="l">${icon('hourglass')} Com a Fundação</div><div class="v">${w.length}</div><div class="s">${w.length ? 'em análise' : 'nada em análise'}</div></div>
    <div class="kpi" role="listitem"><div class="l">${icon('calendar')} Próximo prazo</div><div class="v">${nextDeadline ? nextDeadline.slice(0, 5) : '—'}</div><div class="s">${nextDeadline && daysLeft[nextDeadline] ? `faltam ${daysLeft[nextDeadline]} dias` : 'sem prazos abertos'}</div></div>
  </div>`;

  const journey = bolsa
    ? panel('Bolsa Behring Scholars — entregas de 2027', `<div class="panel-body"><div class="row" style="margin-bottom:8px"><strong>${state.entregas.filter(x => x.status === 'done').length} de ${state.entregas.length} entregas concluídas</strong><span class="spacer"></span>${status('done', 'Bolsa ativa')}</div>
        <div class="progress" role="img" aria-label="${state.entregas.filter(x => x.status === 'done').length} de ${state.entregas.length} entregas concluídas"><span style="width:${state.entregas.filter(x => x.status === 'done').length / state.entregas.length * 100}%"></span></div></div>`, { link: ['Ver bolsa', '#/bolsa'], id: 'jr-t' })
    : panel('Sua jornada no Behring Scholars 2027', `<div class="panel-body">${trail(SCHOLARS_STEPS(), stage, { attention: hasFix(), flag: hasFix() ? '1 correção' : '' })}</div>`, { link: ['Abrir processo', '#/processo/scholars'], id: 'jr-t' });

  const todoPanel = panel('Para fazer agora', t.length ? `<div class="panel-body">${t.map(taskRow).join('')}</div>`
    : `<div class="panel-empty">${icon('check', 'ico-l')}<span><strong>Nada a fazer por enquanto.</strong> Avisaremos você quando houver uma nova ação.</span></div>`, { count: t.length, id: 'todo-t' });
  const waitPanel = panel('Aguardando a Fundação', w.length ? `<div class="panel-body">${w.map(x => `<article class="task tone-wait"><span class="icon-badge">${icon('hourglass', 'ico-l')}</span>
      <div><h3 style="font-size:var(--fs-s)">${x.titulo}</h3><div class="meta">Resposta prevista até ${x.previsao.slice(0, 5)}</div><div class="small" style="font-weight:700;color:var(--wait)">Nenhuma ação necessária</div></div></article>`).join('')}</div>`
    : `<div class="panel-empty">${icon('hourglass', 'ico-l')}<span>Nada em análise no momento.</span></div>`, { count: w.length, id: 'wait-t' });
  const progs = panel('Seus programas', `<div class="panel-body"><ul class="list">
      <li><div style="flex:1"><strong>Behring Scholars 2027</strong><div class="small muted">${bolsa ? 'Bolsista desde 02/2027' : `Etapa ${stage + 1} de 5`}</div></div>${bolsa ? status('done', 'Bolsa ativa') : hasFix() ? status('fix', 'Corrigir') : t.length ? status('todo', 'Para fazer') : status('wait', 'Em análise')}</li>
      <li><div style="flex:1"><strong>Behring Academy 2024–2026</strong><div class="small muted">Programa concluído</div></div>${status('done', 'Concluído')}</li></ul></div>`, { id: 'pg-t' });
  const news = panel('Novidades da Fundação', `<div class="panel-body"><ul class="list">
      <li>${icon('megaphone', 'ico-l')}<div style="flex:1"><strong>Behring Founders 2027</strong><div class="small muted">Inscrições até 30/11/2026</div></div><a href="#/programas/founders">Ver<span class="sr-only"> Behring Founders</span></a></li>
      <li>${icon('calendar', 'ico-l')}<div style="flex:1"><strong>Behring Academy 2027</strong><div class="small muted">Abre em 01/02/2027</div></div><a href="#/programas/academy">Ver<span class="sr-only"> Behring Academy</span></a></li></ul></div>`, { id: 'nw-t' });

  return layout('inicio', `${kpis}${journey}<div class="grid-2 section"><div>${todoPanel}</div><div>${waitPanel}${progs}${news}</div></div>`, head);
}

function screenProgramas() {
  const color = { scholars: 'var(--brand)', founders: 'var(--founders)', academy: 'var(--academy)' };
  // A inscrição do usuário é destacada pelo contorno, pelo selo "Sua inscrição" e pela ação principal.
  const mine = id => {
    if (id !== 'scholars') return '';
    const st = state.insc.status;
    return st === 'andamento' ? { cta: 'Continuar inscrição', href: `#/inscricao/${state.insc.etapa}` }
      : st === 'bolsa' ? { cta: 'Ver minha bolsa', href: '#/bolsa' }
      : { cta: 'Acompanhar inscrição', href: '#/processo/scholars' };
  };
  const card = (id, p) => {
    const m = mine(id);
    const st = p.situacao === 'abertas' ? status('done', 'Inscrições abertas') : status('future', 'Em breve');
    return `<article class="prog-card${m ? ' is-mine' : ''}" style="--pc:${color[id]}" aria-labelledby="pc-${id}">
      <div class="prog-top on-dark"><div class="row"><span class="small" style="font-weight:700;letter-spacing:.08em;text-transform:uppercase;flex:1">${p.curto}</span>${m ? `<span class="mine-flag">${icon('check')} Sua inscrição</span>` : ''}</div>
        <h2 id="pc-${id}">${p.nome}</h2></div>
      <div class="prog-body">
        <div>${st}</div>
        <p style="margin:0">${p.resumo}</p>
        <p class="small muted" style="margin:0">${p.situacao === 'abertas' ? `Inscrições até ${p.ate}` : `Inscrições abrem em ${p.ate}`}</p>
        <div class="prog-actions">
          ${m ? `<a class="btn btn-primary btn-block" href="${m.href}">${m.cta}</a>`
            : `<a class="btn btn-secondary btn-block" href="#/programas/${id}">Ver detalhes e requisitos<span class="sr-only">: ${p.nome}</span></a>`}</div>
      </div></article>`;
  };
  return layout('programas', `<div class="prog-grid">${Object.entries(PROGRAMS).map(([id, p]) => card(id, p)).join('')}</div>`,
    band({ title: 'Programas', sub: 'Conheça os programas da Fundação Behring e veja se você pode participar antes de se inscrever.' }));
}

function screenPrograma(id) {
  const p = PROGRAMS[id];
  if (!p) return screenNotFound();
  const ok = p.requisitos.filter(r => r[1]).length;
  let cta;
  if (id === 'scholars') {
    cta = state.insc.status === 'andamento'
      ? `<a class="btn btn-primary btn-block" href="#/inscricao/${state.insc.etapa}">Continuar inscrição (etapa ${state.insc.etapa} de 4)</a><p class="small muted" style="text-align:center;margin-top:8px">Seu progresso está salvo.</p>`
      : `<a class="btn btn-secondary btn-block" href="#/processo/scholars">Acompanhar minha inscrição</a>`;
  } else if (p.situacao === 'breve') {
    cta = `<button class="btn btn-primary btn-block" data-action="toast" data-msg="Lembrete ativado. Avisaremos quando as inscrições abrirem.">${icon('bell')} Avisar quando abrir</button>`;
  } else {
    cta = `<button class="btn btn-primary btn-block" data-action="toast" data-msg="No protótipo, apenas a inscrição do Behring Scholars está disponível.">Começar inscrição</button><p class="small muted" style="text-align:center;margin-top:8px">Seus dados do perfil já vêm preenchidos.</p>`;
  }
  const content = `<div class="grid-2"><div>
      ${panel('Etapas do programa', `<div class="panel-body">${trail(p.etapas, -1)}</div>`, { id: 'et-t' })}
      ${panel(`Documentos exigidos`, `<div class="panel-body"><ul class="list">${p.docs.map(([n, f]) => `<li>${icon('file', 'ico-l')}<div><strong>${n}</strong><div class="small muted">${f}</div></div></li>`).join('')}</ul></div>`, { count: p.docs.length, id: 'dc-t' })}
      ${panel('Edital', `<div class="panel-body"><div class="row"><span>O que é um edital?</span>${help('edital')}</div>
        <p style="margin-top:var(--sp-3)">As regras completas, os critérios de seleção e o calendário estão no edital do programa.</p>
        <a href="#/programas/${id}" data-action="toast" data-msg="No protótipo, o edital em PDF não está disponível.">${icon('file')} Ler o edital (PDF, 320 KB)</a></div>`, { id: 'ed-t' })}
    </div><div>
      ${panel('Você pode se inscrever?', `<div class="panel-body"><ul class="list elig">${p.requisitos.map(([r, okk, src]) => `<li class="${okk ? 'ok' : 'miss'}"><span class="mark">${icon(okk ? 'check' : 'alert')}</span><div><strong>${r}</strong><div class="small muted">${okk ? 'Atendido' : 'Falta'} · ${src}</div></div></li>`).join('')}</ul>
        <p class="small" style="margin-top:var(--sp-3)"><strong>${ok} de ${p.requisitos.length}</strong> requisitos atendidos pelo seu perfil.</p>
        ${ok < p.requisitos.length ? `<a href="#/perfil">Completar perfil ${icon('right')}</a>` : ''}
        <div style="margin-top:var(--sp-5)">${cta}</div></div>`, { id: 'el-t' })}
    </div></div>`;
  return layout('programas', content, band({ title: p.nome, sub: `${p.resumo} ${p.situacao === 'abertas' ? `Inscrições abertas até ${p.ate}.` : `Inscrições abrem em ${p.ate}.`}`,
    crumbs: [['Programas', '#/programas'], [p.nome]], program: id === 'academy' ? 'academy' : id === 'founders' ? 'founders' : '' }));
}

const ETAPAS = ['Dados pessoais', 'Dados escolares', 'Perguntas', 'Documentos'];
function inscSidebar(current) {
  const pend = inscPendencias();
  return `<aside class="card">
    <h2 style="font-size:var(--fs-m)">Etapas da inscrição</h2>
    <ol class="steps-nav" aria-label="Etapas da inscrição">${ETAPAS.map((e, i) => {
      const n = i + 1, done = !pend.some(p => p.etapa === n) && n !== current;
      return `<li class="${done ? 'is-done' : ''}"><a href="#/inscricao/${n}" ${n === current ? 'aria-current="step"' : ''}><span class="num">${done ? icon('check') : n}</span>${e}${done ? '<span class="sr-only"> (completa)</span>' : ''}</a></li>`;
    }).join('')}
      <li><a href="#/inscricao/revisao" ${current === 'revisao' ? 'aria-current="step"' : ''}><span class="num">${icon('eye')}</span>Revisar e enviar</a></li></ol>
    <p class="save-indicator" role="status">${icon('save')} <span data-saved>Salvo automaticamente às ${state.insc.savedAt}</span></p>
    <button class="btn btn-ghost" style="padding-left:0" data-action="pause">${icon('pause')} Sair e continuar depois</button>
  </aside>`;
}

function field({ id, label, value = '', profile, helpKey, hint, type = 'text', required = true, options, textarea }) {
  const filled = String(value).trim() !== '';
  const stateTag = filled ? `<span class="field-state saved">${icon('check')} Salvo</span>` : required ? `<span class="field-state pending">${icon('clock')} Pendente</span>` : '';
  let control;
  if (options) control = `<select id="${id}" data-field="${id}" ${required ? 'required' : ''}><option value="">Selecione</option>${options.map(o => `<option ${o === value ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
  else if (textarea) control = `<textarea id="${id}" data-field="${id}" maxlength="1500" aria-describedby="${id}-hint">${esc(value)}</textarea>`;
  else control = `<input type="${type}" id="${id}" data-field="${id}" value="${esc(value)}" ${hint ? `aria-describedby="${id}-hint"` : ''} ${required ? 'required' : ''}>`;
  return `<div class="field">
    <div class="field-label"><label for="${id}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>${helpKey ? help(helpKey) : ''}${profile ? '<span class="tag-profile">do seu perfil</span>' : ''}${stateTag}</div>
    ${control}${hint ? `<div class="field-hint" id="${id}-hint">${hint}</div>` : ''}</div>`;
}

function docSlot(key, label) {
  const v = state.insc.docs[key];
  const info = DOC_INFO[key];
  const head = `<div class="field-label"><span>${label} <span class="req" aria-hidden="true">*</span></span><span class="small muted" style="font-weight:500">${info.formato}, até ${info.max} MB</span>
    ${v ? `<span class="field-state saved">${icon('check')} Salvo</span>` : `<span class="field-state pending">${icon('clock')} Pendente</span>`}</div>`;
  if (v === 'reuse') {
    return `<div class="field" id="doc-${key}">${head}<div class="file-row">${icon('folder')}<div><strong>${state.docs[key].arquivo}</strong><div class="small muted">Usando o arquivo de Meus documentos</div></div><span class="spacer"></span><button class="btn btn-ghost" data-action="clear-insc-doc" data-doc="${key}">Trocar<span class="sr-only"> ${label}</span></button></div></div>`;
  }
  if (v) {
    return `<div class="field" id="doc-${key}">${head}<div class="file-row">${icon('file')}<div><strong>${esc(v)}</strong><div class="small muted">Arquivo enviado</div></div><span class="spacer"></span><button class="btn btn-ghost" data-action="clear-insc-doc" data-doc="${key}">Remover<span class="sr-only"> ${label}</span></button></div></div>`;
  }
  return `<div class="field" id="doc-${key}">${head}
    ${dropzone(`insc-${key}`)}
    <div class="row" style="margin-top:var(--sp-3)"><button class="btn btn-secondary" data-action="reuse-none">${icon('folder')} Usar de Meus documentos</button></div>
    <p class="field-hint">${info.conteudo}</p></div>`;
}

function dropzone(target, tall) {
  return `<div class="dropzone${tall ? ' tall' : ''}" data-drop="${target}">
    ${icon('upload', 'big')}
    <p style="margin:8px 0 4px"><strong>Arraste o arquivo para cá</strong> ou</p>
    <label class="btn btn-secondary" for="file-${target}">Escolher arquivo</label>
    <input type="file" id="file-${target}" class="sr-only" data-file="${target}" accept=".pdf,.jpg,.jpeg,.png">
    <p class="small muted" data-file-error="${target}" role="alert" style="margin:8px 0 0"></p></div>`;
}

const inscBand = (title, sub, last) => band({ kicker: 'Behring Scholars 2027 · Inscrição', title, sub,
  crumbs: [['Programas', '#/programas'], ['Behring Scholars 2027', '#/programas/scholars'], [last]] });

function screenInscricao(n) {
  if (state.insc.status !== 'andamento') {
    return layout('programas', `<div class="card"><p>Sua inscrição no Behring Scholars 2027 já foi enviada (protocolo ${state.insc.protocolo}).</p><a class="btn btn-primary" href="#/processo/scholars">Acompanhar processo</a></div>`,
      band({ title: 'Inscrição enviada', crumbs: [['Início', '#/inicio'], ['Inscrição']] }));
  }
  n = Number(n) || 1;
  state.insc.etapa = n; save();
  const f = state.insc.f;
  let body;
  if (n === 1) body = `
    ${field({ id: 'nome', label: 'Nome completo', value: f.nome, profile: true })}
    <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:var(--sp-4)">${field({ id: 'nascimento', label: 'Data de nascimento', value: f.nascimento, profile: true })}${field({ id: 'cpf', label: 'CPF', value: f.cpf, profile: true })}</div>
    <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:var(--sp-4)">${field({ id: 'email', label: 'E-mail', value: f.email, profile: true, type: 'email' })}${field({ id: 'telefone', label: 'Celular', value: f.telefone, profile: true })}</div>`;
  if (n === 2) body = `
    ${field({ id: 'instituicao', label: 'Instituição de ensino superior', value: f.instituicao, profile: true })}
    <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:var(--sp-4)">${field({ id: 'curso', label: 'Curso', value: f.curso, profile: true })}${field({ id: 'periodo', label: 'Período atual', value: f.periodo, profile: true })}</div>
    <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:var(--sp-4)">${field({ id: 'conclusaoEM', label: 'Conclusão do ensino médio', value: f.conclusaoEM, profile: true })}${field({ id: 'media', label: 'Média geral do ensino médio', value: f.media, helpKey: 'media', hint: 'Use vírgula. Exemplo: 8,5' })}</div>`;
  if (n === 3) body = `
    <div class="grid-2" style="grid-template-columns:1fr 1fr;gap:var(--sp-4)">
      ${field({ id: 'rendaFaixa', label: 'Renda familiar mensal', value: f.rendaFaixa, helpKey: 'renda', options: ['Até 1 salário mínimo', 'De 1 a 3 salários mínimos', 'De 3 a 5 salários mínimos', 'Mais de 5 salários mínimos'] })}
      ${field({ id: 'pessoas', label: 'Quantas pessoas moram com você?', value: f.pessoas, type: 'number', hint: 'Inclua você na contagem.' })}</div>
    ${field({ id: 'motivacao', label: 'Por que você quer ser bolsista do Behring Scholars?', value: f.motivacao, textarea: true, hint: 'Até 1.500 caracteres. Fale sobre seus objetivos na graduação.' })}`;
  if (n === 4) body = `
    <div class="row" style="margin-bottom:var(--sp-4)"><span class="muted">Os documentos que você já enviou em outros programas podem ser reaproveitados.</span>${help('comprobatoria')}</div>
    ${docSlot('identidade', 'Documento de identidade')}
    ${docSlot('historico', 'Histórico escolar do ensino médio')}
    ${docSlot('renda', 'Comprovante de renda familiar')}`;
  const next = n < 4 ? `#/inscricao/${n + 1}` : '#/inscricao/revisao';
  return layout('programas', `
    <div class="grid-sidebar">
      ${inscSidebar(n)}
      <section class="card" aria-labelledby="form-t">
        <h2 id="form-t" style="font-size:var(--fs-l)">${ETAPAS[n - 1]}</h2>
        ${n === 1 || n === 2 ? `<p class="muted">Os campos marcados como <span class="tag-profile">do seu perfil</span> já vieram preenchidos. Confira e altere se precisar.</p>` : ''}
        <form novalidate onsubmit="return false">${body}</form>
        <div class="row" style="justify-content:flex-end;margin-top:var(--sp-5)">
          ${n > 1 ? `<a class="btn btn-secondary" href="#/inscricao/${n - 1}">${icon('left')} Voltar</a>` : ''}
          <a class="btn btn-primary" href="${next}">${n < 4 ? 'Continuar' : 'Revisar inscrição'} ${icon('right')}</a>
        </div>
      </section>
    </div>`, inscBand(`Etapa ${n} de 4: ${ETAPAS[n - 1]}`, 'Seu progresso é salvo automaticamente a cada campo.', 'Inscrição'));
}

function screenRevisao() {
  if (state.insc.status !== 'andamento') return screenInscricao(1);
  const pend = inscPendencias();
  const items = ETAPAS.map((e, i) => {
    const p = pend.filter(x => x.etapa === i + 1);
    return p.length
      ? `<li class="card tone-fix" style="list-style:none"><div class="row"><h3 style="margin:0;font-size:var(--fs-m)">${i + 1}. ${e}</h3><span class="spacer"></span>${status('fix', `Falta ${p.length}`)}</div>
          <ul style="margin:8px 0 12px">${p.map(x => `<li>${x.texto}</li>`).join('')}</ul>
          <a class="btn btn-danger" href="#/inscricao/${i + 1}" data-focus="${p[0].campo}">Resolver<span class="sr-only">: ${e}</span></a></li>`
      : `<li class="card" style="list-style:none"><div class="row"><h3 style="margin:0;font-size:var(--fs-m)">${i + 1}. ${e}</h3><span class="spacer"></span>${status('done', 'Completo')}<a class="btn btn-ghost" href="#/inscricao/${i + 1}">${icon('edit')} Editar<span class="sr-only">: ${e}</span></a></div></li>`;
  }).join('');
  const blocked = pend.length > 0;
  return layout('programas', `
    <div class="grid-sidebar">
      ${inscSidebar('revisao')}
      <section aria-label="Resumo da inscrição">
        <ul style="padding:0;margin:0">${items}</ul>
        <div class="card" style="margin-top:var(--sp-4)">
          ${blocked ? `<p class="small" id="block-msg" style="color:var(--fix);font-weight:700">${icon('info')} O envio é liberado quando não houver pendências (${pend.length} restante${pend.length > 1 ? 's' : ''}).</p>` : `<p class="small" style="color:var(--done);font-weight:700">${icon('check')} Tudo pronto para o envio.</p>`}
          <button class="btn btn-primary" data-action="submit-insc" ${blocked ? 'aria-disabled="true" aria-describedby="block-msg"' : ''}>Enviar inscrição</button>
        </div>
      </section>
    </div>`, inscBand('Revisar antes de enviar', 'Confira as informações. Depois do envio, você acompanha a análise pelo portal.', 'Revisão'));
}

function screenConfirmacao() {
  const spot = `<div class="spot ok"><div class="kick">${icon('check')} Inscrição recebida</div><h2 class="row" style="gap:8px">Protocolo ${state.insc.protocolo} ${help('protocolo')}</h2><p>Guarde este número caso precise falar com a Fundação.</p></div>`;
  const head = `<section class="band hero on-dark">${BARS}<div class="band-inner"><div><div class="kicker">Behring Scholars 2027</div><h1 tabindex="-1">Inscrição enviada!</h1><p>Recebemos sua inscrição. Agora a Fundação confere seus documentos.</p></div>${spot}</div></section>`;
  return layout('inicio', panel('O que acontece agora', `<div class="panel-body">
      ${trail(SCHOLARS_STEPS(), 1)}
      <ul class="list elig" style="margin-top:var(--sp-5)">
        <li class="info"><span class="mark">${icon('hourglass')}</span><div><strong>Análise documental até 20/11/2026</strong><div class="small muted">A Fundação confere seus documentos. Nenhuma ação necessária por enquanto.</div></div></li>
        <li class="info"><span class="mark">${icon('bell')}</span><div><strong>Você será avisada por e-mail e no portal</strong><div class="small muted">Se algum documento precisar de correção, ele aparecerá no Início com o motivo.</div></div></li></ul>
      <div class="row" style="margin-top:var(--sp-4)"><a class="btn btn-primary" href="#/processo/scholars">Acompanhar processo</a><a class="btn btn-secondary" href="#/inicio">Voltar ao início</a></div></div>`, { id: 'nx-t' }), head);
}

function screenProcesso() {
  const stage = processStage();
  const fix = Object.entries(state.docs).find(([, d]) => d.status === 'fix');
  const todo = tasks().filter(t => !t.urgent);
  let changes, resume;
  if (state.scenario === 'correcao') {
    changes = `<li class="ok"><span class="mark">${icon('check')}</span><div><strong>Histórico escolar aprovado</strong><div class="small muted">04/11/2026</div></div></li>
               <li class="${state.docs.renda.status === 'fix' ? 'bad' : 'ok'}"><span class="mark">${icon('alert')}</span><div><strong>Comprovante de renda voltou para correção</strong><div class="small muted">05/11/2026 · ${state.docs.renda.status === 'fix' ? 'pendente' : 'já corrigido'}</div></div></li>
               <li class="miss"><span class="mark">${icon('upload')}</span><div><strong>Novo documento pedido: comprovante de matrícula</strong><div class="small muted">04/11/2026</div></div></li>`;
  } else if (state.insc.status === 'andamento') {
    changes = `<li class="info"><span class="mark">${icon('info')}</span><div>Nada mudou no processo. Seu progresso na inscrição está salvo.</div></li>`;
  } else {
    changes = `<li class="ok"><span class="mark">${icon('check')}</span><div><strong>Documentos recebidos</strong><div class="small muted">Comprovantes de renda e de matrícula em análise</div></div></li>`;
  }
  if (fix) resume = { txt: 'Corrigir comprovante de renda', sub: `Prazo ${prazoText(fix[1].prazo)}`, href: `#/documentos/corrigir/${fix[0]}`, btn: 'Revisar' };
  else if (state.insc.status === 'andamento') resume = { txt: `Etapa ${state.insc.etapa} da inscrição — ${ETAPAS[state.insc.etapa - 1]}`, sub: 'Último salvamento às ' + state.insc.savedAt, href: `#/inscricao/${state.insc.etapa}`, btn: 'Continuar' };
  else if (todo.length) resume = { txt: todo[0].titulo, sub: prazoText(todo[0].prazo), href: todo[0].href, btn: todo[0].acao };

  const statusAtual = state.insc.status === 'bolsa' ? ['Candidatura aprovada', 'Sua bolsa está ativa. As entregas periódicas ficam na área da bolsa.', 'done', 'Bolsa ativa']
    : state.insc.status === 'andamento' ? ['Inscrição em andamento', 'Complete as 4 etapas e envie a inscrição até 15/11/2026.', 'todo', 'Para fazer']
    : fix ? ['Análise documental — ação necessária', 'A Fundação está conferindo seus documentos e pediu a correção do comprovante de renda. Os outros documentos seguem em análise.', 'fix', 'Corrigir']
    : todo.length ? ['Análise documental — ação necessária', 'Envie os documentos pedidos para que a análise continue.', 'todo', 'Para fazer']
    : ['Aguardando a Fundação — nenhuma ação necessária', 'A Fundação está analisando seus documentos. Ao final desta etapa, pode ser necessário corrigir alguma informação. Você será avisada.', 'wait', 'Em análise'];

  const content = `
    ${panel('Etapas do processo', `<div class="panel-body">${trail(SCHOLARS_STEPS(), stage, { attention: !!fix, flag: fix ? '1 correção' : '' })}</div>`, { id: 'tl-t' })}
    <div class="grid-2 section"><div>
      ${panel(`Desde a sua última visita (${state.lastVisit})`, `<div class="panel-body"><ul class="list elig">${changes}</ul></div>`, { id: 'ch-t' })}
      ${resume ? `<section class="card ${fix ? 'tone-fix' : ''}" aria-labelledby="rs-t" style="margin-top:var(--sp-5)">
        <h2 id="rs-t" style="font-size:var(--fs-m)">Você parou em</h2>
        <div class="row"><div style="flex:1"><strong>${resume.txt}</strong><div class="small muted">${resume.sub}</div></div><a class="btn ${fix ? 'btn-danger' : 'btn-primary'}" href="${resume.href}">${resume.btn}<span class="sr-only">: ${resume.txt}</span></a></div>
      </section>` : ''}
    </div><div>
      ${panel('Status atual', `<div class="panel-body">${status(statusAtual[2], statusAtual[3])}
        <p style="margin-top:var(--sp-3)"><strong>${statusAtual[0]}</strong></p><p>${statusAtual[1]}</p>
        <div class="row small"><span>O que é a análise documental?</span>${help('analise')}</div>
        <div class="row small" style="margin-top:8px"><span>E a triagem?</span>${help('triagem')}</div></div>`, { id: 'sa-t' })}
      ${panel('Atalhos', `<div class="panel-body">
        <a class="btn btn-secondary btn-block" href="#/documentos/scholars">${icon('folder')} Documentos do processo</a>
        <a class="btn btn-secondary btn-block" style="margin-top:var(--sp-3)" href="#/processo/scholars/historico">${icon('history')} Histórico</a>
        <a class="btn btn-ghost btn-block" style="margin-top:var(--sp-3)" href="#/processo/scholars" data-action="toast" data-msg="No protótipo, o canal de mensagens não está disponível.">${icon('message')} Dúvidas? Falar com a Fundação</a></div>`, { id: 'at-t' })}
    </div></div>`;
  return layout('inicio', content, band({ kicker: 'Behring Scholars 2027', title: 'Sua inscrição', sub: 'Veja o que mudou enquanto você esteve fora e o que vem a seguir.',
    crumbs: [['Início', '#/inicio'], ['Behring Scholars 2027']], extra: status(statusAtual[2], statusAtual[3]) }));
}

function screenHistorico() {
  const ev = [];
  const r = state.docs.renda;
  if (state.insc.status === 'bolsa') ev.push(['15/02/2027', 'Candidatura aprovada — bolsa ativa', '', 'done']);
  if (r.status === 'wait' && state.insc.status === 'enviada') ev.push([state.scenario === 'aguardando' ? '07/11/2026' : state.today, 'Correção enviada: comprovante de renda', r.arquivo, 'wait']);
  if (state.insc.status !== 'andamento') {
    ev.push(['05/11/2026', 'Correção solicitada: comprovante de renda', 'Motivo: a foto enviada está desfocada.', 'fix']);
    ev.push(['04/11/2026', 'Histórico escolar aprovado', 'Historico_escolar_EM.pdf', 'done']);
    ev.push(['04/11/2026', 'Documento pedido: comprovante de matrícula', 'Prazo: 20/11/2026', 'todo']);
    ev.push(['29/10/2026', 'Documento de identidade aprovado', 'RG_Kira_Almeida.pdf', 'done']);
    ev.push(['28/10/2026', 'Inscrição enviada', `Protocolo ${state.insc.protocolo}`, 'done']);
  }
  ev.push(['20/10/2026', 'Etapa 1 da inscrição concluída', 'Dados pessoais', 'done']);
  ev.push(['15/10/2026', 'Inscrição iniciada', 'Behring Scholars 2027', 'done']);
  const label = { done: 'Concluído', fix: 'Corrigir', todo: 'Pedido', wait: 'Em análise' };
  const side = state.insc.status === 'bolsa' ? `${status('done', 'Bolsa ativa')}<p style="margin-top:var(--sp-3)">Sua candidatura foi aprovada. As entregas da bolsa estão na área da bolsa.</p>`
    : hasFix() ? `${status('fix', 'Corrigir')}<p style="margin-top:var(--sp-3)">Corrija o comprovante de renda até 13/11/2026 para continuar na análise documental.</p><a class="btn btn-danger" href="#/documentos/corrigir/renda">Resolver</a>`
    : `${status('wait', 'Em análise')}<p style="margin-top:var(--sp-3)">A Fundação está analisando os documentos para verificar se estão de acordo com o edital.</p><p><strong>Previsão: 20/11/2026</strong></p>`;
  return layout('inicio', `<div class="grid-2">
      ${panel('Eventos', `<div class="panel-body"><ol class="list">${ev.map(([d, t, s, k]) => `<li style="align-items:flex-start"><strong style="min-width:96px;color:var(--ink)">${d}</strong><div style="flex:1"><strong>${t}</strong>${s ? `<div class="small muted">${s}</div>` : ''}</div>${status(k, label[k])}</li>`).join('')}</ol></div>`, { count: ev.length, id: 'ev-t' })}
      <div>${panel('Status atual', `<div class="panel-body">${side}</div>`, { id: 'sh-t' })}</div></div>`,
    band({ kicker: 'Behring Scholars 2027', title: 'Histórico da candidatura', sub: 'Tudo o que aconteceu no seu processo, do mais recente ao mais antigo.', crumbs: [['Início', '#/inicio'], ['Behring Scholars 2027', '#/processo/scholars'], ['Histórico']] }));
}

let docFilter = 'todos';
function screenDocumentos(scope) {
  const rows = Object.entries(state.docs).filter(([, d]) => d.status)
    .filter(([, d]) => scope !== 'scholars' || d.usado.includes('Scholars 2027'))
    .filter(([, d]) => docFilter === 'todos' || (docFilter === 'pendentes' && (d.status === 'fix' || (d.status === 'todo' && !d.expiring))) || (docFilter === 'vencendo' && d.expiring));
  const action = (id, d) => {
    if (d.status === 'fix') return `<a class="btn btn-danger" href="#/documentos/corrigir/${id}">Corrigir<span class="sr-only"> ${DOC_INFO[id].nome}</span></a>`;
    if (d.status === 'todo' && state.insc.status === 'andamento' && id === 'renda') return `<a class="btn btn-primary" href="#/inscricao/4">Enviar na inscrição</a>`;
    if (d.status === 'todo') return `<a class="btn btn-primary" href="#/documentos/enviar/${id}">${d.expiring ? 'Atualizar' : 'Enviar'}<span class="sr-only"> ${DOC_INFO[id].nome}</span></a>`;
    return `<button class="btn btn-ghost" data-action="toast" data-msg="Pré-visualização de ${d.arquivo} (simulada no protótipo).">${icon('eye')} Ver<span class="sr-only"> ${DOC_INFO[id].nome}</span></button>`;
  };
  const count = f => Object.values(state.docs).filter(d => d.status && (f === 'pendentes' ? (d.status === 'fix' || (d.status === 'todo' && !d.expiring)) : d.expiring)).length;
  const chip = (f, l) => `<button class="chip" data-action="filter" data-f="${f}" aria-pressed="${docFilter === f}">${l}</button>`;
  const content = `
    <div class="filters" role="group" aria-label="Filtrar documentos">${chip('todos', 'Todos')}${chip('pendentes', `Pendentes (${count('pendentes')})`)}${chip('vencendo', `Vencendo (${count('vencendo')})`)}</div>
    <section class="panel" aria-label="Lista de documentos">
      ${rows.length ? `<table class="doc-table"><caption class="sr-only">Seus documentos</caption>
        <thead><tr><th scope="col">Documento</th><th scope="col">Usado em</th><th scope="col">Estado</th><th scope="col">Ação</th></tr></thead>
        <tbody>${rows.map(([id, d]) => `<tr class="${d.status === 'fix' ? 'row-fix' : ''}">
          <td><span class="doc-name">${DOC_INFO[id].nome}</span><span class="small muted">${d.arquivo || DOC_INFO[id].formato + ', até ' + DOC_INFO[id].max + ' MB'}</span></td>
          <td data-label="Usado em">${d.usado.join(', ')}</td>
          <td data-label="Estado">${status(d.status, d.label)}<div class="small" style="margin-top:6px">${d.motivo ? `<strong style="color:var(--fix)">Motivo:</strong> ${d.motivo}<br>` : ''}${d.prazo ? `Prazo: ${prazoText(d.prazo)}` : d.previsao ? `Resposta prevista até ${d.previsao}` : d.data || ''}</div></td>
          <td>${action(id, d)}</td></tr>`).join('')}</tbody></table>`
        : `<div class="panel-empty">${icon('check', 'ico-l')} Nenhum documento neste filtro.</div>`}
    </section>
    <p class="small muted" style="margin-top:var(--sp-3)">Formatos aceitos: PDF, JPG ou PNG, até 5 MB por arquivo.</p>`;
  return layout('documentos', content, band({
    title: scope === 'scholars' ? 'Documentos do processo' : 'Meus documentos', kicker: scope === 'scholars' ? 'Behring Scholars 2027' : '',
    sub: 'Envie uma vez e use em vários programas.', crumbs: scope === 'scholars' ? [['Início', '#/inicio'], ['Behring Scholars 2027', '#/processo/scholars'], ['Documentos']] : null,
    extra: `<a class="btn btn-secondary" href="#/documentos/enviar/novo">${icon('upload')} Enviar novo documento</a>` }));
}

function screenEnviar(id) {
  const isNew = id === 'novo';
  const info = DOC_INFO[id] || { nome: 'Novo documento', formato: 'PDF, JPG ou PNG', max: 5, conteudo: 'Escolha o tipo de documento e envie um arquivo legível.' };
  const d = state.docs[id] || {};
  const pick = state.pendingFile?.target === `send-${id}` ? state.pendingFile : null;
  const title = isNew ? 'Enviar novo documento' : d.expiring ? `Atualizar ${info.nome.toLowerCase()}` : `Enviar ${info.nome.toLowerCase()}`;
  // Instruções à esquerda e envio à direita: a ordem visual é a mesma do DOM (ler, depois enviar).
  const reqs = panel('Antes de enviar, confira', `<div class="panel-body"><ul class="list elig">
      <li class="info"><span class="mark">${icon('file')}</span><div><strong>Formato aceito</strong><div class="small muted">${info.formato}</div></div></li>
      <li class="info"><span class="mark">${icon('upload')}</span><div><strong>Tamanho máximo</strong><div class="small muted">${info.max} MB por arquivo</div></div></li>
      <li class="info"><span class="mark">${icon('eye')}</span><div><strong>O que deve aparecer</strong><div class="small muted">${info.conteudo}</div></div></li>
      ${d.prazo ? `<li class="miss"><span class="mark">${icon('calendar')}</span><div><strong>Prazo</strong><div class="small muted">${prazoText(d.prazo)}</div></div></li>` : ''}</ul></div>`, { id: 'rq-t' });
  const usedIn = d.usado ? panel('Onde este documento é usado', `<div class="panel-body"><ul class="list">${d.usado.map(u => `<li>${icon('grid')}<span>Behring ${u}</span></li>`).join('')}</ul>
      <p class="small muted" style="margin:var(--sp-3) 0 0">Ao enviar uma nova versão, ela passa a valer para todos esses programas.</p></div>`, { id: 'us-t' }) : '';
  return layout('documentos', `
    <div class="grid-split"><div>${reqs}${usedIn}</div>
      ${panel('Enviar arquivo', `<div class="panel-body">
        ${isNew ? `<div class="field"><div class="field-label"><label for="tipo">Tipo de documento</label></div><select id="tipo"><option>Comprovante de residência</option><option>Certificado de curso</option><option>Outro</option></select></div>` : ''}
        ${pick ? fileRow(pick, `send-${id}`) : dropzone(`send-${id}`, true)}
        <div class="row" style="justify-content:flex-end;margin-top:var(--sp-5)">
          <a class="btn btn-secondary" href="#/documentos">Cancelar</a>
          <button class="btn btn-primary" data-action="send-doc" data-doc="${id}" ${pick ? '' : 'aria-disabled="true" aria-describedby="send-hint"'}>${icon('upload')} Enviar</button>
        </div>
        ${pick ? '' : '<p class="small muted" id="send-hint" style="text-align:right;margin:8px 0 0">Escolha um arquivo para liberar o envio.</p>'}</div>`, { id: 'up-t' })}
    </div>`, band({ title, sub: d.usado ? `Usado em: ${d.usado.join(', ')}` : 'O documento ficará disponível para todos os programas.', crumbs: [['Meus documentos', '#/documentos'], [title]] }));
}

const fileRow = (f, target) => `<div class="file-row">${icon('file')}<div><strong>${esc(f.name)}</strong><div class="small muted">${f.size} · pronto para enviar</div></div><span class="spacer"></span><button class="btn btn-ghost" data-action="clear-file" data-target="${target}">Trocar arquivo</button></div>`;

function screenCorrigir(id) {
  const d = state.docs[id], info = DOC_INFO[id];
  if (!d || d.status !== 'fix') {
    return layout('documentos', `<div class="card"><p>Este documento não tem correção solicitada no momento.</p><a class="btn btn-primary" href="#/inicio">Voltar ao início</a></div>`,
      band({ title: 'Nenhuma correção pendente', crumbs: [['Meus documentos', '#/documentos'], ['Correção']] }));
  }
  const pick = state.pendingFile?.target === `fix-${id}` ? state.pendingFile : null;
  return layout('documentos', `
    <section class="alert-banner" aria-labelledby="fix-t">${icon('alert', 'ico-l')}<div class="txt">
      <strong id="fix-t">Correção solicitada pela Fundação — ${prazoText(d.prazo)}</strong>
      <p><strong>Motivo:</strong> ${d.motivo}</p></div></section>
    <div class="grid-split"><div>
      ${panel('Como corrigir', `<div class="panel-body"><ul class="list elig">
        <li class="info"><span class="mark">${icon('file')}</span><div><strong>PDF ou foto nítida</strong><div class="small muted">Sem reflexos, sombras ou cortes nas bordas</div></div></li>
        <li class="info"><span class="mark">${icon('upload')}</span><div><strong>Até ${info.max} MB</strong><div class="small muted">Se o PDF estiver maior, divida em partes ou comprima</div></div></li>
        <li class="info"><span class="mark">${icon('eye')}</span><div><strong>Nomes e valores visíveis</strong><div class="small muted">Todas as páginas, de todos os moradores da casa</div></div></li></ul></div>`, { id: 'cc-t' })}
      ${panel('Arquivo anterior', `<div class="panel-body"><div class="file-row">${icon('file')}<div><strong>${d.arquivo}</strong><div class="small muted">Enviado em 28/10/2026 · recusado</div></div><span class="spacer"></span>${status('fix', 'Corrigir')}</div></div>`, { id: 'aa-t' })}
    </div>
      ${panel('Enviar o novo arquivo', `<div class="panel-body">
        ${pick ? fileRow(pick, `fix-${id}`) : dropzone(`fix-${id}`, true)}
        <div class="row" style="justify-content:flex-end;margin-top:var(--sp-5)">
          <a class="btn btn-secondary" href="#/inicio">Cancelar</a>
          <button class="btn btn-primary" data-action="send-fix" data-doc="${id}" ${pick ? '' : 'aria-disabled="true" aria-describedby="fix-hint"'}>${icon('upload')} Enviar correção</button>
        </div>
        ${pick ? '' : '<p class="small muted" id="fix-hint" style="text-align:right;margin:8px 0 0">Escolha um arquivo para liberar o envio.</p>'}</div>`, { id: 'up-t' })}
    </div>`, band({ kicker: 'Behring Scholars 2027', title: 'Corrigir documento', sub: info.nome, crumbs: [['Início', '#/inicio'], ['Corrigir documento']] }));
}

function screenAvisos() {
  const n = notices();
  return layout('avisos', n.map(x => {
    const unread = !state.readNotices.includes(x.id);
    return `<article class="card notice-item ${unread ? 'unread' : ''}">${icon(x.icon, 'ico-l')}<div><h2 style="font-size:var(--fs-m);margin:0">${x.titulo}</h2><p style="margin:4px 0 0">${x.texto}</p></div>
      <div class="small muted" style="text-align:right">${x.data}${unread ? '<br><span class="dot-unread" aria-hidden="true"></span><span class="sr-only">não lido</span>' : ''}</div></article>`;
  }).join(''), band({ title: 'Avisos', sub: `Os avisos também são enviados para ${USER.email}, mas ficam guardados aqui.`,
    extra: `<button class="btn btn-secondary" data-action="read-all">${icon('check')} Marcar todos como lidos</button>` }));
}

function screenBolsa() {
  if (!state.entregas) {
    return layout('inicio', `<div class="card"><p>Quando uma candidatura for aprovada, a área da bolsa aparecerá aqui, com o histórico preservado.</p><p class="small muted">Dica do protótipo: escolha o cenário "Bolsa ativa" no painel do canto inferior.</p></div>`,
      band({ title: 'Você ainda não tem uma bolsa ativa', crumbs: [['Início', '#/inicio'], ['Bolsa']] }));
  }
  const e = state.entregas, done = e.filter(x => x.status === 'done').length;
  const rows = e.map(x => x.status === 'todo'
    ? taskRow({ tone: 'todo', icon: 'upload', titulo: x.nome, programa: 'Entrega periódica', prazo: x.prazo, acao: 'Enviar', href: '#/bolsa', detalhe: 'PDF emitido pela universidade' }).replace('href="#/bolsa"', 'href="#/bolsa" data-action="deliver" data-id="' + x.id + '"')
    : `<article class="task tone-${x.status === 'future' ? 'wait' : 'done'}"><span class="icon-badge">${icon(x.status === 'future' ? 'calendar' : 'check', 'ico-l')}</span><div><h3>${x.nome}</h3><div class="meta">${x.data}</div></div>${status(x.status, x.label)}</article>`).join('');
  return layout('inicio', `<div class="grid-2"><div>
      ${panel('Entregas de 2027', `<div class="panel-body"><div class="row" style="margin-bottom:8px"><strong>${done} de ${e.length} concluídas</strong></div>
        <div class="progress" role="img" aria-label="${done} de ${e.length} entregas concluídas" style="margin-bottom:var(--sp-5)"><span style="width:${done / e.length * 100}%"></span></div>${rows}</div>`, { id: 'ent-t' })}
    </div><div>
      ${panel('Sua bolsa', `<div class="panel-body"><ul class="list"><li><strong>Vigência</strong><span class="spacer"></span>2027–2030</li><li><strong>Próxima entrega</strong><span class="spacer"></span>31/08/2027</li><li><strong>Curso</strong><span class="spacer"></span>Ciência da Computação</li></ul></div>`, { id: 'sb-t' })}
      ${panel('Atalhos', `<div class="panel-body"><a class="btn btn-secondary btn-block" href="#/processo/scholars/historico">${icon('history')} Histórico da candidatura</a>
        <a class="btn btn-ghost btn-block" style="margin-top:var(--sp-3)" href="#/bolsa" data-action="toast" data-msg="No protótipo, o canal de mensagens não está disponível.">${icon('message')} Dúvidas? Falar com a Fundação</a></div>`, { id: 'ab-t' })}
    </div></div>`, band({ kicker: 'Behring Scholars', title: 'Bolsa ativa', sub: 'Candidatura aprovada em 15/02/2027 · Universidade de São Paulo', crumbs: [['Início', '#/inicio'], ['Bolsa ativa']], extra: status('done', 'Bolsa ativa') }));
}

function screenPerfil() {
  const f = state.insc.f;
  const ro = (l, v) => `<li><div><div class="small muted">${l}</div><strong>${v}</strong></div></li>`;
  const edit = `<button class="btn btn-ghost" data-action="toast" data-msg="Edição simulada: suas alterações seriam salvas automaticamente.">${icon('edit')} Editar</button>`;
  return layout('perfil', `<div class="grid-2" style="grid-template-columns:1fr 1fr">
      <div>${panel('Dados pessoais', `<div class="panel-body"><div class="row" style="justify-content:flex-end">${edit}</div><ul class="list">${ro('Nome completo', f.nome)}${ro('Data de nascimento', f.nascimento)}${ro('CPF', f.cpf)}${ro('E-mail', f.email)}${ro('Celular', f.telefone)}</ul></div>`, { id: 'dp-t' })}
        ${panel('Como você quer ser avisada', `<div class="panel-body">
          <label class="row" style="min-height:44px"><input type="checkbox" checked disabled style="width:22px;height:22px"> No portal (sempre ativo)</label>
          <label class="row" style="min-height:44px"><input type="checkbox" checked style="width:22px;height:22px"> Por e-mail</label>
          <label class="row" style="min-height:44px"><input type="checkbox" style="width:22px;height:22px"> Por SMS</label></div>`, { id: 'nt-t' })}</div>
      <div>${panel('Dados escolares', `<div class="panel-body"><div class="row" style="justify-content:flex-end">${edit}</div><ul class="list">${ro('Instituição', f.instituicao)}${ro('Curso', f.curso)}${ro('Período atual', f.periodo)}${ro('Conclusão do ensino médio', f.conclusaoEM)}${ro('Renda familiar', f.rendaFaixa || '<span style="color:var(--todo)">Não informada</span>')}</ul></div>`, { id: 'de-t' })}
        ${panel('Acesso', `<div class="panel-body row"><button class="btn btn-secondary" data-action="toast" data-msg="Enviamos um link para redefinir sua senha.">Alterar senha</button>
          <button class="btn btn-ghost" data-action="logout">${icon('logout')} Sair</button></div>`, { id: 'ac-t' })}</div>
    </div>`, band({ title: USER.nome, sub: 'Seus dados são usados para preencher automaticamente as inscrições.', kicker: 'Seu perfil' }));
}

function screenLogin() {
  return `<div class="auth-wrap">
    <section class="auth-side on-dark">${BARS}<img src="assets/logo-fundacao-behring-branco.png" alt="Fundação Behring">
      <h1>Portal do Aluno &amp; Candidato</h1><p>Inscrições, documentos e acompanhamento dos programas da Fundação Behring em um só lugar.</p></section>
    <main class="auth-form" id="conteudo" tabindex="-1"><div class="card">
      <h2>Entrar</h2>
      <form data-action-form="login" novalidate>
        <div class="field"><div class="field-label"><label for="lg-email">E-mail</label></div><input id="lg-email" type="email" autocomplete="email" value="${USER.email}"></div>
        <div class="field"><div class="field-label"><label for="lg-pass">Senha</label></div><input id="lg-pass" type="password" autocomplete="current-password" value="behring2027"></div>
        <button class="btn btn-primary btn-block" type="submit">Entrar</button>
      </form>
      <div class="row" style="justify-content:space-between;margin-top:var(--sp-4)"><a href="#/login" data-action="toast" data-msg="Enviamos um link de recuperação para o seu e-mail.">Esqueci minha senha</a><a href="#/login" data-action="toast" data-msg="No protótipo, use a conta de exemplo.">Criar conta</a></div>
    </div></main></div>${protoPanel()}`;
}

function screenNotFound() {
  return layout('', `<div class="card"><a class="btn btn-primary" href="#/inicio">Ir para o início</a></div>`, band({ title: 'Página não encontrada' }));
}

/* ------------------------------------------------------------------ */
/* Roteador                                                            */
/* ------------------------------------------------------------------ */
const TITLES = { inicio: 'Início', programas: 'Programas', documentos: 'Documentos', avisos: 'Avisos', perfil: 'Perfil', inscricao: 'Inscrição', processo: 'Processo', bolsa: 'Bolsa', login: 'Entrar' };
function route() {
  // A rota vem do hash (#/inicio). Nas capturas para o Figma o hash é usado pelo script de captura,
  // então a rota pode vir também por ?route=inicio.
  const qRoute = new URLSearchParams(location.search).get('route');
  const hash = location.hash.startsWith('#/') ? location.hash.slice(2) : qRoute || 'inicio';
  const [a, b, c] = hash.split('/');
  if (!state.logged && a !== 'login') { location.hash = '#/login'; return; }
  let html;
  switch (a) {
    case 'login': html = screenLogin(); break;
    case 'inicio': html = screenInicio(); break;
    case 'programas': html = b ? screenPrograma(b) : screenProgramas(); break;
    case 'inscricao': html = b === 'revisao' ? screenRevisao() : b === 'confirmacao' ? screenConfirmacao() : screenInscricao(b); break;
    case 'processo': html = c === 'historico' ? screenHistorico() : screenProcesso(); break;
    case 'documentos': html = b === 'enviar' ? screenEnviar(c) : b === 'corrigir' ? screenCorrigir(c) : screenDocumentos(b); break;
    case 'avisos': html = screenAvisos(); break;
    case 'bolsa': html = screenBolsa(); break;
    case 'perfil': html = screenPerfil(); break;
    default: html = screenNotFound();
  }
  document.getElementById('app').innerHTML = html;
  document.title = `${TITLES[a] || 'Portal'} — Portal Behring`;
  // Páginas de um programa específico assumem a cor dele no cabeçalho e na faixa de título.
  const theme = a === 'programas' && (b === 'academy' || b === 'founders') ? b : '';
  document.body.classList.toggle('theme-academy', theme === 'academy');
  document.body.classList.toggle('theme-founders', theme === 'founders');
  updateHeader();
  if (a === 'avisos') { state.readNotices = notices().map(n => n.id); save(); }
  const h1 = document.querySelector('main h1, main h2');
  if (!route.first && h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  route.first = false;
  if (state.focusField) { document.getElementById(state.focusField)?.focus(); state.focusField = null; }
}
route.first = true;

/* Cabeçalho: funde-se à faixa colorida no topo e vira um cartão branco flutuante ao rolar,
   como em fundacaobehring.org. A classe on-dark troca o contorno de foco para branco. */
function updateHeader() {
  const bar = document.querySelector('.topbar');
  if (!bar) return;
  const scrolled = window.scrollY > 24;
  bar.classList.toggle('is-scrolled', scrolled);
  bar.classList.toggle('on-dark', !scrolled);
}
window.addEventListener('scroll', updateHeader, { passive: true });

/* ------------------------------------------------------------------ */
/* Interações                                                          */
/* ------------------------------------------------------------------ */
function toast(msg) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = `${icon('check')}<span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}
const now = () => new Date().toTimeString().slice(0, 5);
const fmtSize = b => b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

function acceptFile(target, file) {
  const err = document.querySelector(`[data-file-error="${target}"]`);
  const ok = /\.(pdf|jpe?g|png)$/i.test(file.name);
  if (!ok) { err.innerHTML = `<strong style="color:var(--fix-fg)">Formato não aceito (${esc(file.name.split('.').pop())}).</strong> Envie um arquivo PDF, JPG ou PNG.`; return; }
  if (file.size > 5 * 1024 * 1024) { err.innerHTML = `<strong style="color:var(--fix-fg)">Arquivo muito grande (${fmtSize(file.size)}).</strong> O limite é 5 MB. Tente comprimir o PDF ou tirar uma nova foto.`; return; }
  if (target.startsWith('insc-')) {
    state.insc.docs[target.slice(5)] = file.name; state.insc.savedAt = now(); save(); route();
    toast(`${file.name} salvo na inscrição.`);
  } else {
    state.pendingFile = { target, name: file.name, size: fmtSize(file.size) }; save(); route();
  }
}

document.addEventListener('click', e => {
  const skip = e.target.closest('.skip-link');
  if (skip) { e.preventDefault(); document.getElementById('conteudo')?.focus(); return; }

  const helpBtn = e.target.closest('[data-help]');
  if (helpBtn) {
    const pop = document.getElementById(helpBtn.dataset.help);
    const open = !pop.classList.contains('open');
    pop.classList.toggle('open', open); helpBtn.setAttribute('aria-expanded', open);
    return;
  }
  const el = e.target.closest('[data-action]');
  if (!el) {
    const focusLink = e.target.closest('[data-focus]');
    if (focusLink) state.focusField = focusLink.dataset.focus;
    return;
  }
  const act = el.dataset.action;
  if (el.getAttribute('aria-disabled') === 'true') { e.preventDefault(); toast(act === 'submit-insc' ? 'Resolva as pendências destacadas para liberar o envio.' : 'Escolha um arquivo primeiro.'); return; }
  switch (act) {
    case 'toast': e.preventDefault(); toast(el.dataset.msg); break;
    case 'scenario': state = scenarioState(el.dataset.s); save(); location.hash = '#/inicio'; route(); toast(`Cenário: ${SCENARIOS[el.dataset.s]}`); break;
    case 'logout': state.logged = false; save(); location.hash = '#/login'; break;
    case 'filter': docFilter = el.dataset.f; route(); break;
    case 'read-all': state.readNotices = notices().map(n => n.id); save(); route(); toast('Todos os avisos foram marcados como lidos.'); break;
    case 'pause': save(); location.hash = '#/inicio'; setTimeout(() => toast(`Progresso salvo às ${state.insc.savedAt}. Continue de onde parou quando quiser.`), 50); break;
    case 'reuse-none': toast('Você ainda não tem um comprovante de renda em Meus documentos. Envie um novo arquivo.'); break;
    case 'clear-insc-doc': state.insc.docs[el.dataset.doc] = null; save(); route(); break;
    case 'clear-file': state.pendingFile = null; save(); route(); break;
    case 'submit-insc':
      state.insc.status = 'enviada'; state.justSubmitted = true; state.insc.enviadaEm = state.today;
      state.docs.renda = { status: 'wait', label: 'Em análise', arquivo: state.insc.docs.renda, usado: ['Scholars 2027'], previsao: '20/11/2026', data: `Enviado em ${state.today}` };
      state.docs.historico.usado = ['Academy 2024', 'Scholars 2027']; state.docs.identidade.usado = ['Academy 2024', 'Scholars 2027'];
      save(); location.hash = '#/inscricao/confirmacao'; break;
    case 'send-fix': {
      const id = el.dataset.doc;
      state.docs[id] = { ...state.docs[id], status: 'wait', label: 'Em análise', arquivo: state.pendingFile.name, previsao: '20/11/2026', data: `Enviado em ${state.today}`, motivo: null, prazo: null };
      state.pendingFile = null; save(); location.hash = '#/inicio';
      setTimeout(() => toast('Correção enviada. A Fundação vai analisar até 20/11/2026.'), 50); break;
    }
    case 'send-doc': {
      const id = el.dataset.doc;
      if (state.docs[id]) state.docs[id] = { ...state.docs[id], status: state.docs[id].expiring ? 'done' : 'wait', label: state.docs[id].expiring ? 'Válido' : 'Em análise', expiring: false, arquivo: state.pendingFile.name, previsao: '20/11/2026', data: `Enviado em ${state.today}`, prazo: null };
      state.pendingFile = null; save(); location.hash = '#/documentos';
      setTimeout(() => toast('Documento enviado. Você acompanha o estado em Meus documentos.'), 50); break;
    }
    case 'deliver': {
      e.preventDefault();
      const it = state.entregas.find(x => x.id === el.dataset.id);
      Object.assign(it, { status: 'done', label: 'Enviado', data: `Entregue em ${state.today}` });
      save(); route(); toast('Entrega enviada. Ela aparece como concluída no seu progresso.'); break;
    }
  }
});

document.addEventListener('submit', e => {
  if (e.target.dataset.actionForm === 'login') { e.preventDefault(); state.logged = true; save(); location.hash = '#/inicio'; }
});

document.addEventListener('input', e => {
  const k = e.target.dataset.field;
  if (!k) return;
  state.insc.f[k] = e.target.value; state.insc.savedAt = now(); save();
  const saved = document.querySelector('[data-saved]');
  if (saved) saved.textContent = `Salvo automaticamente às ${state.insc.savedAt}`;
  const tag = e.target.closest('.field')?.querySelector('.field-state');
  if (tag) {
    const filled = e.target.value.trim() !== '';
    tag.className = `field-state ${filled ? 'saved' : 'pending'}`;
    tag.innerHTML = `${icon(filled ? 'check' : 'clock')} ${filled ? 'Salvo' : 'Pendente'}`;
  }
});

document.addEventListener('change', e => {
  const t = e.target.dataset.file;
  if (t && e.target.files[0]) acceptFile(t, e.target.files[0]);
});
document.addEventListener('dragover', e => { const z = e.target.closest('[data-drop]'); if (z) { e.preventDefault(); z.classList.add('is-over'); } });
document.addEventListener('dragleave', e => { e.target.closest('[data-drop]')?.classList.remove('is-over'); });
document.addEventListener('drop', e => {
  const z = e.target.closest('[data-drop]');
  if (!z) return;
  e.preventDefault(); z.classList.remove('is-over');
  if (e.dataTransfer.files[0]) acceptFile(z.dataset.drop, e.dataTransfer.files[0]);
});

if (new URLSearchParams(location.search).has('capture')) document.body.classList.add('capture');
window.addEventListener('hashchange', route);
route();
