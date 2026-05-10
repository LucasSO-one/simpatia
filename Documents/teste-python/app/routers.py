from fastapi import APIRouter, HTTPException
from datetime import datetime
from models import RegistroFocoIn, RegistroFocoOut
from database import banco_de_dados
import services

router = APIRouter()

# Este arquivo define as rotas da API, ou seja, os endpoints 
# que os clientes podem acessar para interagir com o sistema.
@router.post("/registro-foco", response_model=RegistroFocoOut, status_code=201)
async def criar_registro(registro: RegistroFocoIn):
    novo_id = len(banco_de_dados) + 1
    registro_completo = RegistroFocoOut(
        id=novo_id,
        data_registro=datetime.now(),
        **registro.model_dump()
    )
    banco_de_dados.append(registro_completo)
    return registro_completo

# Este endpoint retorna um diagnóstico inteligente com base 
# nos registros de foco coletados.
@router.get("/diagnostico-produtividade")
async def obter_diagnostico():
    diagnostico = services.gerar_diagnostico_inteligente()
    if not diagnostico:
        raise HTTPException(status_code=404, detail="Nenhum registro encontrado.")
    return diagnostico