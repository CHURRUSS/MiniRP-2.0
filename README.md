# MiniRP — Novo Mundo 3/4 | Alpha 0.3 — Personagens Animados

**Atualização real do projeto Alpha 0.2:** mantemos o bairro de ruas, parques, edifícios com escala corrigida e NPCs integrados à paisagem; substituímos o personagem estático por spritesheets **realmente animados** montados a partir dos arquivos enviados pelo usuário do pacote **Anokolisa World Build — Character Pack 0.2**.

## Novidades que você pode testar

- **Personagem controlável** com `idle` (4 frames), `walk` (6 frames), `run` (6 frames).
- Caminhada para **frente, costas, direita e esquerda**. O pacote inclui frente, costas e lateral; a lateral é espelhada para a quarta direção.
- **20 NPCs de demonstração**, com animação ao caminhar e **10 aparências básicas** derivadas do mesmo modelo (10 recolorações de roupas, cabelos e tons de pele). Não são 10 personagens originais diferentes do artista; todos usam a mesma base `Body_A`.
- Os sprites são **montagens pixel-perfect** de cinco partes originais: cabeça, tronco, braços e pernas. As cores foram adaptadas aos habitantes urbanos, sem substituição dos desenhos por formas simplificadas.
- **Escala das construções da Alpha 0.2 preservada**, sem diminuir novamente os prédios.
- Teclado, mapa, zoom, mini-mapa e controles touch mantidos.
- **Pasta `LICENCAS/`** inclui os termos do Anokolisa fornecidos com o ZIP, além dos textos do Nasha da versão anterior.

## Como abrir

1. Extraia o conteúdo deste ZIP (não envie o ZIP diretamente à raiz do repositório).
2. Coloque `index.html`, `game.js`, `style.css`, `background.png`, `asset_manifest.json`, `assets/`, `LICENCAS/` e `char_manifest.json` na raiz de um repositório de teste.
3. Configure GitHub Pages para servir os arquivos a partir da raiz da branch escolhida. **Revise as licenças de conteúdo de terceiros antes de disponibilizar um repositório público com os arquivos PNG acessíveis separadamente.**
4. Alternativa local: dentro da pasta, rode `python -m http.server 8000` e acesse `http://localhost:8000/`. Abrir diretamente como `file://` pode bloquear a leitura do JSON.

### Controles

| Ação | PC | Celular |
|---|---|---|
| Caminhar animado | WASD ou setas | Analógico |
| Correr animado | Shift | Segurar CORRER |
| Mapa | M | MAPA |
| Examinar | E | EXAMINAR |
| Visitar bairros | 1 comércio, 2 parque, 3 sul | Botões no mapa |
| Zoom | + / - | Botões no canto |

## O pacote de ambientes do Anokolisa

Também foi analisado **World Build — Environment Pack 0.4**, enviado pelo usuário. Ele inclui telhados, construções de madeira/brancas, árvores, pisos, plantações e cenas demonstrativas de casas/interiores. **Não foi integrado a este teste porque a linguagem rural/rústica de algumas construções não combina com o bairro urbano contemporâneo aprovado.** Os PNGs da cidade seguem sendo os de Nasha e Ranitaya, não inventados.

## Limites atuais

- Esta é uma cena de validação do visual e das animações, **não** a cidade completa nem os sistemas de RPG.
- O pacote Character 0.2 inclui uma base `Body_A`, sem um conjunto de roupas modernas prontas. As dez variações são edições dos pixels dessa mesma base, mantendo as animações. Roupas detalhadas e mais modelos serão uma evolução posterior.
- Os NPCs percorrem trajetos curtos de demonstração, não possuem ainda navegação por ruas, interações ou comportamentos de RP.
- Os veículos continuam sem direção: não temos sprite direcional completo do mesmo estilo de carros. Mantemos os sprites originais estáticos para evitar giros artificiais.
- O pacote de ambientes original **não** foi incluído neste ZIP; apenas o jogo funcional e os sprites derivados efetivamente usados.

## Licenças e autoria

- **Anokolisa:** https://anokolisa.itch.io/world-build-pack — `LICENCAS/ANOKOLISA_TERMS.txt` reproduz os termos incluídos no pacote enviado pelo usuário. Autorizam uso em projetos comerciais, adaptações de cor e forma; não autorizam comercializar os próprios assets como produto isolado.
- **Nasha City Park:** https://nanasha.itch.io/nashas-modern-city-free-city-park
- **Nasha City Folk & Streets Sample:** https://nanasha.itch.io/nashas-modern-city-city-folk-streets
- **Ranitaya City Essential:** https://ranitaya-studios.itch.io/ranitayas-city-essential

Os sprites e a arte original são dos respectivos artistas. A edição de cores e a integração no protótipo não transferem autoria. O projeto não deve ser apresentado como pacote independente de sprites para venda ou distribuição.
