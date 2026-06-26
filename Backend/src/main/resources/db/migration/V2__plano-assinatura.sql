-- 8. TABELA DE PLANOS DE ASSINATURA
CREATE TABLE plano_assinatura (
    id UUID NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco_mensal NUMERIC(38, 2) NOT NULL,
    usos_por_semana INTEGER NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_plano_assinatura PRIMARY KEY (id)
);

-- 9. TABELA DE ASSINATURAS DE CLIENTES
CREATE TABLE assinatura_cliente (
    id UUID NOT NULL,
    cliente_id UUID NOT NULL,
    plano_id UUID NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_assinatura_cliente PRIMARY KEY (id),
    CONSTRAINT fk_assinatura_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id),
    CONSTRAINT fk_assinatura_plano FOREIGN KEY (plano_id) REFERENCES plano_assinatura (id)
);
