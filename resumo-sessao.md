# Resumo da sessão: redesign do portfólio do Alexandre Macedo Costa

## 1. Contexto e regras de trabalho

- **Projeto:** site estático (HTML + CSS, sem build) do portfólio de Alexandre Macedo Costa, Product Designer / UX/UI.
- **Conversa:** em português. **Conteúdo do site:** em inglês. Textos que o usuário escreve em português devem ser traduzidos para inglês antes de entrar no site.
- **Pasta de trabalho:** `/home/claude/claude-redesign/versao-olhos/` (arquivos `index.html` e `mystyle.css`).
- **Pasta original (não alterar):** `/home/claude/claude-redesign/versao-original/`. Só gravar nela com aprovação explícita do usuário.
- **Outras pastas do projeto:** `versao-nova/`, `versao-foto/`, `versao-parallax/`, `versao-stack/`, `preview-metodo/`, `preview-numeros/`, `projetos-src/`, `assets/`.
- **Link de preview (artifact, privado):** https://claude.ai/artifact/Ngd4qVa1WrPcD4tq2sBR5j
- **Fluxo de publicação:** Artifact `publish` no mesmo `url`, com `file_path=/home/claude/claude-redesign/versao-olhos/index.html`, `root=/home/claude/claude-redesign/versao-olhos` e `files=["mystyle.css"]`.
- **Pacotes para o Mac:** o usuário baixa `index.html` + `mystyle.css` e substitui na sua cópia local. Último pacote gerado: `atualizacao-v103.zip` (em `scratchpad`). Para a versão 104, o usuário pediu arquivos sem compactar (já enviados).
- **Ambiente:** a sessão **não está vinculada** ao computador do usuário. Não é possível gravar em `mesa/site/claude 2/part1-site-e-assets-a` daqui. Para vincular, abrir a tarefa no app Claude desktop e escolher "Link to this computer" (ou iniciar nova tarefa pelo app com o computador selecionado).
- **Verificação visual:** Playwright com servidor local (`python3 -m http.server <porta>`). Elementos com `opacity: 0` / `visibility: hidden` (scroll reveal, ScrollReveal bloqueado offline) precisam ser forçados visíveis só para captura. O erro "ScrollReveal is not defined" é esperado e pode ser ignorado.
- **Estilo de aprovação do usuário:** ele revisa cada mudança no preview e costuma pedir ajustes curtos e diretos. Quando aprova, pede "arquivos para atualizar".

## 2. Estado atual (versão publicada: 178 — sessão no DSH, 24/11/2026)

### Hero
- Texto de apresentação "Hi, my name is Alexandre…" em **preto** (`.hero-intro`). A frase sobre São Paulo continua com o grifo amarelo animado (`.hero-hl`).

### Introdução ("Short resume", antes "A short long history")
- Título da seção renomeado para **"Short resume"**.
- Frase "Today, AI is part of my daily work…" com **grifo rosa claro** que desliza linha a linha ao entrar na tela (`.grifo`, `IntersectionObserver`; desativado com `prefers-reduced-motion`).
- Bloco "Sectors I've worked in":
  - Título em cinza (Montserrat 800, 26px; 22px no celular) com **seta igual às dos quadrados dos números** (SVG `stat__arrow`, girada -135° para apontar para o título, animação `sectors-arrow` de balanço, 26px no desktop e 34px no celular).
  - Lista em **grade de 2 colunas** com fundo cinza claro em cada item, 15px no desktop e 14px no celular (mesmo tamanho dos rótulos "years in the design market").
  - Cada item tem **ícone de 12px** (livro = Education, barras = Finance, cruz = Health, documento = Editorial, paleta = Art).
  - Nomes em inglês: Education, Finance, Health, Editorial, Art.
- Animação de rotação de setores (um por vez, com embaralhamento) foi implementada e **revertida** a pedido do usuário.
- Espaço entre a introdução e "How I work" = **140px** no desktop, igual ao espaço entre "How I work" e Skills (`.how { margin-top: 140px }` em `min-width: 801px`). No celular, mantido como estava.

### How I work (`section#metodo`, classes `.how*`)
- **Refeito do zero** conforme a imagem enviada pelo usuário. Todas as interações antigas foram removidas: balões de etapas, duplo diamante (animação e desenho), tap para abrir, letras com efeito, grifo.
- **Layout:**
  - Desktop (>1024px): 3 colunas (`1.15fr 1fr 1fr`, gap 32px): citação à esquerda; "UX / Product design" e "UI" ao lado.
  - Tablet (601–1024px): citação ocupa a largura toda; as duas colunas lado a lado.
  - Celular (≤600px): tudo em uma coluna.
- **Citação:** 28px desktop, 24px tablet, 22px celular. Montserrat 900, preto, sem caixa. Três frases rotativas a cada 10s, com três quadrados como indicadores (clicáveis).
- **Abas (acordeão):** **uma aba aberta por vez em toda a seção**, mas **todas podem ficar fechadas** (v108). Clicar na aba aberta fecha; abrir outra fecha a anterior. Por padrão abre "Discover" (primeira de UX), definido no próprio HTML.
  - Cabeçalho: fundo `#ececec`, texto uppercase Montserrat 600, chevron que gira ao abrir.
  - Painel: fundo `#f5f5f5`, texto Montserrat 400 15px, itens com "- " via CSS `::before`.
- **Conteúdo (tudo em inglês):**
  - UX / Product design: Discover (Understanding the business; Stakeholder research; User research; Experience analysis), Define (Workshops; Research synthesis; Problem definition; Opportunity definition; Solution definition), Design (I sketch fast and iterate in the open, with feedback on every round.), Test (Real users see the work early, while changes are still cheap.), Delivery (Ship, measure, learn and repeat. A product is never really finished.).
  - UI: Design system (Color palette and tokens; Type scales; Buttons and states; Inputs and forms; Cards and components; Grid and spacing; Error, loading and success states; Responsive components), Documentation (Handoff: documentation and delivery to development), Governance (Color contrast; Visual hierarchy; Legibility; Focus states; Keyboard navigation; Interaction feedback; Accessibility).
- **JS:** bloco único com a lógica de abas (`openTab`) e a rotação das citações (`show`, `restart`, 10s, respeita `prefers-reduced-motion`).
- **Toggle "Show/hide content":** a lista de seções controladas inclui `#metodo`.
- Espaço: `.how { padding-bottom: 96px }`, `.how .container-titulo { margin-bottom: 48px }` (32px no celular).
- **CSS antigo removido:** todas as regras com `method` ou `lead-q` foram retiradas de `mystyle.css`. Backups anteriores ficaram em `/home/claude/claude-redesign/index.before-how.html` e `mystyle.before-how.css`.

### Skills (accordion)
- Corrigido o corte do último card: o painel aberto recalcula sua altura com `ResizeObserver` e no evento `resize` (antes a altura era fixa em pixels, calculada só no carregamento).
- Testado em 1440, 1024, 800, 600, 390 e 360px.

### Outros ajustes recentes
- Duplo diamante: primeiro ficou cinza claro (`#c9c9c9`), depois removido por completo (SVG, JS e CSS).
- Caixa preta de citação: ocupava 450px; agora ocupa a metade esquerda (`max-width: none`). Depois foi substituída pelo layout acima.

## 3. Tipografia do site
- **Montserrat** (500, 800, 900): texto padrão (`--font-padrao`), títulos de seção, lista de setores, abas e citações.
- **Merriweather** (700): título `h1` da coluna da esquerda (`.div-left > h1`, `--font-titulo`).
- **Doto** (700): textos pontilhados das etapas antigas e anos da cápsula do tempo.
- Importados mas não usados: Roboto, Muli e Quicksand (podem ser removidos).
- Para instalar no Mac: fonts.google.com > Montserrat > Download all > instalar os `.ttf` pelo Font Book.

## 4. Pacotes entregues
- `atualizacao-how-i-work.zip`, `atualizacao-v62.zip`, `atualizacao-v78.zip`, `atualizacao-v82.zip`, `atualizacao-v83.zip`, `atualizacao-v93.zip`, `atualizacao-v96.zip`, `atualizacao-v103.zip` (scratchpad: `/tmp/claude-0/-home-claude/92f1f8f8-6b1b-5fbe-ad9e-801a5eca1250/scratchpad/`).
- Versão 104: `index.html` e `mystyle.css` enviados separados e sem compactar.

### Tooltip (v106)
- Visual: caixa `#111` reta (sem border-radius), texto branco em `ui-monospace` 12px, rabicho triangular via `::after`, `pointer-events: none`.
- Variantes mantidas: `.center` (padrão), `.right` (ancorado à esquerda do elemento) e `.left` (ancorado à direita).
- Animação: ao entrar com mouse/foco, o texto é digitado letra por letra (38ms/letra) com cursor de bloco piscando (`.tip-t::after`).
- O texto original fica em `data-text`; o JS envolve o conteúdo num `<span class="tip-t">` para o cursor ficar **no fim** (o `::after` da caixa é o rabicho).
- `min-width` é reservado com a largura final antes de digitar, para a caixa não pular a cada letra.
- `prefers-reduced-motion`: mostra o texto completo direto, sem cursor.
- Sem JS: o texto original permanece no DOM (só é esvaziado no momento de digitar).

