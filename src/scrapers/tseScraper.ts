import { FirefoxBrowser } from '../browsers/firefoxBrowser';

/**
 * Classe responsável por realizar a raspagem de dados no site do TSE.
 * Ela navega pela interface, preenche informações e extrai resultados
 * de candidatos utilizando Playwright.
 */
export class TSEScraper {
    private browser: FirefoxBrowser;

    /**
     * Construtor da classe TSEScraper. Inicializa o raspador com uma instância
     * de navegador fornecida.
     * 
     * @param {FirefoxBrowser} browser - Instância do navegador Firefox.
     */
    constructor(browser: FirefoxBrowser) {
        this.browser = browser;
    }

    /**
     * Navega até a página de resultados do TSE, aguarda o carregamento
     * do conteúdo e seleciona a opção Brasil no site.
     * 
     * @returns {Promise<void>} Uma Promise que resolve após a navegação e seleção.
     */
    async navigateToTSE(): Promise<void> {
        const page = this.browser.getPage();

        await this.browser.waitForTimeout(3000);
        await page.goto('https://resultados.tse.jus.br');
        await page.waitForLoadState('domcontentloaded');
        await page.click('text=Brasil');
    }

    /**
     * Preenche o campo de estado no site do TSE com a sigla fornecida,
     * utilizando interações com a interface do site.
     * 
     * @param {string} estado - Sigla do estado a ser selecionado no site.
     * @returns {Promise<void>} Uma Promise que resolve após o preenchimento.
     */
    async fillInState(estado: string): Promise<void> {
        const page = this.browser.getPage();
        await page.click('input[formcontrolname="uf"]');
        await page.fill('input[formcontrolname="uf"]', estado);
        await page.waitForSelector('#mat-autocomplete-0 mat-option');
        await page.click(`mat-option:has-text("${estado}")`);
    }

    /**
     * Preenche o campo de cidade no site do TSE com o nome da cidade
     * fornecida.
     * 
     * @param {string} cidade - Nome da cidade a ser preenchida.
     * @returns {Promise<void>} Uma Promise que resolve após o preenchimento.
     */
    async fillInCity(cidade: string): Promise<void> {
        const page = this.browser.getPage();
        await page.click('input[formcontrolname="municipio"]');
        await page.fill('input[formcontrolname="municipio"]', cidade);
        await page.waitForSelector('#mat-autocomplete-1 mat-option');
        await page.click(`mat-option:has-text("${cidade}")`);
        await page.click('text=Confirmar');
    }

    /**
     * Obtém uma lista de opções de cidades disponíveis no site do TSE
     * para o estado selecionado.
     * 
     * @returns {Promise<string[]>} Uma lista de nomes de cidades.
     */
    async getCityOptions(): Promise<string[]> {
        const page = this.browser.getPage();
        await page.waitForSelector('#mat-autocomplete-1 mat-option');
        const cidades = await page.$$eval('#mat-autocomplete-1 mat-option .mdc-list-item__primary-text', spans =>
            spans.map(span => span.textContent?.trim() || '')
        );
        return cidades;
    }

    /**
     * Realiza a raspagem dos resultados dos candidatos na página atual,
     * extraindo dados como nome, porcentagem de votos, total de votos
     * e partido de cada candidato.
     * 
     * @returns {Promise<void>} Uma Promise que resolve após a raspagem.
     */
    async scrapeResults(): Promise<void> {
        const page = this.browser.getPage();
        const candidatosElements = await page.$$('app-cartao-candidato');
        console.log(`Número de candidatos encontrados: ${candidatosElements.length}`);

        const candidatos: Array<{ nome: string; porcentagem: string; totalVotos: string; partido: string }> = [];

        for (const el of candidatosElements) {
            const nomeElement = await el.$('div.font-bold.text-2xl.tracking-tight:not(.text-ion-tertiary)');
            const nome = nomeElement ? (await nomeElement.textContent())?.trim() ?? 'Nome não encontrado' : 'Nome não encontrado';

            const porcentagemElement = await el.$('div.font-bold.mb-1.text-2xl.text-ion-tertiary.tracking-tight');
            const porcentagem = porcentagemElement ? (await porcentagemElement.textContent())?.trim() ?? '0,00%' : '0,00%';

            const totalVotosElement = await el.$('.text-gray-600.text-xs');
            const totalVotos = totalVotosElement ? (await totalVotosElement.textContent())?.trim() ?? '0 votos' : '0 votos';

            const partidoElement = await el.$('.text-gray-550.text-xs');
            const partido = partidoElement ? (await partidoElement.textContent())?.trim() ?? 'Partido não encontrado' : 'Partido não encontrado';

            candidatos.push({ nome, porcentagem, totalVotos, partido });
        }

        candidatos.forEach(candidato => {
            console.log(
                `\x1b[0mNome: \x1b[32m${candidato.nome}\x1b[0m, Porcentagem: \x1b[32m${candidato.porcentagem}\x1b[0m, Total de Votos: \x1b[32m${candidato.totalVotos}\x1b[0m, Partido: \x1b[32m${candidato.partido}\x1b[0m`
            );

        });
    }
}
