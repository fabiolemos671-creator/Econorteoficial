# Econorte — versão Netlify

Esta pasta contém o site completo em Next.js, com 28 páginas, navegação direta,
cabeçalho flutuante responsivo, catálogo com filtros e orçamento com anexos.

## Publicação recomendada

1. Extraia o ZIP e envie **o conteúdo desta pasta** para um repositório Git.
2. Na Netlify, escolha **Add new project → Import an existing project** e conecte o repositório.
3. Selecione a pasta que contém `package.json` e `netlify.toml` como base do projeto.
4. Comando de compilação: `pnpm build`. Diretório de publicação: `.next`.
5. Publique. A Netlify reconhece Next.js e configura o runtime automaticamente.

Não use o envio por arrastar pasta do Netlify Drop: este site precisa de compilação
e funções de servidor para armazenar o orçamento e seus anexos.

## Publicação pelo terminal (alternativa)

Com Node.js 22.13 ou superior e pnpm 11.19 instalados, nesta pasta:

```sh
pnpm install --frozen-lockfile
pnpm dlx netlify-cli login
pnpm dlx netlify-cli init
pnpm dlx netlify-cli deploy --build --prod
```

O login é feito na sua conta Netlify. Não inclua senhas ou tokens nos arquivos.

## Formulário e arquivos

- Os dados e anexos ficam no Netlify Blobs, no armazenamento `econorte-quotes`.
- Não é necessário Cloudflare R2 nem chave de API no navegador.
- O runtime da Netlify fornece as credenciais de Blobs automaticamente.
- Aceita até 3 arquivos PDF, JPG, PNG ou WebP, somando até 3 MB.
- Ao finalizar, o visitante abre o WhatsApp e envia a mensagem preparada.
  Preparar os dados no site não envia a mensagem automaticamente.
- Os anexos têm links longos e não listáveis. Quem recebe o link pode baixá-los.
- A equipe pode consultar os pedidos na área Blobs do painel Netlify.

## Domínio e informações da empresa

O SEO usa automaticamente a variável `URL` fornecida pela Netlify.
Para domínio próprio, configure `SITE_URL=https://seu-dominio.com.br` e publique novamente.
Não deixe uma barra ou caminho extra no domínio.

Telefone e Instagram estão em `app/site-shell.tsx` e `app/[...slug]/page.tsx`.
Materiais, referências e artigos estão em `lib/content.ts`.
O destino do orçamento está em `app/api/orcamento/route.ts`.
As imagens ilustrativas continuam identificadas; não representam obras comprovadas.

## Verificação depois de publicar

Abra o endereço da Netlify, navegue pelo menu e pelo catálogo, teste os filtros e
o menu mobile. Envie um orçamento de teste com um pequeno PDF, abra o WhatsApp
sem enviar uma mensagem real e confira o link do anexo.

O armazenamento remoto depende da implantação na sua conta. `pnpm dev` sozinho
mostra as páginas, mas não inicializa o ambiente Netlify Blobs; para o fluxo completo
local, use `pnpm dlx netlify-cli dev` depois de vincular o projeto.

## Referências oficiais

- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/

Esta versão é independente do site anteriormente hospedado no ChatGPT Sites.
