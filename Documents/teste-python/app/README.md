# 🚀 API de Foco

Este projeto é um backend para um **Log de Performance**, desenvolvido como parte de um desafio técnico. O objetivo é registrar sessões de trabalho/estudo, monitorar o nível de foco e gerar diagnósticos inteligentes de produtividade para o usuário.

## 🛠️ Tecnologias Utilizadas

* **FastAPI**: Framework web moderno e de alta performance.
* **Pydantic**: Validação de dados e definições de esquemas.
* **Uvicorn**: Servidor ASGI para rodar a aplicação.
* **Python 3.x**

## Estrutura do Projeto

O projeto foi estruturado utilizando princípios de separação de responsabilidades para garantir manutenibilidade e escalabilidade:

* `main.py`: Ponto de entrada da aplicação e configuração do FastAPI.
* `routers.py`: Definição das rotas (endpoints) e lógica de roteamento (Controllers).
* `models.py`: Modelos de dados e esquemas de validação (DTOs).
* `services.py`: Camada de regras de negócio e lógica de diagnóstico.
* `database.py`: Simulação da persistência de dados (atualmente em memória).

## Como Executar o Projeto

### 1. Configurar o Ambiente Virtual
No terminal, na raiz do projeto:
```bash
python -m venv venv
```

### 2. Ativar o Ambiente Virtual
* **Windows (Git Bash):** `source venv/Scripts/activate`
* **Linux/Mac:** `source venv/bin/activate`

### 3. Instalar Dependências
```bash
pip install fastapi "uvicorn[standard]" pydantic
```

### 4. Rodar o Servidor
Entre na pasta `app` e execute:
```bash
cd app
uvicorn main:app --reload
```

## Testes

Após subir o servidor, a documentação interativa do Swagger estará disponível em:
 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Lá você pode testar os endpoints:
* `POST /registro-foco`: Para salvar uma nova sessão.
* `GET /diagnostico-produtividade`: Para obter o resumo da sua performance.
