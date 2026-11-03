# MiniRP — Novo Mundo / Direção visual 3/4 (Alpha 0.1)

Esta é uma **cena jogável de avaliação artística**, com os PNGs originais que você enviou, não uma versão completa do jogo. A intenção é comparar perspectiva, tamanho de personagem, fachadas, ruas e veículos **antes** de construirmos a cidade grande.

## O que existe

- Câmera com visual de cima mostrando as fachadas dos prédios (top-down 3/4, sem isometria ou 3D).
- Rua principal, vias secundárias e algumas ruas em L; quarteirões com formatos e tamanhos distintos.
- Calçada, asfalto, faixas e parque feitos com **tiles originais do pacote gratuito Nasha's Modern City: City Park**.
- Fachadas inteiras de **Ranitaya's City Essential**; lanchonetes, veículos e personagens originais da **amostra gratuita de Nasha's City Folk & Streets**.
- NPCs de demonstração, árvores, bancos, flores, praça, comércio, minimapa, interação simples e câmera com zoom.
- Teclado no computador e botões/joystick em telas móveis.

## O que NÃO existe ainda

- Não há sistemas completos de RP, interiores, missão, inventário ou organizações.
- Não há dirigibilidade: a amostra grátis só tem um ângulo de cada veículo, então girar o carro sem as quatro direções ficaria errado.
- Não há animações direcionais de caminhada: os personagens dos ZIPs são PNGs estáticos, não spritesheets de animação.
- Os prédios Ranitaya são fachadas com frente exposta, mas a perspectiva e as proporções **não são perfeitamente iguais às de Nasha**. Ainda precisamos aprovar isso antes de expandir.
- A ambientação urbana está em estágio de demonstração, não representa a arte final.

## Testar no GitHub Pages

1. **Guarde uma cópia do repositório antigo** antes de apagá-lo.
2. Crie um repositório **privado** para essa fase inicial do MiniRP. O projeto inclui sprites de terceiros com licença específica; não faça um repositório público que pareça distribuir um pacote de assets.
3. Coloque o **conteúdo do ZIP** (não a pasta externa) na raiz do novo repositório.
4. Para testar no GitHub Pages, ele precisa estar habilitado nas opções da sua conta e do repositório. No **Settings → Pages** escolha a branch de publicação. Revise as permissões de acesso antes de publicar os sprites.
5. Entre na página e clique **ENTRAR NO BAIRRO**.

**Alternativa local:** na pasta descompactada execute `python -m http.server 8000` e acesse `http://localhost:8000/`. Abrir o HTML diretamente como `file://` pode bloquear a carga do JSON por segurança do navegador.

## Controles

- **WASD** ou **setas** — andar.
- **Shift** — correr.
- **E** — examinar o prédio ou ponto de interesse próximo.
- **M** — mapa completo (também permite escolher uma área para visitar).
- **1** — ir direto ao comércio, **2** — parque, **3** — bairro sul (atalhos para avaliação visual).
- **+** e **−** — zoom.
- **Mobile** — analógico na esquerda e botões na direita.

## Licenças e autoria

- **Nasha's Modern City — City Folk & Streets, Free Sample:** https://nanasha.itch.io/nashas-modern-city-city-folk-streets
- **Nasha's Modern City — Free City Park:** https://nanasha.itch.io/nashas-modern-city-free-city-park
- **Ranitaya's 50+ City Essential:** https://ranitaya-studios.itch.io/ranitayas-city-essential

Os dois arquivos LICENSE originais do Nasha acompanham este projeto em `LICENCAS/`. Eles permitem uso em jogos e projetos comerciais, mas **proíbem redistribuir os PNGs como pacotes de sprites independentes**, inclusive modificados. Não os use para treinar IA. Os gráficos não foram criados por OpenAI, nem devem ser atribuídos a ela.

O Ranitaya é divulgado como gratuito e royalty-free para projetos pessoais e comerciais em sua página oficial. O ZIP enviado não continha arquivo LICENSE próprio, então consulte as condições na página do artista antes de redistribuir o projeto ou publicar o código-fonte com seus PNGs.

**Os ZIPs que você enviou não foram alterados.** Este jogo utiliza uma seleção pequena de PNGs integrados, necessários para exibir a cena; não inclui os arquivos `.aseprite`, spritesheets completos ou os pacotes inteiros.

## Desenvolvimento

- `game.js`: canvas, renderização por profundidade `y`, movimentação e interações.
- `index.html`, `style.css`: interface e controles.
- `background.png`: mapa montado usando texturas originais do Nasha.
- `asset_manifest.json`: origem e dimensões de cada sprite integrado.
- `assets/`: PNGs originais individuais usados no teste.

Este pacote é uma nova base de visualização, **não uma promessa de que os três estilos já se encaixam perfeitamente**. A avaliação visual do usuário decide a continuidade.