### Menu mobile (v107) — `menu.js` + CSS
- Overlay em tela cheia (`#mmenu`), fundo `#0b0b0b`, montado por **`menu.js`** a partir dos links que já existem no `<nav class="menu">` — vale para a home (5 links) e para as páginas de projeto (Back).
- Itens grandes (Montserrat 800, `clamp(30px, 8.6vw, 42px)`), sem numeração (v111).
- Entrada: `clip-path` de cima para baixo (0,55s) + itens em cascata (`--i`, 60ms).
- Hover/foco: label desloca 10px, fica rosa, seta entra e um sublinhado rosa varre da esquerda; `:active` no toque.
- Redes sociais (Instagram, Behance, WhatsApp) em botões circulares, mesmos links do rodapé; + e-mail e "São Paulo, BR".
- Acessibilidade: `role="dialog"`, `aria-modal`, `aria-expanded` no hambúrguer, foco no diálogo ao abrir (não no 1º link, para não parecer hover), Tab preso dentro, Esc fecha, fundo trava o scroll (`html.menu-open`), `inert` ao fechar.
- Responsivo: breakpoint ≤1024px; em telas baixas (≤560px de altura, celular deitado) a tipografia e os espaçamentos diminuem para caber sem rolar.
- `prefers-reduced-motion`: sem clip/cascata.
- O script antigo do menu (que só trocava o ícone e alternava `.menu ul.active`) foi removido das 8 páginas; `trocarSVGMenu` virou no-op para os `onclick` antigos não conflitarem.
- Desktop (>1024px) intacto: overlay `display:none` e o menu horizontal continua igual.

### Toggle show/hide (v109)
- O tooltip mostra a **ação do próximo clique**, não um texto fixo:
  - ligado (verde, seções visíveis) → **"Show only projects"**
  - desligado (cinza, só a grade de jobs) → **"Show all site contents"**
- Implementação: o tooltip lê o texto de `data-text` (fonte única) e expõe `tip.setText(texto)`. O `change` do `#toggleSwitch` troca o texto; se o tooltip estiver aberto, ele **redigita** a nova frase.
- O `aria-label` do checkbox acompanha o mesmo texto (antes o input não tinha nome acessível).
- Texto inicial no HTML: "Show only projects" (estado `checked`).
- O tooltip do toggle continua com a variante `.right` (rabicho à esquerda).

### Tooltip e foco (v110)
- Problema: `:focus-within` mantinha o tooltip aberto depois do clique, porque o botão/checkbox continua focado mesmo com o mouse longe.
- Correção: o reveal por foco só acontece quando a interação veio do **teclado**. O JS marca `kbd` em `keydown` e desmarca em `pointerdown`, e aplica a classe `.is-focus` no `.tooltip` apenas nesse caso.
- CSS: `:focus-within` trocado por `.tooltip.is-focus` (no tooltip genérico e nos cards de Skills).
- Resultado: clique com mouse → tooltip fecha ao sair com o mouse; Tab → tooltip abre e digita normalmente.

### Ajustes de espaçamento e conteúdo (v112)
- Filtros de categoria (All/Editorial/Web/Digital): `gap` de 15px → **8px** (`.div-btscategoria`). No mobile os 4 botões passam a caber em uma linha.
- Ícone ↔ título das seções: era **30px** (16px de `column-gap` + 14px de `margin-right` no `.sec-ico`); agora **24px** — `margin-right: 0` e `column-gap: 24px` no `h1` flex.
- Primeiro card da Time capsule: `2022/2025` → **2022/2026**.

### Seção Projects: alinhamento do título (v113)
- A seção `#Jobssection` fica **fora do `<main>`** (é filha direta do `body`), então não herda o `padding` lateral dele.
- Ela tinha `padding: 50px` fixo: alinhava no desktop, mas no mobile o `main` usa 20px e o título ficava em 50px — deslocado em relação aos outros títulos.
- Correção: `.Jobsprincipal` replica o padding do `main` (50px no desktop, 20px em `max-width: 800px`). Medido: título em 50/50/50 (Jobs/Skills/Time) no desktop e 20/20/20 no mobile.
- O grid de projetos continua com 20px de margem própria (full-bleed) — no desktop o título fica 30px à direita da borda dos cards, igual ao padrão das outras seções.
- Título renomeado de "Dear jobs" para **"Projects"**.
- Ícone ↔ título: 24px → **16px**.

### Página de contato com Netlify Forms (v114)
- Novos arquivos: **`contato.html`** (formulário) e **`obrigado.html`** (confirmação, `noindex`).
- Visual: mesma navbar (com `menu.js`), faixa rosa com título + ícone de envelope, layout em 2 colunas (aside + form), responsivo.
- Form: `name="contact"`, `method="POST"`, `data-netlify="true"`, `netlify-honeypot="bot-field"`, `action="/obrigado.html"`, hidden `form-name`.
- Campos: nome, e-mail, empresa (opcional), assunto (select), mensagem, consentimento (obrigatório). Todos com `label`, `autocomplete` e `required` onde aplicável.
- **Destinatário do e-mail não vai no HTML**: precisa ser configurado no painel do Netlify (Site configuration → Forms → Form notifications → Email notification → `alemedacedo@gmail.com`).
- Netlify Forms só funciona hospedado no Netlify; no preview local o envio retorna erro (esperado).
- Não há link para `contato.html` no sistema ainda (página interna). Pode ser ligada no menu ou na seção de contato do index quando o usuário quiser.

### Rolagem nas páginas novas (v116)
- O CSS global tem `body { overflow: hidden }` e quem libera a rolagem é o script do loader (`document.body.style.overflow = "auto"`), que existe só nas páginas com `.container-loading`.
- `contato.html` e `obrigado.html` não têm loader → a página não rolava no mobile.
- Correção: `.contact-page, .thanks-page { overflow-y: auto; }` e `class="contact-page"` no body de `contato.html`.
- Atenção para páginas futuras: ou incluem o loader, ou precisam dessa classe/regra.

### Ícones sociais do index (v117)
- `.container-contato .icone`: `border-radius` 12px → **50%**, tamanho 44px, padding 10px.
- Hover igual ao da página de contato: fundo `#111` e ícone branco (`stroke/fill` trocados no hover); antes era fundo rosa `#ffdada`.
- Tooltips e animações dos ícones (Instagram, Behance, WhatsApp) continuam iguais.

### Cursor dos projetos (v118)
- O antigo "+" (duas barras com `proj-plus`) virou um chevron ">" feito com `border-right` + `border-bottom` e `rotate(-45deg)` no `::before` do `span`.
- Animação `proj-chev` (1,4s): o chevron desliza 3px para a direita e volta. Com `prefers-reduced-motion`, fica parado (já centralizado).
- O `translate(-2.2px, 0)` compensa o centro óptico do ">" (a forma visível fica deslocada +2,16px após a rotação).
- O `::after` e o keyframe `proj-plus` foram removidos.

### Tooltips compartilhados e redes da página de contato (v119)
- O módulo de tooltip (digitação + foco só de teclado + `setText`) saiu do inline do `index.html` e virou **`tooltip.js`**, incluído no `index.html`, `contato.html` e (se precisar) em novas páginas.
- A página de contato ganhou tooltips nos três ícones sociais, com o mesmo visual: `tooltip-text right` (alinhado à esquerda do ícone, abre para a direita — centralizado cortaria na borda).
- `.contact-socials` ganhou `margin-top: 40px` para o tooltip caber acima dos ícones sem encostar na linha do `REPLY TIME`. **Atenção:** valores menores que 28px não fazem efeito por colapso de margem com `.contact-facts`.
- Textos: Instagram, Behance, WhatsApp.

### Hover dos botões (v120)
- Regra única no fim do CSS: `.button-small`, `.div-downloadcv button`, `#botao-topo`, `.contact-submit`, `.contact-soc`, `.container-contato .icone` e `.mmenu__soc` sobem **2px** no hover (`translateY(-2px)`), com a mesma curva `cubic-bezier(.22,1,.36,1)` de 0,25s.
- `:active` volta para `translateY(0)`; `prefers-reduced-motion` desliga a subida.
- Acordeões e abas (`button` genérico) ficaram de fora de propósito — não devem "pular".
- As **cores** de hover continuam por contexto: redes → preto; botão de envio → vermelho; filtros/botões comuns → cinza `#444`.

### "Clique" no hover dos cards (v121)
- Keyframe `card-click`: 0% → translate 0, 40% → 2px para baixo, 100% → 0 (0,5s).
- Aplicado em `.portfolio-item`, `.skills-grid .level-counter`, `#Timelinesection .container-timeline`, `.stat` e `.front` (lista de fronts do projeto Select).
- Usa a propriedade **`translate`** (não `transform`) de propósito: os cards da timeline já usam `transform: scale(var(--s))` na pilha e os projetos têm transforms próprios; assim não há conflito nem "pulo" no fim da animação.
- `prefers-reduced-motion`: animação desligada.

### Som de click no hover (v122 — REMOVIDO na v124)
- **`sound.js`**: sintetiza o som com Web Audio (ruído curto + bandpass/highpass + gain 0,06), sem arquivo de áudio.
- Dispara no `mouseenter` dos cards (mesmos seletores do press: portfolio, skills, timeline, stat, front), com throttle de 110ms.
- Só roda em dispositivos com `(hover: hover) and (pointer: fine)`.
- Botão `.sound-toggle` (orador / orador cortado) é injetado dentro do `.container-toogle` quando existe (index); nas outras páginas vai num `.sound-dock` fixo no canto inferior esquerdo.
- Estado ligado/desligado salvo em `localStorage` (`amc-hover-sound`), `aria-pressed` e `aria-label` atualizados.
- **Limite do navegador:** áudio só é liberado depois de um gesto do usuário (clique/tecla). Antes disso, o hover fica silencioso; `pointerdown`/`keydown` fazem o `resume()` do AudioContext.
- Incluído em `index.html` e `projeto_select.html` (páginas que têm cards).

