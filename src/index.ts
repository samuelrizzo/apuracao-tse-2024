import { FirefoxBrowser } from './browsers/firefoxBrowser';
import { TSEScraper } from './scrapers/tseScraper';
import readline from 'readline';
import { estados, Estado } from './models/estados';

/**
 * Função que faz uma pergunta ao usuário através do console.
 * Utiliza a biblioteca `readline` para capturar a entrada do usuário.
 * 
 * @param {string} query - A pergunta a ser exibida ao usuário.
 * @returns {Promise<string>} A Promise que resolve com a resposta do usuário, com os espaços em branco removidos.
 */
function askLocation(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }));
}

/**
 * Exibe no console a lista de estados brasileiros disponíveis.
 * A função itera sobre a lista de estados importada do arquivo `estados.ts`
 * e exibe cada estado com seu índice, nome e sigla.
 * 
 * @returns {void} A função não retorna nada, apenas exibe a lista de estados.
 */
function mostrarEstados(): void {
    console.log('\nLista de Estados Brasileiros:');
    estados.forEach((estado, index) => {
        console.log(`${index + 1}. ${estado.nome} – ${estado.sigla}`);
    });
    console.log('');
}

/**
 * Função principal que controla o fluxo de execução do scraping dos resultados do TSE.
 * Navega até o site do TSE, pede que o usuário selecione um estado e uma cidade,
 * e então realiza a raspagem dos resultados. Além disso, pergunta ao usuário o intervalo
 * de tempo em segundos para atualizar os resultados e configura uma função de refresh
 * que recarrega a página e executa o scraping a cada intervalo definido.
 * 
 * @returns {Promise<void>} Uma Promise que resolve quando todo o processo estiver completo.
 */
async function main(): Promise<void> {
    const firefoxBrowser = new FirefoxBrowser();
    console.log("Iniciando captura...");
    await firefoxBrowser.launch();

    const tseScraper = new TSEScraper(firefoxBrowser);

    let tentativas = 0;
    const maxTentativas = 3;

    try {
        while (tentativas < maxTentativas) {
            try {
                await tseScraper.navigateToTSE();
                break;
            } catch (error) {
                tentativas++;
                console.error("ERRO: Erro ao carregar a página, iremos tentar novamente.");
                if (tentativas >= maxTentativas) {
                    throw new Error("Falha ao tentar carregar a página após várias tentativas.");
                }
            }
        }

        let estadoInput: string;
        while (true) {
            estadoInput = await askLocation('Digite o estado (por exemplo, SP) ou 1 para ver a lista de estados: ');
            if (estadoInput === '1') {
                mostrarEstados();
            } else {
                const estadoValido: Estado | undefined = estados.find(
                    estado => estado.sigla.toLowerCase() === estadoInput.toLowerCase() ||
                        estado.nome.toLowerCase() === estadoInput.toLowerCase()
                );
                if (estadoValido) {
                    estadoInput = estadoValido.sigla;
                    break;
                } else {
                    console.log('Estado inválido. Por favor, tente novamente.\n');
                }
            }
        }

        await tseScraper.fillInState(estadoInput);

        const cidadesDisponiveis = await tseScraper.getCityOptions();

        let cidadeInput: string;
        while (true) {
            cidadeInput = await askLocation('Digite a cidade (por exemplo, São Paulo) ou 1 para ver a lista de cidades: ');
            if (cidadeInput === '1') {
                console.log('\nLista de Cidades:');
                cidadesDisponiveis.forEach((cidade, index) => {
                    console.log(`${index + 1}. ${cidade}`);
                });
                console.log('');
            } else {
                const cidadeValida = cidadesDisponiveis.find(
                    cidade => cidade.toLowerCase() === cidadeInput.toLowerCase()
                );
                if (cidadeValida) {
                    cidadeInput = cidadeValida;
                    break;
                } else {
                    console.log('Cidade inválida. Por favor, tente novamente.\n');
                }
            }
        }

        await tseScraper.fillInCity(cidadeInput);

        const refreshInterval = await askLocation('De quanto em quanto tempo deseja atualizar os resultados? (em segundos) ');
        const refreshIntervalMs = parseInt(refreshInterval, 10) * 1000; // Converte para milissegundos.

        await tseScraper.scrapeResults();

        setInterval(async () => {
            try {
                console.clear();
                console.log(`Atualizando os resultados...`);
                await firefoxBrowser.getPage().reload();
                await tseScraper.scrapeResults();
            } catch (error) {
                console.error('Erro durante o processo de refresh:', error);
            }
        }, refreshIntervalMs);

    } catch (error) {
        console.error('Ocorreu um erro durante o scraping:', error);
    }
}

// Chama a função principal e trata possíveis erros.
main().catch(err => console.error("Erro na execução da main:", err));
