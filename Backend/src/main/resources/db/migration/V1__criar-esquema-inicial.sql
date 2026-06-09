-- 1. TABELA DE USUÁRIOS
CREATE TABLE users (
                       id UUID NOT NULL,
                       login VARCHAR(255) NOT NULL,
                       senha VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL, -- Convertido de ENUM para VARCHAR para compatibilidade universal
                       create_at TIMESTAMP WITH TIME ZONE NOT NULL,
                       updated_at TIMESTAMP WITH TIME ZONE,
                       created_by VARCHAR(255) NOT NULL,
                       updated_by VARCHAR(255),
                       CONSTRAINT pk_users PRIMARY KEY (id),
                       CONSTRAINT uk_users_login UNIQUE (login)
);

-- 2. TABELA DE PROFISSIONAIS (BARBEIROS)
CREATE TABLE profissional (
                              id UUID NOT NULL,
                              usuario_id UUID NOT NULL,
                              nome VARCHAR(255) NOT NULL,
                              cpf VARCHAR(255) NOT NULL,
                              telefone VARCHAR(255),
                              foto VARCHAR(255),
                              data_nascimeto DATE NOT NULL, -- Mantido o typo original da sua entidade para não quebrar o Java
                              status BOOLEAN,
                              CONSTRAINT pk_profissional PRIMARY KEY (id),
                              CONSTRAINT uk_profissional_usuario UNIQUE (usuario_id),
                              CONSTRAINT fk_profissional_usuario FOREIGN KEY (usuario_id) REFERENCES users (id)
);

-- 3. TABELA DE CLIENTES
CREATE TABLE clientes (
                          id UUID NOT NULL,
                          usuario_id UUID NOT NULL,
                          nome VARCHAR(255) NOT NULL,
                          cpf VARCHAR(255) NOT NULL,
                          telefone VARCHAR(255) NOT NULL,
                          data_nascimeto DATE NOT NULL,
                          status BOOLEAN NOT NULL,
                          CONSTRAINT pk_clientes PRIMARY KEY (id),
                          CONSTRAINT uk_clientes_cpf UNIQUE (cpf),
                          CONSTRAINT uk_clientes_usuario UNIQUE (usuario_id),
                          CONSTRAINT fk_clientes_usuario FOREIGN KEY (usuario_id) REFERENCES users (id)
);

-- 4. TABELA DE SERVIÇOS
CREATE TABLE servicos (
                          id UUID NOT NULL,
                          nome VARCHAR(255) NOT NULL,
                          preco NUMERIC(38, 2) NOT NULL,
                          duracao_minutos INTEGER NOT NULL,
                          ativo BOOLEAN,
                          create_at TIMESTAMP WITH TIME ZONE NOT NULL,
                          updated_at TIMESTAMP WITH TIME ZONE,
                          created_by VARCHAR(255) NOT NULL,
                          updated_by VARCHAR(255),
                          CONSTRAINT pk_servicos PRIMARY KEY (id)
);

-- 5. TABELA DE RELACIONAMENTO (PROFISSIONAL X SERVIÇOS)
CREATE TABLE profissional_servicos (
                                       id UUID NOT NULL,
                                       profissional_id UUID NOT NULL,
                                       servico_id UUID NOT NULL,
                                       CONSTRAINT pk_profissional_servicos PRIMARY KEY (id),
                                       CONSTRAINT fk_prof_serv_profissional FOREIGN KEY (profissional_id) REFERENCES profissional (id),
                                       CONSTRAINT fk_prof_serv_servico FOREIGN KEY (servico_id) REFERENCES servicos (id)
);

-- 6. TABELA DE DISPONIBILIDADE
CREATE TABLE profissional_disponibilidade (
                                              id UUID NOT NULL,
                                              profissional_id UUID NOT NULL,
                                              dia_semana INTEGER NOT NULL,
                                              hora_inicio TIME NOT NULL,
                                              hora_fim TIME NOT NULL,
                                              create_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                              updated_at TIMESTAMP WITH TIME ZONE,
                                              created_by VARCHAR(255) NOT NULL,
                                              updated_by VARCHAR(255),
                                              CONSTRAINT pk_prof_disponibilidade PRIMARY KEY (id),
                                              CONSTRAINT fk_prof_disp_profissional FOREIGN KEY (profissional_id) REFERENCES profissional (id)
);

-- 7. TABELA DE AGENDAMENTOS
CREATE TABLE agendamentos (
                              id UUID NOT NULL,
                              cliente_id UUID NOT NULL,
                              profissional_id UUID NOT NULL,
                              servico_id UUID NOT NULL,
                              data DATE NOT NULL,
                              horario_inicio TIME NOT NULL,
                              horario_fim TIME NOT NULL,
                              status VARCHAR(255) NOT NULL,
                              create_at TIMESTAMP WITH TIME ZONE NOT NULL,
                              updated_at TIMESTAMP WITH TIME ZONE,
                              created_by VARCHAR(255) NOT NULL,
                              updated_by VARCHAR(255),
                              CONSTRAINT pk_agendamentos PRIMARY KEY (id),
                              CONSTRAINT fk_agendamentos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id),
                              CONSTRAINT fk_agendamentos_profissional FOREIGN KEY (profissional_id) REFERENCES profissional (id),
                              CONSTRAINT fk_agendamentos_servico FOREIGN KEY (servico_id) REFERENCES servicos (id)
);