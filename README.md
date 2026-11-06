# Vitor Coelho · Portfolio

React + TypeScript, com um shell e quatro microfrontends independentes.

## Rodar

Node.js 22.12+:

```sh
npm install
npm run dev
```

Abra http://127.0.0.1:5100. O shell atualiza pelo Vite; após editar remotos, aguarde a compilação e recarregue a página. Para editar um módulo isolado: `npm run dev -w @portfolio/projects` (porta 5102).

## Onde editar

| O que                                        | Arquivo ou pasta                          |
| -------------------------------------------- | ----------------------------------------- |
| Apresentação e tecnologias                   | `apps/profile/src/App.tsx` e `profile.ts` |
| Projetos, estudos de caso e links            | `apps/projects/src/projects.ts`           |
| Experiência e formação                       | `apps/career/src/career.ts`               |
| Contato                                      | `apps/contact/src/contact.ts`             |
| Menu, email do cabeçalho e ordem dos módulos | `apps/shell/src/site.ts`                  |
| Layout de cada seção                         | `apps/<módulo>/src/App.tsx`               |
| Visual de cada aplicação                     | `apps/<módulo>/src/styles.css`            |
| Tema, layout e componentes comuns            | `packages/ui`                             |
| Título e metadados                           | `apps/shell/index.html`                   |

## Como funciona

`index.html → main.tsx → manifesto de URLs → App.tsx → módulos`.

O shell lê `apps/shell/public/microfrontends.json`. Cada módulo exporta `mount(element, { onReady, onError })`, que retorna `unmount()`. `packages/microfrontend-runtime` cuida da raiz React e do Shadow DOM. Cada app gera seu próprio `dist`; os pacotes compartilhados entram no build, sem store global.

## Validar e publicar

```sh
npm run format
npm run check
npm run build
npx playwright install chromium
npm test
```

Os testes usam as portas 6100–6104, sem interromper `dev`. O CI executa essas verificações automaticamente. O build gera HTML inicial com conteúdo, currículo imprimível e os bundles. Recompile o site após mudar conteúdo para atualizar esse HTML.

GitHub Pages: o workflow `Publish portfolio` valida e publica a branch `main`. Ative **Settings → Pages → Source: GitHub Actions**. Para validar o pacote local: `npm run build:pages && npm run test:pages`.

Para outras hospedagens, publique cada `apps/<módulo>/dist` separadamente. Configure CORS e atualize as URLs em `apps/shell/dist/microfrontends.json`; preserve chunks antigos ou use URLs versionadas. Defina a variável `SITE_URL` com seu domínio real antes do build para URLs absolutas de compartilhamento e canonical.

Edite o código-fonte; `dist` e `node_modules` são gerados. Links de demonstração são opcionais em `projects.ts`. Os fluxos ilustrados são diagramas, não capturas dos aplicativos.
