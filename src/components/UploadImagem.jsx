import { useRef } from "react";

export default function UploadImagem({
    setPergunta,
    setRespostaAluno,
    setResultado
}) {

    const inputRef = useRef();

    async function enviarImgParaAnalise(file) {

        const formData = new FormData();
        formData.append("imagem", file);
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

        setResultado("Lendo imagem, por favor aguarde...");

        try {

            const response = await fetch(
                `${baseUrl}/analisar-imagem`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Erro no servidor");
            }

            const data = await response.json();

            setPergunta(
                data.pergunta ||
                "Não foi possível extrair a pergunta."
            );

            setRespostaAluno(
                data.resposta ||
                "Não foi possível extrair a resposta."
            );

            setResultado("Texto extraído com sucesso!");

        } catch (error) {

            console.error(error);

            setResultado("Erro ao ler imagem.");
        }
    }

    function handleFileChange(event) {

        const file = event.target.files[0];

        if (file) {
            enviarImgParaAnalise(file);
        }
    }

    return (
        <div className="upload-container">

            <button
                className="upload-btn"
                onClick={() => inputRef.current.click()}
            >
                Enviar Imagem
            </button>

            <input
                type="file"
                ref={inputRef}
                hidden
                onChange={handleFileChange}
            />

        </div>
    );
}