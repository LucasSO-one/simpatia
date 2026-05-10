from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Os modelos de dados são definidos usando Pydantic, que é uma biblioteca de validação de dados.
class RegistroFocoIn(BaseModel):
    nivel_foco: int = Field(..., ge=1, le=5)
    tempo_minutos: int = Field(..., gt=0)
    comentario: str = Field(..., min_length=3)
    categoria: Optional[str] = "geral"

class RegistroFocoOut(RegistroFocoIn):
    id: int
    data_registro: datetime