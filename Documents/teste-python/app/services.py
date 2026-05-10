from database import banco_de_dados

#'services.py' é onde colocamos a lógica de negócios, ou seja, as funções 
# que processam os dados e geram resultados.

# Esta função analisa os registros de foco e gera 
# um diagnóstico inteligente com base nos dados coletados.
def gerar_diagnostico_inteligente():
    if not banco_de_dados:
        return "Nenhum dado disponível para análise."

    total_minutos = sum(registro.tempo_minutos for registro in banco_de_dados)
    media_foco = sum(registro.tempo_minutos for registro in banco_de_dados) / len(banco_de_dados)

    feedback = "Muitas distrações hoje. Considere pausas mais longas."
    if media_foco >= 4.0:
        feedback = "Excelente foco! Continue assim."
    elif media_foco >= 3.0:
        feedback = "Bom foco, mas há espaço para melhorias."

    return {
        "media_nivel_foco": round(media_foco, 2),
        "tempo_total_focado_minutos": total_minutos,
        "total_sessoes": len(banco_de_dados),
        "feedback_inteligente": feedback
    }