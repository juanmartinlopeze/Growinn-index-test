import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Description, TitleSection } from "../../components/index";
import "./ValidationPage.css";

const excelIcon = (
  <svg
    className="excel-icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_3755_2788)">
      <path
        d="M15.0243 1.5H7.08807C6.82504 1.5 6.57278 1.60533 6.38679 1.79282C6.2008 1.98031 6.09631 2.2346 6.09631 2.49975V6.75L15.0243 12L19.4883 13.899L23.9523 12V6.75L15.0243 1.5Z"
        fill="#21A366"
      />
      <path d="M6.09631 6.75H15.0243V12H6.09631V6.75Z" fill="#107C41" />
      <path
        d="M22.9605 1.5H15.0243V6.75H23.9523V2.49975C23.9523 2.2346 23.8478 1.98031 23.6618 1.79282C23.4758 1.60533 23.2236 1.5 22.9605 1.5Z"
        fill="#33C481"
      />
      <path
        d="M15.0243 12H6.09631V21.5002C6.09631 21.7654 6.2008 22.0197 6.38679 22.2072C6.57278 22.3947 6.82504 22.5 7.08807 22.5H22.9606C23.2236 22.5 23.4758 22.3947 23.6618 22.2072C23.8478 22.0197 23.9523 21.7654 23.9523 21.5002V17.25L15.0243 12Z"
        fill="#185C37"
      />
      <path d="M15.0243 12H23.9523V17.25H15.0243V12Z" fill="#107C41" />
      <path
        opacity="0.1"
        d="M12.5446 5.25H6.09631V19.5H12.5446C12.8073 19.4992 13.0591 19.3936 13.245 19.2063C13.4308 19.019 13.5355 18.7652 13.5363 18.5002V6.24975C13.5355 5.98484 13.4308 5.73101 13.245 5.54369C13.0591 5.35638 12.8073 5.25079 12.5446 5.25Z"
        fill="black"
      />
      <path
        opacity="0.2"
        d="M11.8006 6H6.09631V20.25H11.8006C12.0633 20.2492 12.3151 20.1436 12.501 19.9563C12.6868 19.769 12.7915 19.5152 12.7923 19.2502V6.99975C12.7915 6.73484 12.6868 6.48101 12.501 6.29369C12.3151 6.10638 12.0633 6.00079 11.8006 6Z"
        fill="black"
      />
      <path
        opacity="0.2"
        d="M11.8006 6H6.09631V18.75H11.8006C12.0633 18.7492 12.3151 18.6436 12.501 18.4563C12.6868 18.269 12.7915 18.0152 12.7923 17.7502V6.99975C12.7915 6.73484 12.6868 6.48101 12.501 6.29369C12.3151 6.10638 12.0633 6.00079 11.8006 6Z"
        fill="black"
      />
      <path
        opacity="0.2"
        d="M11.0566 6H6.09631V18.75H11.0566C11.3193 18.7492 11.5711 18.6436 11.757 18.4563C11.9428 18.269 12.0475 18.0152 12.0483 17.7502V6.99975C12.0475 6.73484 11.9428 6.48101 11.757 6.29369C11.5711 6.10638 11.3193 6.00079 11.0566 6Z"
        fill="black"
      />
      <path
        d="M1.13604 6H11.0565C11.3196 6 11.5718 6.10533 11.7578 6.29282C11.9438 6.48031 12.0483 6.7346 12.0483 6.99975V17.0002C12.0483 17.2654 11.9438 17.5197 11.7578 17.7072C11.5718 17.8947 11.3196 18 11.0565 18H1.13604C0.87301 18 0.620754 17.8947 0.434765 17.7072C0.248775 17.5197 0.144287 17.2654 0.144287 17.0002L0.144287 6.99975C0.144287 6.7346 0.248775 6.48031 0.434765 6.29282C0.620754 6.10533 0.87301 6 1.13604 6Z"
        fill="#107C41"
      />
      <path
        d="M2.77283 15.75L5.18041 11.9895L2.9752 8.25H4.74964L5.95343 10.6403C6.06404 10.8668 6.14017 11.0357 6.18184 11.1472H6.19746C6.27682 10.9662 6.3599 10.7903 6.4467 10.6193L7.73308 8.25H9.36169L7.09993 11.9685L9.41898 15.75H7.68546L6.29492 13.125C6.22941 13.0132 6.17389 12.8957 6.12901 12.774H6.10818C6.0676 12.893 6.01368 13.007 5.94748 13.1138L4.51676 15.75H2.77283Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_3755_2788">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export function ValidationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const excelWarnings = location.state?.excelWarnings || [];
  const file = location.state?.file || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Función que invoca el microservicio de correos
  const handleSendEmails = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Detectar si estamos en producción o desarrollo
      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const mailServiceUrl = isProduction 
        ? "https://growinn-mail-service.onrender.com/enviar-correos"
        : "http://localhost:3001/enviar-correos";

      // Obtener empresa actual por user_id
      const empresas = await fetch('/api/empresas').then(r => r.json());
      const userId = localStorage.getItem('user_id');
      const empresaActual = empresas.find(e => String(e.user_id) === String(userId));
      if (!empresaActual) throw new Error('No se encontró empresa para el usuario actual');

      console.log("🌐 Enviando correos desde:", window.location.hostname);
      console.log("📧 URL del servicio de mail:", mailServiceUrl);
      console.log("🏢 Empresa actual:", empresaActual.id);

      // Enviar el id de la empresa en el body (POST)
      const res = await fetch(mailServiceUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa_id: empresaActual.id })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setSuccess(true);
    } catch (err) {
      console.error("Error enviando correos:", err);
      setError("No se pudieron enviar los correos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="validation-page-section">
      <TitleSection title="Resultado de la validación" />
      <Description
        variant="p"
        text="A continuación, encontrarás el resultado de la validación automática del archivo Excel que proporcionaste. Revisa si hay datos faltantes o formatos incorrectos que debas corregir. Una vez validado correctamente, este será el último paso del proceso."
      />

      <div className="validation-layout">
        <div className="file-preview-container">
          <div className="excel-preview">
            {excelIcon}
            <div className="file-info">
              <p className="file-name">
                {file?.name || "Nombre no disponible"}
              </p>
              <p className="file-details">
                <span className="file-type">Archivo Excel</span>
                {file && (
                  <span className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="validation-summary">
          <div className="validation-errors">
            <div className="validation-errors-head">
              <h3>Resumen de resultados</h3>
              {excelWarnings.length > 0 ? (
                <p>Se encontraron {excelWarnings.length} errores en total</p>
              ) : (
                <p>No se encontraron errores.</p>
              )}
            </div>

            {excelWarnings.length > 0 ? (
              <>
                <h4 className="error-title">
                  Errores encontrados ({excelWarnings.length})
                </h4>
                <div className="error-list-container">
                  <ul className="error-list">
                    {excelWarnings.map(({ row, issues }) => (
                      <li key={row}>
                        <p className="bold">Fila {row}: </p>{" "}
                        {issues.map((issue, index) => (
                          <span key={index}>
                            {issue}
                            {index < issues.length - 1 && (
                              <span className="issue-separator"> | </span>
                            )}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="success-validation">
                <p className="no-errors-message">
                  ✅ Validación completada: No se encontraron errores.
                </p>
                <button
                  onClick={handleSendEmails}
                  disabled={loading}
                  style={{ 
                    marginTop: "1rem",
                    backgroundColor: "#059669",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}
                >
                  {loading ? "Enviando..." : "📧 Enviar correos de encuesta"}
                </button>
                
                {error && (
                  <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
                )}
                {success && (
                  <p style={{ color: "green", marginTop: "0.5rem" }}>
                    ✅ Correos enviados correctamente.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="validation-buttons">
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <Button
                variant="back"
                text="Regresar"
                onClick={() => navigate(-1)}
              />
              {excelWarnings.length > 0 ? (
                <Button
                  variant="next"
                  text="Corregir archivo"
                  onClick={() => navigate("/upload_page")}
                  rightIcon={true}
                  iconRightType="arrow"
                  arrowDirection="right"
                />
              ) : (
                <Button
                  variant="next"
                  text="Finalizar proceso"
                  onClick={() => navigate("/email_management")}
                  rightIcon={true}
                  iconRightType="arrow"
                  arrowDirection="right"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}