# Protótipo — Portal do Aluno & Candidato Behring

Protótipo de alta fidelidade do projeto de SCC0560 — Interação Humano-Computador e Experiência do Usuário (ICMC-USP, 2026), Parte 3: Prototipação.

Grupo: Letícia Raddatz Jönck, Miguel Rodrigues Tomazini e Victor Moreli dos Santos.

HTML, CSS e JavaScript puros, sem dependências; os dados são simulados (não há banco de dados nem envio real de arquivos).

## Acesso online

O protótipo está publicado pelo GitHub Pages. Use o painel escuro no canto inferior direito para trocar o cenário de teste. A comparação das direções de estilo consideradas está em `estilos/`.

O protótipo de média fidelidade (mesmas telas) está no Figma: https://www.figma.com/design/fe3F2GhmJeme4iZtepaoLT

## Como abrir localmente

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Depois acesse http://127.0.0.1:8765. O painel escuro no canto inferior direito troca o cenário de teste.

## Cenários

| Cenário (`?s=`) | Data simulada | Situação de Kira |
|---|---|---|
| `inscricao` | 20/10/2026 | Inscrição do Behring Scholars parada na etapa 2 |
| `revisao` | 20/10/2026 | Inscrição completa, faltando só o comprovante de renda (usado nas capturas) |
| `correcao` | 06/11/2026 | Inscrição enviada; comprovante de renda voltou para correção |
| `aguardando` | 14/11/2026 | Tudo enviado; aguardando a Fundação |
| `bolsa` | 10/08/2027 | Candidatura aprovada; bolsa ativa com entregas periódicas |

`?capture` esconde o painel de cenários (para capturas de tela e importação no Figma).

## Telas para importação no Figma

| Tela | URL |
|---|---|
| Login | `/?capture&s=correcao#/login` |
| Início — com pendência | `/?capture&s=correcao#/inicio` |
| Início — tudo em dia | `/?capture&s=aguardando#/inicio` |
| Programas | `/?capture&s=inscricao#/programas` |
| Programa e elegibilidade | `/?capture&s=inscricao#/programas/scholars` |
| Inscrição — etapa 2 | `/?capture&s=inscricao#/inscricao/2` |
| Inscrição — etapa 4 | `/?capture&s=revisao#/inscricao/4` |
| Revisão e envio | `/?capture&s=revisao#/inscricao/revisao` |
| Confirmação | `/?capture&s=correcao#/inscricao/confirmacao` |
| Página do processo | `/?capture&s=correcao#/processo/scholars` |
| Histórico | `/?capture&s=correcao#/processo/scholars/historico` |
| Meus documentos | `/?capture&s=correcao#/documentos` |
| Envio de documento | `/?capture&s=correcao#/documentos/enviar/matricula` |
| Correção de documento | `/?capture&s=correcao#/documentos/corrigir/renda` |
| Avisos | `/?capture&s=correcao#/avisos` |
| Bolsa ativa | `/?capture&s=bolsa#/bolsa` |
| Perfil | `/?capture&s=correcao#/perfil` |

As versões para celular usam as mesmas URLs com a janela em 390 px de largura (Início, Página do processo e Meus documentos).

## Fluxos para os testes com usuários

1. **Enviar a inscrição** (`revisao`): Revisão → Resolver → enviar comprovante → Enviar inscrição → protocolo.
2. **Corrigir um documento** (`correcao`): Início → Resolver → enviar novo arquivo → Início atualizado.
3. **Acompanhar durante a espera** (`aguardando`): Início "Tudo em dia" → processo → histórico.
4. **Verificar elegibilidade e retomar** (`inscricao`): Programas → Behring Scholars → Continuar inscrição.
5. **Bolsa ativa** (`bolsa`): Início → Bolsa → enviar entrega.
