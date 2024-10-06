import { firefox, Page, Browser, BrowserContext } from 'playwright';

/**
 * Classe responsável por gerenciar o navegador Firefox utilizando Playwright.
 * Ela controla o ciclo de vida do navegador, contexto e página, e oferece
 * métodos para inicializar, fechar e acessar a página do navegador.
 */
export class FirefoxBrowser {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private page: Page | null = null;

    /**
     * Cria uma instância de FirefoxBrowser.
     * Inicializa o estado do navegador, contexto e página como nulos.
     */
    constructor() { }

    /**
     * Lança o navegador Firefox de forma headless com permissões de geolocalização
     * e permite o download de arquivos. Se o navegador já estiver aberto, ele é fechado
     * antes de relançar.
     * 
     * @returns {Promise<void>} Uma Promise que resolve quando o navegador for lançado.
     */
    async launch(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }

        this.browser = await firefox.launch({ headless: true });
        this.context = await this.browser.newContext({
            permissions: ['geolocation'],
            geolocation: { latitude: 0, longitude: 0 },
            acceptDownloads: true,
        });

        this.page = await this.context.newPage();
    }

    /**
     * Fecha a página, o contexto e o navegador, caso estejam abertos. 
     * Define todos como nulos após o fechamento.
     * 
     * @returns {Promise<void>} Uma Promise que resolve quando todos os recursos forem fechados.
     */
    async close(): Promise<void> {
        if (this.page) {
            await this.page.close();
        }
        if (this.context) {
            await this.context.close();
        }
        if (this.browser) {
            await this.browser.close();
        }
    }

    /**
     * Retorna a página ativa do navegador. Se a página ainda não tiver sido inicializada,
     * lança um erro.
     * 
     * @returns {Page} A página ativa do navegador.
     * @throws {Error} Se a página não tiver sido inicializada.
     */
    getPage(): Page {
        if (!this.page) {
            throw new Error('A página não foi inicializada. Certifique-se de chamar launch() primeiro.');
        }
        return this.page;
    }

    /**
     * Aguarda por um tempo especificado em milissegundos. Se a página não tiver sido inicializada,
     * lança um erro.
     * 
     * @param {number} milliseconds - Tempo de espera em milissegundos.
     * @returns {Promise<void>} Uma Promise que resolve após o tempo de espera.
     * @throws {Error} Se a página não tiver sido inicializada.
     */
    async waitForTimeout(milliseconds: number): Promise<void> {
        if (!this.page) {
            throw new Error('A página não foi inicializada. Certifique-se de chamar launch() primeiro.');
        }
        await this.page.waitForTimeout(milliseconds);
    }
}
