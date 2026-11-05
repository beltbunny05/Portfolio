# Portfólio de Vitor Coelho

Projeto React organizado em um shell e quatro microfrontends. O HTML antigo foi removido; os arquivos `index.html` em cada aplicação são os pontos de entrada necessários ao Vite.

## Executar

Requisitos: Node.js 22.12 ou superior e npm.

```sh
npm install
npm run dev
```

Abra http://127.0.0.1:5100. O shell tem atualização React via Vite. Os remotos são recompilados automaticamente; recarregue a página depois de editá-los.

```sh
npm run build
npm run preview
```

## Onde alterar cada coisa

| Caminho                          | Responsabilidade                               |
| -------------------------------- | ---------------------------------------------- |
| `apps/shell/src/components`      | Cabeçalho, rodapé e indicador de rolagem       |
| `apps/shell/src/microfrontends`  | Manifesto, carregamento e tratamento de falhas |
| `apps/shell/src/navigation`      | Navegação entre seções e Shadow DOM            |
| `apps/profile/src`               | Apresentação e tecnologias                     |
| `apps/projects/src/projects.js`  | Dados dos projetos                             |
| `apps/career/src/career.js`      | Experiências, formação e habilidades           |
| `apps/contact/src/contact.js`    | Email e redes sociais                          |
| `packages/ui`                    | Componentes visuais e estilos compartilhados   |
| `packages/microfrontend-runtime` | Montagem, isolamento e desmontagem dos remotos |

Os arquivos `App.jsx` compõem as interfaces. Dados repetidos ficam em objetos com campos nomeados, próximos da aplicação que os utiliza. O CSS usa nomes descritivos. Componentes são extraídos quando representam uma responsabilidade ou um padrão reutilizável.

## Como os microfrontends se conectam

O shell lê `apps/shell/public/microfrontends.json` e importa cada URL em tempo de execução. Ele não importa os componentes dos outros apps. Cada remoto gera seu próprio `dist`, tem seu React root e usa Shadow DOM para isolar os estilos.

O contrato entre aplicações é:

```js
const unmount = remote.mount(element, {
  onReady: () => {},
  onError: (error) => {},
});
unmount();
```

`onReady` informa que a interface foi montada; `onError` informa falhas de renderização. O shell trata erros de rede, indica carregamento e permite novas tentativas. Os componentes React e o estado não atravessam essa fronteira. Links por hash conectam as seções.

`packages/ui` contém apresentação; `packages/microfrontend-runtime` gerencia o ciclo de vida. Os pacotes são incorporados ao build de cada consumidor. Alterá-los não atualiza um remoto que já foi publicado.

A composição usa módulos ES nativos. Cada remoto inclui seu React: isso permite independência de versões em tempo de execução, com o custo de baixar mais JavaScript. O monorepo facilita a manutenção do código, mas não exige deploy conjunto.

## Trabalhar em um único remoto

```sh
npm run dev -w @portfolio/projects
npm run build -w @portfolio/projects
npm run preview -w @portfolio/projects
```

O primeiro comando abre o remoto isolado, com atualização Vite. O último serve o módulo compilado `/entry.js`. Portas locais: shell 5100, profile 5101, projects 5102, career 5103 e contact 5104.

## Verificar alterações

```sh
npm run format
npm run format:check
npx playwright install chromium
npm run build
npm test
```

Encerre o modo de desenvolvimento antes de rodar os testes, pois eles usam as mesmas portas. Os testes usam os builds de produção e verificam composição, navegação, recuperação de falhas e layout móvel. `npm test` inicia e encerra os servidores de preview automaticamente; execute `npm run build` antes dos testes após alterar o código.

## Publicar separadamente

Publique o `dist` de cada remoto em uma hospedagem estática, incluindo todos os arquivos emitidos. Configure CORS na hospedagem para aceitar a origem HTTPS do shell e sirva JavaScript com o MIME correto. As opções CORS do Vite atendem apenas ao desenvolvimento local.

Altere `dist/microfrontends.json` do shell para apontar às URLs publicadas, por exemplo `https://projects.seudominio.com/v1/entry.js`. O manifesto é configuração de execução; mudar uma URL não exige recompilar o shell. Para rollback, restaure a URL anterior.

Use URLs versionadas ou cache curto no manifesto e nos pontos de entrada. Preserve os arquivos das versões ainda em uso. O projeto não publica automaticamente e não contém backend.

As animações respeitam a preferência por movimento reduzido. A navegação oferece link para pular ao conteúdo, foco visível e links semânticos.

Referências: [Vite Library Mode](https://vite.dev/guide/build.html#library-mode) e [React createRoot](https://react.dev/reference/react-dom/client/createRoot).