### Som nos ícones do hero (v123)
- A grade `.hero-icons` é decorativa, fica atrás do texto e tem `pointer-events: none`; o efeito de rastro dela é calculado por coordenadas.
- Para o som, o `sound.js` faz o mesmo: no `pointermove` do `#hero`, procura o tile sob o cursor usando rects em cache (recalculados no `pointerenter`, `resize` e `scroll`) e dispara o clique quando o tile muda.
- Assim o som funciona em toda a área do hero, inclusive sobre o texto — coerente com o rastro rosa.
- O CSS dos tiles não foi alterado (nada de `pointer-events: auto`), então seleção de texto e cliques no hero seguem iguais.
- Respeita o botão liga/desliga do som e o throttle de 110ms.

### Estado do idioma (v126)
- **Somente português no ar:** 10 páginas na raiz (`index`, `contato`, `obrigado`, 7 projetos), todas `lang="pt-BR"`.
- **Seletor `ENG | PORT` removido** de todas as páginas. O CSS de `.nav-left` e `.lang-switch` continua no `mystyle.css` (sem uso) para facilitar quando o inglês voltar.
- **Inglês pausado** em `_backup/en-pausado/` (10 arquivos + `LEIA-ME.txt` com instruções). É um snapshot: não acompanha edições posteriores do PT; ao retomar, traduzir de novo a partir do PT final.
- Ao voltar o inglês: copiar os arquivos de volta para a raiz, reaplicar o seletor e revisar tradução.

### Versão PT e ajustes de conteúdo (v124)
- **Estrutura i18n (pausada na v126):** PT na raiz e inglês com sufixo `-en`. O EN foi movido para `_backup/en-pausado/`; ao retornar, copiar de volta para a raiz (os links internos já são auto-consistentes).
- **Seletor de idioma:** `ENG | PORT` ao lado do logo (`#my-logo`), dentro de `.nav-left`; o idioma atual fica com `is-active` + `aria-current="page"`. Presente nas 20 páginas.
- **`menu.js` bilíngue:** lê `document.documentElement.lang` e usa "Open/Close menu" ou "Abrir/Fechar menu".
- **Páginas:** 10 PT na raiz e 10 EN com `-en`. Formulário PT posta em `/obrigado.html` e o EN em `/obrigado-en.html`, ambos com `name="contact"` (mesma caixa de entrada do Netlify).
- **`<html lang>`:** EN = `en`; PT = `pt-BR`. `<title>`s traduzidos.
- **Som removido:** `sound.js`, botão `.sound-toggle`, `.sound-dock` e CSS correspondente foram apagados; os includes saíram de `index.html` e `projeto_select.html`.
- **"Soon" removido** dos 7 cards de projeto (index e index-pt).
- **Menu:** "Jobs" → "Projects" (EN) e "Projetos" (PT); "Início" do EN virou "Home".
- **Seção de contato removida do index** (a "porta" duplicada). A página `contato.html` é o único caminho de contato. A seção saiu também do array do toggle.
- **CTA no hero:** "See projects" / "Ver projetos" → `#Jobssection`, com subida no hover.
- **Tipografia:** `p { font-weight: 100 }` → **400**.

### Hierarquia de títulos (v127)
- Títulos dentro de `.container-titulo` viraram **h2** no index (5) e nos 7 projetos (2 cada = 14). O h1 do hero e os títulos de página (Contato, Mensagem enviada) continuam h1.
- CSS: seletores `.container-titulo > h1` passaram a `.container-titulo > :is(h1, h2)` e `h1 .sec-ico` para `:is(h1, h2) .sec-ico`.
- Foi adicionado `font-size: 32px` na regra dos títulos de seção (o h2 global é 24px); o clamp do hero de contato continua vencendo por vir depois.
- Resultado: index e projetos com **1 h1** cada; visual dos títulos inalterado.

### Grid de projetos (v129)
- O card do SGP tinha `grid-column: 1 / -1` + `aspect-ratio: 1700/985`, ocupando a linha inteira quando ficava sozinho.
- Removido: agora todos os cards usam `.portfolio-item { aspect-ratio: 938 / 519 }`, a proporção das thumbs padrão, e `object-fit: cover` corta o mínimo da thumb do SGP (1700x985).
- Medido: 1440 → 453×251 (3 colunas); 1024 → 482×267 (2); 800 → 370×205 (2); 390 → 350×194 (1). Todos os cards com a mesma largura e altura.
- A classe `is-sgp` saiu do HTML e do CSS.

### Tipografia: Fraunces no hero e títulos (v131)
- Origem do Arial: `button` nunca teve `font-family` no CSS; botões não herdam a fonte do body, então o navegador usava o padrão (Arial no Chrome/macOS). Afetava filtros, "Baixar CV", acordeão de Skills e envio do contato.
- **Fraunces** (variável `opsz,wght@9..144,400..900`) no `@import`, variável `--font-serif`.
- Aplicada só em:
  - `.hero-phrase` — 600, `letter-spacing: -0.015em` (6vh no desktop / 30px no mobile);
  - `.container-titulo > :is(h1, h2)` — 700, 34px, `letter-spacing: -0.01em`.
- Botões: `button { font-family: var(--font-padrao); font-weight: 600; letter-spacing: 0.03em; }` — resolve o Arial e mantém a sans do site. `.hero-cta` e `.contact-submit` voltaram a Montserrat 700.
- Mobile: em `max-width: 600px`, `.button-small` fica 12px/padding 13px e `.div-btscategoria` ganha `flex-wrap: wrap` (390px cabe em 1 linha; 360px quebra em 2).
- Corpo, navegação, abas do How I work e acordeões seguem em Montserrat.
- O guia `_check/tipografia.png` é anterior a esta mudança — regenerar depois.
- Origem do Arial: `button` nunca teve `font-family` no CSS; como botões não herdam a fonte do body, o navegador usava o padrão (Arial no Chrome/macOS). Afetava filtros, "Baixar CV", acordeão de Skills e o botão de envio do contato.
- **Fraunces** (variável, `opsz,wght@9..144,400..900`) adicionada ao `@import` e à variável `--font-serif`.
- Aplicada em:
  - `.container-titulo > :is(h1, h2)` — títulos de seção, agora 34px / 700 / `letter-spacing: -0.01em`;
  - `button` (base) — 600, resolve o Arial em todos os botões;
  - `.hero-cta` e `.contact-submit` — 600, 13px;
  - `.button-small` — 13px, padding 18px.
- Mobile: em `max-width: 600px`, `.button-small` volta a 12px/padding 13px e `.div-btscategoria` ganha `flex-wrap: wrap` (390px cabe em 1 linha; 360px quebra em 2).
- Hero, navegação, texto corrido e abas do How I work continuam em Montserrat.
- O guia `_check/tipografia.png` é anterior a esta mudança — regenerar depois de fechar a decisão.

### Contraste das tags (v132)
- `.tags` usava `color: #777` sobre `#ffdada` (~3,5:1, abaixo de 4,5:1 para texto pequeno). Agora `#333` (~9:1), mesmo fundo rosa.
- Vale para as tags da Linha do tempo e das páginas de projeto (`.tags` é a mesma classe).
- Na revisão, achei rótulos que escaparam da tradução por serem repetidos: `<h4>Period tags:</h4>` em 7 cards → "Tags do período:" e a tag "Art direction" → "Direção de arte".
- Termos mantidos em inglês por uso corrente: "UX Design", "Design System", "Workshops", "Branding", "Key visual".

