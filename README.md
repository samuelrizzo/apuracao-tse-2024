
# Resultados TSE 2024

Este projeto foi desenvolvido para realizar a raspagem de dados dos resultados eleitorais disponibilizados pelo site do TSE (Tribunal Superior Eleitoral). Utilizando **Playwright** e **TypeScript**, o sistema permite a extração de informações de candidatos e resultados por estado e cidade, com atualizações periódicas conforme o intervalo definido pelo usuário.

## Índice
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Instalação

Siga os passos abaixo para configurar e rodar o projeto localmente:

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/resultados-tse-2024.git
   cd resultados-tse-2024
   ```

2. Instale as dependências do projeto:

   ```bash
   npm install
   ```

3. Certifique-se de ter o Playwright instalado:

   ```bash
   npx playwright install
   ```

## Configuração

Antes de rodar o projeto, você pode configurar o intervalo de atualização dos dados, conforme descrito na seção [Como Usar](#como-usar).

## Como Usar

1. Execute o projeto em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

2. O sistema solicitará que você selecione um estado e uma cidade para visualizar os resultados. Além disso, você poderá definir o intervalo de tempo em segundos para que os dados sejam atualizados automaticamente.

3. A cada atualização, o terminal será limpo e os novos dados serão exibidos.

Exemplo de execução no terminal:
```bash
Digite o estado (por exemplo, SP) ou 1 para ver a lista de estados: SP
Digite a cidade (por exemplo, São Paulo) ou 1 para ver a lista de cidades: São Paulo
De quanto em quanto tempo deseja atualizar os resultados? (em segundos) 60
```

4. Após a primeira execução, o sistema atualizará os dados a cada 60 segundos (ou conforme o intervalo definido).

## Contribuição

Contribuições são bem-vindas! Se você quiser melhorar o projeto, siga os passos abaixo:

1. Fork este repositório.
2. Crie uma nova branch para a sua feature ou correção: `git checkout -b minha-feature`.
3. Faça as alterações necessárias e commit: `git commit -m 'Adiciona nova feature'`.
4. Envie para o seu fork: `git push origin minha-feature`.
5. Abra um pull request no repositório original.

## Licença

Este projeto é **open source** e está disponível para qualquer pessoa usar, modificar e distribuir para fins educacionais. Sinta-se à vontade para adaptá-lo como desejar. No entanto, não oferecemos garantias ou suporte oficial. O projeto foi criado com o objetivo de aprender e compartilhar conhecimento. Para mais detalhes, consulte a [Licença MIT](LICENSE).
