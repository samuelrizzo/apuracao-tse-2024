/**
 * Interface que representa um estado brasileiro com seu nome e sigla.
 */
export interface Estado {
    nome: string;
    sigla: string;
}

/**
 * Lista de estados brasileiros contendo seus respectivos nomes e siglas,
 * usada para validação de entradas em outros módulos.
 */
export const estados: Estado[] = [
    { nome: 'Acre', sigla: 'AC' },
    { nome: 'Alagoas', sigla: 'AL' },
    { nome: 'Amapá', sigla: 'AP' },
    { nome: 'Amazonas', sigla: 'AM' },
    { nome: 'Bahia', sigla: 'BA' },
    { nome: 'Ceará', sigla: 'CE' },
    { nome: 'Espírito Santo', sigla: 'ES' },
    { nome: 'Goiás', sigla: 'GO' },
    { nome: 'Maranhão', sigla: 'MA' },
    { nome: 'Mato Grosso', sigla: 'MT' },
    { nome: 'Mato Grosso do Sul', sigla: 'MS' },
    { nome: 'Minas Gerais', sigla: 'MG' },
    { nome: 'Paraná', sigla: 'PR' },
    { nome: 'Paraíba', sigla: 'PB' },
    { nome: 'Pará', sigla: 'PA' },
    { nome: 'Pernambuco', sigla: 'PE' },
    { nome: 'Piauí', sigla: 'PI' },
    { nome: 'Rio de Janeiro', sigla: 'RJ' },
    { nome: 'Rio Grande do Norte', sigla: 'RN' },
    { nome: 'Rio Grande do Sul', sigla: 'RS' },
    { nome: 'Rondônia', sigla: 'RO' },
    { nome: 'Roraima', sigla: 'RR' },
    { nome: 'Santa Catarina', sigla: 'SC' },
    { nome: 'Sergipe', sigla: 'SE' },
    { nome: 'São Paulo', sigla: 'SP' },
    { nome: 'Tocantins', sigla: 'TO' },
];