### Cursor dos projetos: chevron (v133)
- O chevron deixou de ser `::before` do círculo e virou elemento próprio: `.proj-cursor__chev` (um `<i>` dentro de `.proj-cursor`).
- Cor: `var(--cor-apoio01)` (#ff0000) no `border-right`/`border-bottom`.
- **Inércia própria:** o círculo segue o mouse com lerp `0.25`; o chevron ganha um deslocamento no sentido oposto ao movimento, com lerp `0.16` e limite de ±8px. Assim ele "atrasa" em relação ao círculo e volta ao centro quando o mouse para.
- `prefers-reduced-motion`: sem inércia (chevron fixo) e sem a animação `proj-chev`.
- O centro óptico continua corrigido com `translate(-2.2px, 0)`.

### Frases do Como trabalho (v134)
- `.how__quote`: família Montserrat 900 → **Fraunces 600**; tamanhos mantidos (28px desktop, 24px tablet, 22px celular).
- `line-height` 1.5 → 1.4 no desktop (a serifada ficava solta); no celular continua 1.45.
- As frases rotativas, os indicadores e o restante da seção não mudaram.

### Redes sociais no fim dos projetos (v135)
- A seção de contato saiu do index na v124, levando junto os ícones. Voltaram como uma faixa compacta **abaixo da grade de projetos**: rótulo "Vamos conversar" (Fraunces 600, 26px), os três ícones redondos (`.contact-soc`, 46px) com tooltip e o e-mail `alemacedo@gmail.com` (mailto).
- Reaproveita as classes da página de contato e o `tooltip.js` (já carregado no index).
- `.portfolio-grid` tinha `margin-bottom: 150px` (desktop) / 100px (mobile); agora **64px / 56px** para a faixa ficar perto dos cards.
- `.social-strip` tem `padding-bottom: 64px` no desktop (o `#Jobssection` só tem 20px de margem lá) e 0 no mobile (a seção já tem 100px).
- O rótulo tem `margin-bottom: 30px` (somado ao gap de 14px) para o tooltip não encostar nele no hover.

### Cards: título serifado e filtro animado (v136)
- `.caption h3` (título que aparece no hover): Fraunces 600, 20px (tamanho do h3 global mantido).
- Filtro deixou de trocar `display` na hora:
  1. os cards que saem ganham `.is-leaving` (opacidade 0 + `scale(.96)`) por 180ms;
  2. depois recebem `.hide` e os demais fazem **FLIP** (mede posição antiga, aplica `translate` inverso e anima até 0) — a grade se reorganiza deslizando;
  3. cards que estavam escondidos entram com `.is-entering` → `.is-in`, em cascata de 40ms por card.
- `.portfolio-item` trocou `transition: all .3s` por `opacity .2s` + `transform .3s cubic-bezier(.22,1,.36,1)`.
- `prefers-reduced-motion`: filtro volta ao toggle instantâneo de `.hide`.

### Sem animação de clique no hover (v137)
- Removido o bloco `@keyframes card-click` (press de 2px para baixo) e a regra que o aplicava em `.portfolio-item`, `.skills-grid .level-counter`, `#Timelinesection .container-timeline`, `.stat` e `.front`.
- O hover dos cards agora não move nada (`animation: none`, `translate: none`, transform identidade).
- O hover de botões (lift de 2px) e as demais animações seguem intactos.

### Faixa social sem rótulo (v138)
- Removido o `<p class="social-strip__label">Vamos conversar</p>` e as regras `.social-strip__label` (incluindo o ajuste de 22px no mobile).
- A faixa agora tem só os três ícones e o e-mail; o tooltip do hover usa o espaço acima sem colidir com texto.

### Espaçamento do Como trabalho (v139)
- `.how__grid`: `gap: 32px` → **`gap: 32px 56px`** no desktop (56px entre a coluna das frases e as colunas de accordeons; era 32px).
- Tablet (≤1024): `gap: 40px 32px` → **`48px 32px`** (as frases ficam em largura total, então o respiro é vertical).
- Celular (≤600): `gap: 40px` → **`48px`**.
- O espaçamento entre as duas colunas de accordeons (UX e UI) acompanha o mesmo column-gap.

### Local na Linha do tempo (v140)
- Cada um dos 8 cards ganhou, acima de "Tags do período:", um bloco `.timeline-local` com `<h4>Local:</h4>` e o nome da empresa em `<p>`.
- Mapeamento: 2022/2026 Banco BV · 2021/2022 Dock meios de pagamentos · 2020 Banco BV · 2019 Secretaria Municipal de educação de SP · 2018 Dr. Consulta · 2016 Tellus · 2014 Dois design (empresa própria) · 2012 Tempo Design.
- CSS: `.timeline-local { width: 100% }`, `h4` com margem 15px/4px, `p` 15px/600.
- Só no index (as páginas de projeto não têm cards de linha do tempo).

### Hierarquia do Local (v141)
- Rótulos `.div-right > h4` e `.timeline-local h4`: 18px → **11px, caixa alta, letter-spacing .08em, #777** (mesmo padrão dos labels do formulário de contato).
- Nome da empresa `.timeline-local p`: 15px/600 → **18px/700** (17px no mobile).
- Resultado: a informação (empresa) domina; "LOCAL:" e "TAGS DO PERÍODO:" viram apoio.

### Texto dos cards da timeline (v142)
- `.container-timeline .div-left p`: 16px → **15px**, `line-height` 1.7 (antes 1.8).
- Mobile (≤800): **14px** com `line-height` 1.7 — 14px é o piso; abaixo disso a leitura piora.
- O bloco de texto ficou ~6% mais compacto, o que dá mais ar relativo para "LOCAL:" e as tags.

### Seção Idiomas (v143)
- Inserida em `#Idiomassection`, entre o bloco de Competências (About) e a Linha do tempo.
- Título "Idiomas" com ícone de globo (`.sec-ico--globe`, gira devagar em 18s; para com `prefers-reduced-motion`).
- Dois cards (`.idioma`): nome do idioma em Fraunces 26px, nome nativo em itálico ("English"/"Français"), nível "Intermediário / Avançado" e um medidor de 4 segmentos (Básico · Intermediário · Avançado · Fluente) com os dois do meio preenchidos em rosa.
- Mobile: uma coluna, cards empilhados.
- A seção entra na lista do toggle "Ver só projetos" (some junto com Intro/About/How/Timeline/CV).

### Cards de Idiomas no padrão Skills (v144)
- `.idioma` agora espelha `.skills-grid .level-counter`: fundo `whitesmoke`, borda `var(--cinza-03)`, raio 14px, sombra `0 -4px 14px rgba(0,0,0,.04)`, padding 16px 18px, gap 10px.
- Cabeçalho: ícone de globo 18px + nome em Montserrat 700 15px + nome nativo em Fraunces itálico 12px à direita.
- Barra reutiliza `.level-bar` / `.level-progress` (10px, rosa `var(--cor-apoio02)`), com 72% de preenchimento.
- Nível "Intermediário / Avançado" em 12px abaixo da barra.
- Grade: 3 colunas no desktop (os dois idiomas ocupam as duas primeiras, alinhados com os cards de Skills acima), 2 no tablet, 1 no celular.
- Sem `:hover` — cards não interativos.
- Correção: o preenchimento era um `<span>` inline (não renderizava); virou `<div>`.

### Idiomas removida (v145)
- Removido o `<section id="Idiomassection">`, o bloco CSS (.idioma, .idiomas__grid, globo animado) e a referência no array do toggle "Ver só projetos".
- A ordem de seções voltou a: Hero → Intro → Como trabalho → Competências → Linha do tempo → CV → Projetos.
- Sobrou o guia `_check/idiomas-*.png` como registro do que foi experimentado.

### Texto dos cards em preto (v146)
- `.container-timeline .div-left p` ganhou `color: #000`; antes herdava `var(--cinza-02)` (#444) do card.
- Contraste sobre o fundo `whitesmoke` sobe de ~9:1 para ~19:1.

### Duotone das thumbs (v147)
- Técnica: `.portfolio-item` ganhou `background-color: var(--cor-apoio01)` (vermelho) + `isolation: isolate`; a thumb recebe `filter: grayscale(1) contrast(1.05)` e `mix-blend-mode: screen`.
- Resultado do `screen` sobre vermelho: preto → vermelho, meio-tom → rosa, branco → branco.
- `.thumbnail-img` ganhou `background-color: #fff` para os PNGs com transparência (SGP) não mostrarem o vermelho chapado do fundo.
- Vale para as 7 thumbs do index (mobile inclusive). A legenda do hover continua sobreposta normalmente.

### Duotone com filtro SVG (v148)
- O `mix-blend-mode: screen` sobre vermelho puro deixava a grade vermelha demais. Trocado por um filtro SVG inline (`#duotone-pink`, definido logo após `<body>` no index).
- Mapeamento tonal (feColorMatrix saturate 0 + feComponentTransfer table):
  - R: 1 → 1 → 1
  - G: 0.14 → 0.502 → 1
  - B: 0.18 → 0.576 → 1
  - ou seja: sombra → vermelho suave (~#ff242e), meio-tom → **#fc8093** (o rosa das barras de Skills), branco → branco.
- CSS: `.portfolio-item .thumbnail-img { filter: url(#duotone-pink); background-color: #fff; }`; o fundo vermelho e o `isolation` do card saíram.
- Só o index usa `.thumbnail-img`, então o filtro não afeta outras páginas.

### Pontos do header nos cards (v149)
- O header usa `assets/img_bgmenu.png` (tile 3×3 com um ponto `#ff264e` a 50%) repetido.
- Nos cards, `.portfolio-item::after` repete o mesmo arquivo com `background-size: 6px 6px` e `opacity: .4` (o dobro do tamanho do header, para o ponto aparecer na escala do card), `pointer-events: none` e `z-index: 1`.
- `.caption` ganhou `z-index: 2` para a legenda do hover continuar acima da textura.
- No hover, a legenda cobre os pontos com o fundo rosa (a textura fica só no estado normal).

### Teste: cores originais + pontos (v150)
- O `filter: url(#duotone-pink)` do `.thumbnail-img` está **comentado** no CSS; os pontos do header (`.portfolio-item::after`) continuam.
- Para voltar ao duotone: descomentar a linha `filter: url(#duotone-pink);` no bloco `.portfolio-item .thumbnail-img`. O SVG do filtro segue no index.
- Comparação visual: `_check/original-dots.png` (cores originais) vs `_check/duotone-rosa.png` (duotone).

### Accordeon do Como trabalho animado (v151)
- `.how__panel` ganhou `max-height: 0`, `opacity: 0`, `overflow: hidden`, `box-sizing: border-box` e `transition: max-height .38s cubic-bezier(.22,1,.36,1), opacity .26s`.
- JS do accordeon reescrito: ao abrir, mede `scrollHeight`, anima até ele e depois fixa `max-height: none`; ao fechar, mede a altura atual, anima até 0 e só então aplica `hidden`.
- `hidden` e `aria-expanded` continuam sendo aplicados (acessibilidade preservada); o guard `is-open` evita que o timeout de fechamento esconda um painel reaberto.
- `prefers-reduced-motion`: abre/fecha sem animação.
- Chevron continua girando 180° via `transform` (0.3s).

### Accordeon: animação igual à de Skills (v152)
- Causa do "soquinho": o `.how__panel` tinha `padding: 18px 16px 20px` e `max-height` animava até 0, mas o box parava em **38px** (padding) e só então o `hidden` zerava — um salto.
- Correção: o padding saiu do painel animado e foi para um `.how__panel-inner` (8 painéis envolvidos). O painel anima de `scrollHeight` até 0 de verdade.
- CSS agora espelha o `.panel` de Skills: `max-height: 0; overflow: hidden; transition: max-height 0.2s ease-out;` (sem opacidade, sem `none`).
- JS espelha o de Skills: abre com `maxHeight = scrollHeight + "px"`, fecha com `maxHeight = null` (o CSS anima até 0) e aplica `hidden` após 220ms.
- Listener de resize recalcula a altura dos painéis abertos (como o `refreshOpenPanels` de Skills).
- Medição: fechando 152 → 131 → 112 → … → 0 e abrindo 0 → 25 → 47 → … → 182, sem degraus.

### Fechar todas as abas do Como trabalho (v153)
- Clicar na aba já aberta fecha ela (estado "tudo fechado"); clicar em outra abre a nova e fecha a anterior — no máximo 1 aberta.
- Implementação: `setOpen(t, !isOpen)` para a aba clicada e fechamento das demais.
- Testado: abre Define → fecha Define (todas fechadas) → abre Design → abre Discover (Design fecha) → fecha Discover (todas fechadas), sem erro.

### Sem subida no hover (v154)
- Removido `transform: translateY(...)` do hover/active de: `.button-small`, `.div-downloadcv button`, `#botao-topo`, `.contact-submit`, `.contact-soc`, `.container-contato .icone`, `.mmenu__soc` (bloco unificado) e também das regras individuais de `.contact-soc`, `.mmenu__soc`, `.contact-submit` e `.hero-cta`.
- O bloco unificado agora só transiciona cor (background/color/border).
- Movimentos horizontais seguem: seta do CTA (`translateX(3px)`) e label do menu mobile (`translateX(10px)`).
- Verificado no navegador: hover em filtro, ícone social e botão de contato com `transform: none` e a cor mudando normalmente.

### Inércia de scroll (v155)
- Novo `scroll-inertia.js`, incluído nas 10 páginas antes de `</body>`.
- Intercepta `wheel` (passive: false) e anima `scrollY` com lerp `EASE = 0.13` via `scrollTo({ behavior: "instant" })` (para não brigar com o `scroll-behavior: smooth` do CSS, que continua valendo para âncoras).
- Não roda em telas de toque (`hover: hover` + `pointer: fine`), nem com `prefers-reduced-motion`.
- Não intercepta elementos com scroll próprio (textarea, listas) — sobe a árvore checando `overflow-y` + `scrollHeight`.
- Pulado quando o documento não tem scroll (`maxScroll() <= 0`); ressincroniza se a posição mudar por barra/teclado/âncora.
- Teste: rodando o wheel para baixo, `scrollY` 0 → 78 → 146 → … → 597 em ~600ms; para cima, 546 → … → 200. Sem erro de JS.
- Ajuste fino: `EASE` (menor = mais molenga; maior = mais seco).

### Inércia mais molenga (v156)
- `scroll-inertia.js`: `EASE` de `0.13` para **`0.08`** — o scroll continua por mais tempo depois do último tique.
- Medição: um wheel de 600px leva ~1.2s para assentar (antes ~0.6s).
- Para calibrar: `EASE` menor = mais molenga; maior = mais seco.

### Cards sem sombra (v157)
- Removido `box-shadow: 0 -4px 14px rgba(0,0,0,.04)` de `.skills-grid .level-counter` e `#Timelinesection .container-timeline` (inclusive no hover), e `box-shadow` da transição do card da timeline.
- Os cards de projeto **não têm sombra CSS**: `.portfolio-item`/`.thumbnail-img`/`.caption` computam `box-shadow: none`; as sombras que aparecem nas thumbs (mockups de laptop/tablet) fazem parte das imagens.
- Se o teste for para os cards de projeto, a alternativa seria remover borda/raio ou trocar as imagens — não há sombra de CSS a tirar.

### Cards brancos com outline preto (v158)
- `.skills-grid .level-counter`: `background-color: #fff` e `border: 1px solid #000` (era `whitesmoke` + `var(--cinza-03)`).
- `#Timelinesection .container-timeline`: idem — `background-color: #fff` e `border: 1px solid #000`.
- O hover rosa (`#ffeced`) dos dois continua valendo.
- Os cards de projeto seguem como estavam (fundo vem da imagem).

### Linha do tempo: só linha superior (v159)
- `#Timelinesection .container-timeline`: `border: 0; border-top: 1px solid #000; border-radius: 0;` — fundo branco mantido.
- O contorno lateral/inferior e o raio de 20px saíram; cada card vira uma faixa separada por uma régua superior.
- No empilhamento (sticky), a régua do próximo card marca a transição entre os períodos.

### Accordeon com réguas (v160)
- `.how__tab`: fundo `#fff`, hover `#f5f5f5`, `border-top: 1px solid #000` e `border-bottom: 1px solid #000` (sem laterais).
- `.how__panel` e `.how__panel-inner`: fundo `#fff`.
- `.how__item + .how__item { margin-top: -1px; }` colapsa as réguas adjacentes quando os painéis estão fechados (senão ficaria 2px entre abas).
- Sem painel aberto: cada aba fica entre duas réguas; com painel aberto, a régua de baixo da aba fica antes do conteúdo e a próxima régua vem depois do painel.

### Competências sem outline (v161)
- `.skills-grid .level-counter`: `border: 0` (era `1px solid #000`); fundo branco, raio 14px e hover rosa mantidos.
- Os cards ficam definidos só pelo branco sobre o painel cinza do accordeon.

### Competências com cantos retos (v162)
- `.skills-grid .level-counter`: `border-radius: 0` (era 14px).
- Os cards da Linha do tempo já estavam sem raio (v159).
- Os cards de projeto seguem com `border-radius: 20px` em `.portfolio-item` (não mexidos).

### Cursor dos projetos: "Ver" (v163)
- Chevron removido (HTML, CSS, keyframes e a lógica de inércia no JS).
- `.proj-cursor`: 56px → **72px** (left/top -36px); `.proj-cursor span` agora tem fundo **#000**, texto **branco**, 13px/600, centralizado.
- O círculo contém o texto "Ver" diretamente: `<span>Ver</span>`.
- `.portfolio-item` e `.portfolio-item a`: `cursor: pointer` (era `none`) — o ponteiro nativo volta a aparecer junto do círculo.

### Accordion de Competências (v164)
- `.accordion`: fundo `#fff`, hover `#f5f5f5`, `border-top` + `border-bottom` de 1px preto, sem laterais (igual às abas do Como trabalho). O `border: none` antigo foi removido (ele sobrescrevia as réguas).
- `.panel-content`: fundo `#fff` (era `var(--cinza-05)`), então a área interna também é branca.
- Os cards de Skills (brancos, sem borda) agora se fundem com o painel branco: a grade lê como uma lista de competências com as barras rosa. Se quiser os cards de volta visíveis, é só devolver o fundo cinza ao painel ou dar um tom aos cards.

### Box do CV (v165)
- `.div-downloadcv`: `background-color: #fff`, `border-top: 1px solid #000`, `border-right: 1px solid #000`; sem linhas à esquerda/embaixo.
- Padding de 40px e o botão "Baixar CV" mantidos.

### Box do CV completo (v166)
- `.div-downloadcv`: `border: 1px solid #000` (topo, direita, esquerda e base), fundo branco mantido.

### Ajustes v167
- Accordions: `.how__tab` e `.accordion` ganharam `position: relative; z-index: 1;` e `box-sizing: border-box`, garantindo que a régua inferior (1px preto) fique acima do fundo branco do painel quando aberto.
- Título "Como trabalho" renomeado para **"Processos"**.
- Projetos: `.portfolio-grid` com margens laterais de **50px** no desktop (20px no mobile), alinhando os cards à largura do título. Título e grid agora medem 50..1390.
- Caixa do CV: `justify-content: space-between` + `text-align: left` — texto à esquerda, botão "Baixar CV" à direita (antes tudo ia para a direita por causa do `flex-end`).

### Régua inferior do accordion aberto (v168)
- `.how__tab[aria-expanded="true"] { border-bottom-color: #fff; }` e `.accordion.active { border-bottom-color: #fff; }`.
- Aberto: cabeçalho e painel ficam brancos e se fundem; só a régua superior do cabeçalho permanece.
- Fechado: a régua inferior continua preta.

### Páginas de projeto: efeito do hero e texto no scroll (v169)
- Causa do "título sem efeito" na Select: o ScrollReveal iniciava na hora e a animação de entrada do hero rodava **atrás do loader** (1s de overlay). Nas outras páginas sobrava um resquício porque tinham `reset: true`.
- Agora as 7 páginas:
  - o loader dispara `app:ready` quando termina; o ScrollReveal só inicializa nesse evento, então a animação do hero aparece;
  - `reset: false` em todas (mesma correção que só a Select tinha) — o texto não some mais ao rolar de volta;
  - fallback: se a lib do CDN não carregar, `.hero-phrase`/`.container-full` são forçados visíveis;
  - guard `window.__revealInit` evita inicialização dupla entre o evento e o timeout de segurança.

### Novo site conceito — `claude 3` (v170)
- A pasta `claude 2` foi duplicada para `claude 3` (459MB).
- `claude 3/index.html` foi **reescrito do zero** com uma linguagem editorial/bold: Anton para display, Fraunces itálico para o editorial, Space Grotesk para texto; papel/tinta/vermelho/rosa.
- Seções: hero de nome gigante (linha sólida + contornada), marquee, manifesto/Sobre com retrato de olhos que seguem o cursor, trabalhos em lista com preview que segue o mouse, processo em bloco preto, trajetória em lista e contato em bloco vermelho.
- Novos arquivos: `claude 3/concept.css`, `claude 3/concept.js`, `claude 3/LEIA-ME.md`.
- Preview em `http://127.0.0.1:8124/` (servidor job bash-4d8b998f0cb94048).
- **Pendente:** as páginas internas de projeto ainda estão no visual antigo; próximo passo é redesenhá-las com a mesma linguagem.

### Conceito kinética — `claude 3` (v171)
- O conceito anterior (papel/vermelho) foi substituído por uma direção mais de galeria: preto `#0a0a0a`, verde ácido `#d9ff3d`, Syne + Instrument Serif + Space Mono.
- **Scroll com GSAP/ScrollTrigger:** letras do hero em cascata, hero some ao rolar, manifesto acende palavra por palavra (scrub), trabalhos com **pin horizontal** (desktop) e imagens em máscara, processo em cascata, linha da trajetória desenhada, contato crescendo.
- **Cursor próprio** (ponto + anel, esconde o nativo) e barra de progresso.
- Retrato em P&B com olhos que seguem o cursor.
- `claude 3/index.html`, `kinetic.css`, `kinetic.js`, `LEIA-ME.md` atualizado.
- Preview: `http://127.0.0.1:8124/`.
- Pendente: páginas internas de projeto continuam no visual antigo.

### Conceito inspirado no Chrome — `claude 3` (v172)
- O usuário rejeitou as duas tentativas anteriores (papel/vermelho e preto/ácido) e pediu inspiração no site do Google Chrome.
- Nova home: branco + `#f8f9fa`, azul `#1a73e8`, amarelo, verde e vermelho em fundos pastel, DM Sans, cards de 24px, botões-pílula e mockup de navegador no hero.
- Seções: hero com CTA e números, Sobre (retrato com olhos), 4 cards de serviços, 7 projetos em cards pastel, 5 etapas de processo, trajetória e contato em card com gradiente.
- Arquivos: `claude 3/index.html`, `chrome.css`, `chrome.js`, `LEIA-ME.md`.
- Preview: `http://127.0.0.1:8124/`.
- Pendente: páginas internas de projeto ainda no visual antigo.

### Títulos menores (v173)
- `.container-titulo > :is(h1, h2)`: **34px → 22px**, e **removida a `border-bottom: 1px solid black`**.
- Ícones dos títulos (`:is(h1,h2) .sec-ico`): **42px → 28px**, `padding 9 → 6`, borda `1.5 → 1px`, raio `12 → 8px`, stroke `1.5 → 1.2`; gap ícone-texto `16 → 12px`.
- Vale para o index e as páginas de projeto (mesma regra).
- O título "Projetos" também ficou em 22px, alinhado aos demais.

### Caixa do CV no padrão dos números (v174)
- `.div-downloadcv`: `border: 1.5px solid #000`, `border-radius: 22px`, `transition: background-color .4s` e `:hover { background: #ffdada }` — igual aos `.stat`.
- O download continua **exclusivo do botão** "Baixar CV" (a caixa é uma `div` sem link/handler; o `onclick` fica no `<button>`).

### Botões com um único tratamento (v175)
- Base: CTA do hero — fundo `#111`, pílula 50px, 13px/700, `letter-spacing .06em`, uppercase, hover `var(--cor-apoio01)`.
- Aplicado a: `.hero-cta`, `.div-downloadcv button` ("Baixar CV"), `.contact-submit` ("Enviar mensagem") e `.button-small` (filtros).
- Filtros mantêm um degrau menor de padding/fonte (10/16px, 12px) para caber na barra — mesmo tratamento, escala de contexto. `active` continua vermelho.
- Botões só de ícone (topo, redes sociais) ficam como estão: são circulares, não CTAs de texto.

### Formulário de contato (v176)
- `.contact-form`: fundo branco, `border-radius: 0`, `border-top`/`border-bottom` de 1px preto (sem laterais).
- Campos (`input`, `select`, `textarea`): fundo `#f5f5f5`, borda `#e6e6e6`, raio 12px; transição de fundo/borda/sombra.
- **Hover:** fundo `#ededed` + borda `#cfcfcf`. **Active:** `#e6e6e6`. **Focus:** fundo branco, borda preta e anel `rgba(0,0,0,.08)`; o label do campo fica preto via `:focus-within`.

### Projetos: 3 colunas e cards maiores (v177)
- `.portfolio-grid`: `repeat(auto-fit, minmax(400px, 1fr))` → **`repeat(3, minmax(0, 1fr))`**.
- A grade era fora do `<main>` e ocupava a janela inteira (em telas largas virava 4–6 colunas). Agora tem `max-width: var(--content-max)`, `margin: 0 auto` e `padding: 0 50px`, alinhada ao título.
- Responsivo: ≤1024 → 2 colunas; ≤640 → 1 coluna.
- Medido: 1440 e 1920 → 3 colunas de **433×240**; em 1920 a grade fica centralizada (240..1680) em vez de esticar.

### Projetos em largura total (v178)
- `.portfolio-grid`: removidos `max-width` e `padding: 0 50px`; agora `margin: 0 20px 64px` e `repeat(3, minmax(0, 1fr))`.
- Medido: 1440 → 3 cards de **453×251** (grade 20..1420); 1920 → **613×339** (20..1900).
- O título "Projetos" e os filtros continuam na largura de conteúdo (max 1440, padding 50), então em telas largas a grade passa ~20px além deles.

## 5. Pendências e pontos em aberto
- **Pasta de trabalho agora é local:** `/Users/alexandreribeiromcosta/Desktop/Site/claude 2` (sessão no DSH, com escrita direta na máquina). Backup dos arquivos pré-v105 em `_backup/pre-v105/`.
- **Texto das seções placeholder** dos projetos (`projeto_*.html`): ainda faltam os textos definitivos.
- **Páginas internas em andamento:** o usuário está terminando; o SGP já entrou na grade da home.
- **Integração do componente Lifeline** (adiada; exige seis arquivos `lifeline-utils` e build React/TS).
- **Exportação para Figma:** não é possível aqui (sem conector). Alternativas: PNG por seção, SVG, zip — sem escolha do usuário.
- **Ícones/`.div-left > h1`:** o seletor usa `--font-titulo` (Merriweather), mas nenhuma página usa hoje; a fonte saiu do `@import` (fallback serif). Se algum projeto voltar a usar, reimportar.
- **Favicon:** falta `favicon.ico` (404 inofensivo).

### Resolvido na v105
- Contato agora usa `--content-max` (1440px) e `width: 100%` + `padding` lateral.
- SGP adicionado à grade de jobs (`assets/projetos/sgp/img_thumb_sgp.png`), ocupando a linha inteira (`grid-column: 1/-1`, `aspect-ratio: 1700/985`) para não ficar sozinho encolhido na 3ª linha.
- Espaçamento mobile unificado em **100px** entre todas as seções (era 100/50/20/20). Causa raiz: o `margin-top: 100px` do `.container-titulo` vazava do `.how`. Agora o título encosta no início da seção e o respiro é da seção.
- Fontes mortas removidas do `@import`: Muli, Quicksand, Roboto, VT323 e Merriweather. Montserrat passou a carregar 400/500/600/700/800/900 (antes só 500/800/900; 400/600/700 eram sintetizados).
- Heros que faltavam geradas: `img_bg_sgp.jpg` (a partir de `img_thumb-04_sgp.png`), `img_bg_cia.jpg` (a partir de `img_thumb-02_cia.png`) e `img_bg_bvopen.jpg` (a partir de `thumb_site_bv.jpg`) — fundo rosa `#F9CCCF`, mockup centralizado com sombra, 1876×1038.

## 6. Histórico resumido das versões publicadas
- 86–88: sectors com troca animada (testada) e reversão.
- 89–91: sectors em grade com seta; seta igual às dos números; fonte dos setores.
- 92–93: duplo diamante em cinza claro; frases do How I work em 20px.
- 94: grifo na frase de IA.
- 95–96: ícones nos setores (8px, depois 12px).
- 97–98: caixa preta na metade; diamante estático; diamante removido.
- 99: hero em preto.
- 100: toggle também oculta How I work.
- 101: título "Short resume".
- 102: Skills com altura recalculada (cards não cortados).
- 103: How I work em abas, uma aberta por vez, em inglês.
- 104: espaço igual acima e abaixo de How I work (desktop).
- 105: contato em `--content-max`, SGP na grade, espaçamento mobile unificado (100px), limpeza de fontes e heras de SGP/Cia/BV Open.
- 106: tooltip redesenhado (caixa preta reta, mono, rabicho triangular) com digitação letra por letra.
- 106.1: nos cards de Skills o tooltip passou a abrir ao entrar no card inteiro (não só na barra), mantendo a ancoragem.
- 107: menu mobile novo (overlay em tela cheia, texto grande, redes sociais, animações).
- 108: How I work — clicar na aba aberta agora fecha (todas podem ficar fechadas); Discover continua aberta por padrão.
- 109: tooltip do toggle show/hide agora muda com o estado (2 textos).
- 110: tooltip não fica mais "aceso" após clique (foco de mouse não abre; só teclado).
- 111: menu mobile sem a numeração (01–05); itens alinhados à esquerda.
- 112: filtros de projetos com 8px, ícone↔título com 24px e 1º card da Time capsule em 2022/2026.
- 113: título "Dear jobs" → "Projects"; ícone↔título em 16px; padding lateral da seção Jobs passa a acompanhar o `<main>` (50px desktop / 20px mobile).
- 114: página interna de contato com Netlify Forms (`contato.html` + `obrigado.html`).
- 115: link "Contact" do menu (desktop e mobile) aponta para `contato.html` em vez da âncora `#Contatosection`.
- 116: rolagem liberada nas páginas de contato (o `body` global é `overflow: hidden` e só o loader do index liberava).
- 117: ícones de redes sociais do index agora são redondos, com o mesmo hover preto da página de contato.
- 118: cursor de hover dos projetos trocou o "+" por um chevron ">" animado.
- 119: tooltip do módulo virou `tooltip.js` (compartilhado) e a página de contato ganhou tooltips nas redes sociais.
- 120: hover dos botões unificado com o da página de contato (subida de 2px).
- 121: "clique" leve (press de 2px) no hover de todos os cards.
- 122: som de click no hover dos cards, com botão liga/desliga (`sound.js`).
- 123: som de click também nos ícones animados do hero.
- 124: versão em português com seletor de idioma; remoção do som; "Soon" fora; menu Jobs→Projects; seção de contato removida do index; CTA no hero; font-weight dos parágrafos.
- 125: português passa a ser o idioma padrão (na raiz); inglês vai para arquivos `-en`.
- 126: site fica **somente em português**; seletor de idioma removido e inglês pausado em `_backup/en-pausado/`.
- 127: títulos de seção passam de `<h1>` para `<h2>` (hierarquia: um h1 por página).
- 128: títulos PT ajustados: Breve histórico, Como trabalho, Linha do tempo, Projetos.
- 129: cards de projeto com tamanho/proporção padrão; SGP deixa de ocupar a linha inteira.
- 130: experimento tipográfico — Fraunces (serifada) nos títulos de seção e botões; Arial eliminada.
- 131: serifada fica só no hero e nos títulos de seção; botões voltam para Montserrat (sem Arial).
- 132: contraste das tags (`#777` → `#333`) e correção de rótulos que ficaram em inglês ("Period tags", "Art direction").
- 133: chevron do cursor dos projetos em vermelho e com inércia própria (diferente do círculo).
- 134: frases do "Como trabalho" em Fraunces, mantendo os tamanhos (28/24/22).
- 135: faixa de redes sociais restaurada abaixo dos cards de projetos.
- 136: título dos cards em Fraunces (hover) e filtro de projetos animado (saída, reordenação e entrada).
- 137: removida a animação de "clique" (press de 2px) que rodava no hover dos cards.
- 138: removido o rótulo "Vamos conversar" da faixa de redes sociais.
- 139: mais espaço entre as frases e os accordeons do Como trabalho.
- 140: "Local:" (empresa) em todos os 8 cards da Linha do tempo, acima das tags.
- 141: hierarquia invertida — rótulos "Local"/"Tags" pequenos e nome da empresa em destaque.
- 142: texto corrido dos cards da timeline de 16px para 15px no desktop (mobile segue 14px).
- 143: seção "Idiomas" (inglês e francês intermediário/avançado) entre Competências e Linha do tempo.
- 144: cards de Idiomas no visual dos cards de Skills (cinza, borda, barra rosa), sem hover.
- 145: seção Idiomas removida (HTML, CSS e entrada no toggle).
- 146: texto corrido dos cards da timeline em preto (#000).
- 147: thumbs dos projetos em duotone vermelho/rosa/branco via CSS.
- 148: duotone refeito com filtro SVG, mapeando para o rosa #fc8093 (mais próximo das barras de Skills).
- 149: textura de pontos do header sobreposta nos cards de projeto.
- 150: teste — pontos mantidos com as cores originais das thumbs (duotone comentado no CSS).
- 151: abertura/fechamento do accordeon "Como trabalho" animados (altura + opacidade).
- 152: animação do accordeon refeita no padrão do accordeon de Skills; corrigido o "soquinho" (painel parava em 38px por causa do padding).
- 153: accordeon permite fechar todas as abas (máximo de 1 aberta por vez).
- 154: removida a subida (translateY) do hover de todos os botões; sobra só a mudança de cor.
- 155: inércia de scroll (lerp) no desktop, para cima e para baixo.
- 156: inércia mais "molenga" (EASE 0.13 → 0.08).
- 157: sombra removida dos cards de Competências e da Linha do tempo (teste).
- 158: cards de Competências e Linha do tempo com fundo branco e outline preto (teste).
- 159: cards da Linha do tempo só com linha superior de 1px preta e sem border-radius (teste).
- 160: accordeon com fundo branco, hover cinza claro e réguas de 1px acima/abaixo de cada aba (teste).
- 161: cards de Competências sem outline (só fundo branco sobre o painel cinza).
- 162: cards de Competências sem border-radius (cantos retos).
- 163: cursor dos projetos vira círculo preto maior com "Ver" branco; pointer nativo de volta; chevron removido.
- 164: accordion de Competências com o mesmo tratamento dos accordions de Como trabalho.
- 165: box de download do CV com fundo branco e linhas de 1px no topo e na direita.
- 166: box do CV com outline completo (1px preto nas quatro laterais).
- 167: correção da régua inferior dos accordions, "Como trabalho" → "Processos", largura do título de Projetos e alinhamento da caixa do CV.
- 168: quando o accordion está aberto, a régua inferior do cabeçalho fica branca (some).
- 169: ScrollReveal padronizado nas páginas de projeto — inicia após o loader e com `reset:false`.
- 170: criada a pasta `claude 3` com um **novo site conceito** (home refeita do zero, pegada editorial/bold).
- 171: conceito refeito para **kinética** (preto/ácido, scroll coreografado, carrossel horizontal pinado, cursor próprio).
- 172: conceito trocado por uma linguagem **inspirada no site do Chrome** (claro, arredondado, colorido, produto em destaque).
- 173: títulos de seção de 34px para 22px, sem a linha embaixo, ícones de 42px para 28px.
- 174: caixa do CV com o mesmo tratamento dos cards de números (raio 22 + hover rosa); download só pelo botão.
- 175: todos os botões de ação unificados no tratamento do CTA do hero (preto, pílula, 13/700, hover vermelho).
- 176: formulário de contato com fundo branco, sem raio e réguas no topo/base; campos cinza com hover/focus animados.
- 177: grade de projetos limitada a 3 colunas e à largura do conteúdo (cards maiores em telas largas).
- 178: grade de projetos volta a ocupar toda a largura do navegador (3 colunas, margens de 20px).
- 179: inversão no hero — o retrato com os olhos que seguem o cursor vira o fundo do hero, em escala grande, sangrando até a borda direita; frase, CTA e dica passam para a coluna da esquerda, sobre o fundo rosa da própria foto.
- 180: a antiga grade de ícones animados do hero vira uma faixa na seção Competências, no lugar da foto (tiles inteiros, sem cortar fileiras; lastro rosa no hover mantido).
- 181: responsivo do novo hero — abaixo de 1100px o retrato vira faixa no topo e o texto desce para baixo; no toque a dica dos olhos some e a grade de ícones usa menos tiles.
- 182: hero refeito — efeito dos olhos removido; a foto ganhou uma interferência de TV (tranco, faixas rasgadas, scanlines, chiado e linha de tracking) que dispara rápido a cada 10s (1ª vez ~4s, 260ms de duração); o texto do hero voltou ao tamanho original (6vh), agora sobrepondo o rosto, com CTA alinhado à esquerda.
- 183: **home refeita** com o hero "helix ribbon" (porta do componente React para HTML/CSS/JS): nome gigante em Anton sobre campo vermelho, retrato ao lado da saudação, e ao rolar as duas linhas se abrem, a fita 3D de projetos sobe girando e a grade de 7 projetos se acomoda (segura no fim para dar tempo de clicar). Arquivos novos: `helix.css` e `helix-hero.js`.
- 184: o restante do site (estatísticas, breve histórico, processos, competências, linha do tempo e CV) foi para a página interna **`sobre.html`**; o menu de lá aponta de volta para a home. O efeito de glitch/olhos saiu de vez.
- 185: a versão "helix ribbon" (183/184) foi copiada para a pasta **`claude 4`**; o `claude 2` volta ao estado anterior à inversão do hero — hero com a grade de ícones animados e a foto com os olhos em Competências.
- 186: texto de abertura acima das duas colunas de accordions em Processos (só sobre elas; a citação continua na coluna da esquerda), com ajuste leve de redação e quebra responsiva própria.
- 187: projeto Escola Aqui ganhou os textos de percurso — desafio, descoberta, fluxo do usuário, wireframes, UI/design system e aprendizados — com etiquetas de etapa, alt texts nas imagens e largura de leitura própria (`.proj-step`).
- 188: projeto Escola Aqui — etapas com o título padrão do site (h2 Fraunces vermelho), textos na largura total (sem o limite de 1040px) e nova "Linha do tempo do projeto" com 4 caixas numeradas no mesmo componente `.fronts` usado no Select.
- 189: projeto Select reorganizado — "O desafio" ganhou texto de verdade, linha do tempo com 4 caixas numeradas no topo, o corpo virou 4 etapas com título padrão (acervo, recomposição, interação e consistência), checklist dentro da etapa de recomposição, aprendizados em 3 parágrafos e alt texts revisados.
- 190: projeto Super Interessante reorganizado no mesmo padrão — desafio, linha do tempo com 4 caixas numeradas, 4 etapas com título do site (edição inteira, narrativa, dados e acabamento), intro dividida e aprendizados em dois parágrafos.
- 191: projeto Plataforma escrito e reorganizado — intro com o contexto (revista digital de arte contemporânea, criada do zero para tablets, projeto gráfico interativo com Tempo Design e Ricardo Van Steen), desafio, linha do tempo com 4 caixas, 4 etapas (do zero à tela, projeto gráfico, conteúdo navegável e curadoria/artigos), galeria de páginas maior em grade e aprendizados; alts revisados.
- 192: filtro de projetos — "Editorial" virou "Editorial digital" e Select, Super Interessante e Plataforma passaram a ter a categoria `editorial` além de `digital`.
- 193: filtro "Digital" virou "App" e só o Escola Aqui ficou nessa categoria; Select, Super e Plataforma ficaram só em Editorial digital, e o SGP passa a aparecer apenas em "Todos".
- 194: SGP entra também na categoria Web (junto de BV e Cia.).
- 195: cards de projeto ganharam a animação de entrada da fita do claude 4 (escala 1.4→1, rotateX 16°→0, blur 7px→0, vindo da borda da coluna ou de baixo, com stagger de 90ms por coluna), disparada por IntersectionObserver ao entrar na tela; visual dos cards mantido. Travei o overflow horizontal (html) para as entradas laterais não abrirem barra de rolagem.
- 196: entrada dos cards virou scroll-linked (como a fita do claude 4) — a animação é função da posição do scroll e reverte ao subir, em vez de acontecer uma única vez.
- 197: hero ganhou um carrossel 3D com os próprios ícones animados (16 tiles, giro ligado ao scroll), substituindo a grade de ícones de fundo; o texto foi para a coluna da esquerda e o carrossel para a direita. No mobile/tablet o carrossel é escondido e o texto volta ao centro.
- 198: o hero ganhou uma espiral grande atrás do texto (30 tiles de ícones, 1,5 volta, raio ~660px), girando com o scroll; a frase voltou para a largura total/centralizada. No mobile/tablet a espiral continua escondida.
- 199: tiles da espiral do hero quase dobraram de tamanho (84 → 150px, ícones 30 → 54px).
- 200: timeline com título + texto + barra de progresso fixos (sticky) enquanto os cards passam; a barra foi para baixo do texto; colunas internas dos cards padronizadas (1fr + 190px). O empilhamento dos cards ficou desligado de vez (como estava gostando) e o main perdeu o overflow-x: clip que quebrava o sticky.
- 201: o preto da frase do hero virou #C0272A (só o texto base; o trecho destacado continua no vermelho vivo).
- 202: o texto base do hero passou de #C0272A para #951B1D (mais vinho, separa melhor do vermelho vivo do destaque).
- 203: accordions de Processos ganharam números em Doto (01–05 na coluna UX, 01–03 na UI) e hover com o rótulo indo 6px para a direita e o chevron 6px para a esquerda; o mesmo hover foi aplicado ao accordion de Competências.
- 204: texto do "Breve histórico" reescrito (frases mais curtas, "design thinking" minúsculo, BV em vez de BV Bank, dois-pontos na frase da IA), mantendo o grifo.
- 205: a frase inicial do hero ficou em Fraunces 800 (o trecho destacado segue em 600, com a cor/grifo).
- 206: espiral do hero voltou a aparecer no mobile/tablet (estava com display:none): menos tiles (20), tiles fluidos (76px no celular, 150px no desktop), opacidade menor e posição mais baixa para não atrapalhar a leitura.
- 207: limpada a base da foto dos olhos (fx/foto_base.png): a íris/pupila original que ficava aparecendo atrás da íris que se move foi removida, mantendo a sombra da pálpebra. Backup em _check/foto_base_original.png.
- 209: a espiral do hero agora vaza para fora da área do hero (overflow visível + seção acima da seguinte), sem mudar posição, tamanho ou animação.
- 210: removido o giro 360° (rotateY) dos números dos cards de estatística no hover — no meio do giro o número sumia/espelhava, o que parecia uma piscada.
- 211: giro 360° dos números restaurado; piscada dos cards de competências resolvida tirando o balão do número do hover do card inteiro (agora só na barra). Cards ganharam a referência: números = branco + sombra rosa (hover rosa), timeline = como estava + sombra rosa, cards de fases das páginas internas = branco + raio 24px + sombra rosa (--sombra-rosa).
- 212: cards da linha do tempo ganharam raio só nas duas quinas de baixo (24px).
- 213: nos cards da timeline, "Local:" virou "Empresa:".
- 214: hover dos accordions (Processos e Competências) passou a ser o mesmo rosa dos cards de números (#ffdada).
- 215: cards de competências com o mesmo raio dos cards de números (22px) e o tooltip do número voltou a abrir assim que o mouse entra no card.
- 216: experimento: ícones da espiral do hero em branco (tiles mais transparentes para os ícones aparecerem).
- 217: frase final do texto de Processos reescrita e com o mesmo grifo animado do "Breve histórico".
- 218: parágrafos corridos passaram de Montserrat 400 para 500 (mais peso no mobile e no desktop).
- 219: cards de competências ganharam a mesma sombra rosa (--sombra-rosa) dos cards de números.
- 220: caixa "Baixar CV" com o mesmo tratamento dos cards de números (branco, raio 22, sombra rosa, hover rosa).
- 221: nas páginas de projeto, a intro virou uma grade de 6 colunas: período/empresa/texto/lista em 5 e a coluna de tags na última (1/6), à direita; no mobile empilha.
- 222: hero ganhou botão secundário "Baixar CV" ao lado de "Ver projetos" — pill branco com sombra rosa e hover rosa.
- 223: novo projeto "Ecossistema Solar BV" (projeto_ecossistemabv.html) seguindo o Figma: intro 2025/2026 + Banco BV, cenário/objetivo, processo em 4 etapas, artefatos de discovery, telas do produto, resultado da simulação e aprendizados. Card novo (web) na home. Textura de pontos do header aplicada no hero de todos os projetos.
- 224: heroes dos 8 projetos passaram a usar a mesma imagem dos thumbs da home; um véu rosa suave (gradiente) mantém o título legível e a textura de pontos continua por cima.
- 225: no projeto Ecossistema Solar BV o texto de abertura virou um parágrafo único; a lista de atividades ganhou 28px de respiro (em todos os projetos) e o fim dos Aprendizados ganhou 96px de espaço branco antes do rodapé (em todas as páginas de projeto).
- 226: heroes dos projetos ganharam blur progressivo conforme o scroll (volta ao foco ao subir): camada .hero-blur herda a imagem e recebe filter blur via hero-blur.js, com o hero recortando a camada.
- 227: parallax leve nos heroes dos projetos: a camada .hero-blur também desliza ~4,5% do scroll (além do blur), mantendo o enquadramento sem bordas.
- 228: navbar com backdrop blur (header "fosco"): como a barra é translúcida (só os pontos), tudo que passa por baixo dela fica desfocado; vale para todas as páginas que usam a navbar.
- 229: blur da navbar reduzido de 12px para 3px (bem mais sutil).
- 230: cards da Cia da Consulta e do SGP ficaram sem link para a página interna e o cursor no hover virou um círculo vermelho "Em breve" (texto branco); os demais continuam com o "Ver" preto.
- 231: thumb do SGP trocado para assets/projetos/sgp/img_thumb_sgp_secretariasp.png (no card da home e no hero do projeto).
- 232: no Ecossistema Solar BV, a seção "Resultado da simulação" (título + imagem) saiu; as 6 telas do protótipo ficaram numa galeria horizontal presa ao scroll (entram pela direita, saem pela esquerda, com legendas; depois a página volta a rolar na vertical). Legendas remapeadas (03 = dimensionamento + configuração, 04 = kits, 05 = resultado). O loader das páginas de projeto passou a liberar o scroll via documento (para o sticky da galeria funcionar).
- 233: a fileira horizontal do protótipo virou um slider com bullets no mesmo estilo dos bullets das frases de Processos (quadradinhos 14px, ativo preenchido); navegação por clique + swipe no mobile. Sem auto-rotação.
- 234: seção do protótipo renomeada para "Prototipação", bullets centralizados, legenda centralizada sob a imagem e imagens do slider maiores (68vh).
- 235: unificada a seção de Prototipação (um título só), sem a imagem "Mapa de conexões"; o texto de abertura do slider ficou em largura total e o slider vem logo abaixo.
- 236: slider do protótipo ganhou arraste no desktop (cursor mãozinha grab/grabbing), setas circulares nas laterais e swipe no touch; os wrappers .fotoprojetos passaram a ter fundo #F5F5F5 (imagens menores que a largura total ficam como os slides da referência).
- 237: Cenário e Objetivo viraram subtítulos acima do texto, no mesmo estilo do rótulo "Tags do projeto" (11px, caixa alta, cinza, espaçado).
- 238: todos os títulos das páginas de projeto ganharam a setinha fina preta (↗) antes do texto, sem animação, no mesmo desenho das setas do index.
- 239: setinha dos títulos de projeto virou uma seta para a direita (→), 18px.
- 240: espaço acima dos títulos das páginas de projeto dobrou (30 → 60 no desktop; 100 → 200 no mobile).
- 241: varredura nas páginas de projeto: os textos que ficavam abaixo das imagens foram movidos para cima delas (21 seções em BV Ecossistema, Escola Aqui, Plataforma, Select e Super). As legendas do slider seguem abaixo das imagens, como legenda.
- 242: seta dos títulos de projeto agora fica dentro de um quadradinho (28px, borda preta, raio 8, fundo branco), no mesmo desenho dos ícones dos títulos do index.
- 243: fundo #F5F5F5 dos conteúdos de imagem agora é só no projeto Ecossistema Solar BV (classe .proj-ecossistema); demais projetos voltaram ao branco.
- 244: card do Site BV Open também ficou "Em breve" (sem link, cursor vermelho).
- 245: Google Tag Manager (GTM-NCTXBX76) instalado no head de todas as páginas públicas (menos o fonte do CV), com o noscript do body; usei o snippet oficial do container no lugar do snippet misto (gtag) enviado.
- 246: GA4 (G-V5RLCHZQW0) instalado direto no head de todas as páginas públicas via gtag.js + config, junto do GTM. Se um dia criar a tag GA4 dentro do GTM, remover o gtag direto para não contar em dobro.
