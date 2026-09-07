# Validação desta versão

- Compilação de produção Next.js: concluída com sucesso, incluindo TypeScript.
- 28 páginas do sitemap: resposta HTTP 200 e conteúdo Econorte.
- Destinos dos seis links principais: presentes na página inicial.
- Cabeçalho compartilhado: presente em todas as páginas verificadas.
- Navegação interna: links HTML nativos, sem interceptação pelo roteador.
- Orçamento: gravado com sucesso no emulador oficial Netlify Blobs.
- PDF: salvo e recuperado pelo link do anexo, com tipo e conteúdo corretos.
- Rejeição de arquivos inválidos, origem externa e limite excedido: verificadas.
- Mobile: regras de cabeçalho fixo com áreas seguras, botão de 44 px, menu com
  rolagem própria, limite de altura e fechamento por Escape.

Para repetir os testes após `pnpm install` e `pnpm build`:

```sh
node verify-netlify.mjs
```

Os testes usam dados fictícios e armazenamento local. Não enviam mensagens
no WhatsApp e não publicam na Netlify. A implantação na conta do cliente e
a avaliação visual em dispositivos reais devem ser conferidas após a publicação.
