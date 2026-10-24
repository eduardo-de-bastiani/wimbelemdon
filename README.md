# WimBelemDon • Clube de Benefícios & Doação (PoC Frontend)

Prova de conceito mobile-first construída exclusivamente com a tríade **HTML5, CSS3 e JavaScript**, projetada para validar hipóteses de UX/UI para a **Sociedade WimBelemDon**, localizada no bairro Belém Novo na zona sul de Porto Alegre - RS.

---

## 🎾 Sobre o Projeto

A WimBelemDon é um projeto social criado no ano 2000 que atende atualmente **90 crianças e jovens em situação de vulnerabilidade** (com capacidade máxima para 100), promovendo desenvolvimento integral através do tênis, cultura e apoio pedagógico.

Esta aplicação transforma a contribuição mensal ou eventual em um clube de vantagens com cupons de desconto em estabelecimentos parceiros no Rio Grande do Sul (Parque Esportivo PUCRS, Decathlon, Panvel, Outback, Cantina do Belém, etc.).

---

## 📱 Recursos & Telas Implementadas

1. **Moldura Mobile Adaptativa & Modo Apresentação**:
   - Simulação fidedigna de smartphone no desktop (status bar com relógio em tempo real, notch e proporções táteis).
   - Botão flutuante para alternar entre "Modo Celular" e "Modo Tela Cheia" com um clique.
   - Responsividade 100% nativa caso aberto diretamente em aparelhos celulares.

2. **Tela de Abertura (Splash Screen)**:
   - Apresentação do logo oficial da WimBelemDon com escala suave física (`scale(0.95 -> 1.0)`) e auto-avanço de 1.8 segundos ou toque imediato.

3. **Tela de Autenticação (Login & Cadastro)**:
   - Alternador segmentado tátil com micro-animações.
   - Login com botão de **⚡ Preenchimento Rápido para Apresentação**.
   - Cadastro completo (Nome, E-mail, Celular e CPF).
   - Soft Paywall de boas-vindas pós-cadastro com apresentação dos planos e opção de explorar o app primeiro.

4. **Página Inicial (Home)**:
   - Banner de boas-vindas personalizado com status do plano de apoio.
   - Métricas oficiais de impacto da instituição (90 educandos, 100 capacidade, 26 anos de história).
   - Feed de novidades e projetos reais (Audiovisual, Literatura Fantástica, Esporte & Valores).
   - **Mapa Interativo de Belém Novo (Leaflet.js & OpenStreetMap)** centralizado na sede oficial (`Av. Heitor Viêira, 68 - Belém Novo, Porto Alegre`) com pino personalizado e rota direta para Google Maps.
   - Carrossel de embaixadores (Fernando Meligeni, Thomaz Koch, Bruno Soares, Chef Lucas Corazza).

5. **Clube de Cupons (Estilo Voucher / Ticket)**:
   - Filtros rápidos por pílulas (*Todos, Esporte & Lazer, Gastronomia, Saúde & Farmácia, Comércio & Casa*).
   - Campo de busca instantânea por parceiro ou localidade.
   - Cards com recorte visual de picote de voucher e percentual de desconto em verde lima (`#82b700`).
   - Indicador explícito de cota disponível no mês (1 ou 2 resgates).
   - **Modal de Resgate com Código Alfanumérico**:
     - Formato padrão de grandes redes: `WBD-XXXX-YYYY` (ex: `WBD-9K2M-7P4Q`).
     - Botão de cópia com morphing visual de ícone e feedback.
     - **Botão "Concluído / Fechar" bloqueado/esmaecido** até o usuário efetuar a cópia do código.
     - Ao esgotar a cota mensal do estabelecimento, o botão é acinzentado com a mensagem *"Disponível em 1º de [Próximo Mês]"* e botão para rever o código emitido.

6. **Planos de Mensalidade & Doação Avulsa (Inspiração Google AI)**:
   - Carrossel horizontal snap-scroll com 3 níveis de apoio:
     - **Plano Amigo** (R$ 29,90/mês): Descontos de até 5%, 1 resgate/mês por parceiro.
     - **Plano Transformador** [Recomendado] (R$ 49,90/mês): Descontos de 5% a 10%, 1 resgate/mês por parceiro.
     - **Plano Padrinho Campeão** (R$ 89,90/mês): Descontos de 10% a 15%, até 2 resgates/mês em parceiros selecionados.
   - **Doação Avulsa Flexível**:
     - Botões pré-definidos (R$ 20, R$ 50, R$ 100, R$ 200).
     - **Campo livre para adicionar qualquer valor financeiro** digitado pelo usuário.
     - Libera 1 cupom de degustação e soma ao total doado.

7. **Aba Lateral de Perfil (Drawer Sheet)**:
   - Efeito de slide lateral suave da direita com backdrop blur.
   - Contador de **Valor total doado até o momento** (ex: `R$ 124,90`).
   - Contador de **Cupons resgatados**.
   - Botão de engrenagem para **edição de dados básicos** (Nome, E-mail, Celular, CPF).
   - Botão de **Reiniciar Demonstração (Reset Mock)** para zerar dados e reiniciar apresentações a qualquer momento.

---

## 🎨 Design Engineering (Emil Kowalski Specs)

- **Paleta de Cores**:
  - Branco Primário: `#ffffff` e superfícies `#f9fbfb`
  - Verde Lima Secundário: `#82b700`
  - Verde Petróleo Terciário: `#0e6872` e `#07454c`
- **Micro-interações Táteis**:
  - Botões com `:active scale(0.97)` e transição suave de 160ms (`cubic-bezier(0.23, 1, 0.32, 1)`).
  - Modais entram a partir de `scale(0.95)` e opacidade (nunca a partir de `scale(0)`).
  - Duração de animações de UI mantidas abaixo de 280ms para máxima percepção de agilidade.
- **Ícones**: Lucide Icons integrados localmente.

---

## 🚀 Como Executar Localmente

Não requer instalação de Node ou dependências externas. Qualquer servidor HTTP simples pode servir a aplicação:

```bash
# Com Python 3
python3 -m http.server 3000

# Ou com Node npx
npx serve .
```

Abra no navegador: [http://localhost:3000](http://localhost:3000)
