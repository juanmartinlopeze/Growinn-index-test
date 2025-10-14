import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderTable from "../../components/AdminTable/HeaderTable";
import TableRowExample from "../../components/AdminTable/TableRowExample";
import FooterTable from "../../components/AdminTable/FooterTable";
import JerarquiaAverage from "../../components/AdminTable/JerarquiaAverage";
import { TOTAL_TABLE_WIDTH } from "../../components/AdminTable/columnSizes";
import SurveyProgress from "../../components/SurveyProgress/SurveyProgress";
import { getSurveyProgress } from "../../lib/getSurveyProgress";
import {
  fetchEmpresas,
  fetchAreas,
  fetchCargos,
  fetchSubcargos,
} from "../../components/Table/api";
import { supabase } from "../../lib/supabaseClient";
import { StepBreadcrumb } from "../../components/StepBreadcrumb/breadcrumb";
import {
  Button,
  Description,
  TitleSection,
  Alert,
} from "../../components/index";

export function EmailManagement() {
  // Estados para feedback de envío de correos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Función para enviar correos (igual que en ValidationPage)
  const handleSendEmails = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const isProduction =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";
      const mailServiceUrl = isProduction
        ? "https://growinn-mail-service.onrender.com/enviar-correos"
        : "http://localhost:3001/enviar-correos";
      console.log("🌐 Enviando correos desde:", window.location.hostname);
      console.log("📧 URL del servicio de mail:", mailServiceUrl);
      const res = await fetch(mailServiceUrl);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // number of participants pending (total - progress)
      const pending = Math.max(0, (total || 0) - (progress || 0));
      setSuccess(true);
      setMessageType("success");
      setMessageTitle("Correos reenviados");
      setMessage(
        `Se han reenviado los correos a ${pending} participantes pendientes.`
      );
    } catch (err) {
      console.error("Error enviando correos:", err);
      setError("No se pudieron enviar los correos.");
      const pending = Math.max(0, (total || 0) - (progress || 0));
      setMessageType("error");
      setMessageTitle("Los correos no fueron enviados");
      setMessage(
        `No se han podido reenviar los correos a los ${pending} participantes pendientes.`
      );
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  // Estos valores deben venir de la base de datos en producción
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [messageTitle, setMessageTitle] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const empresas = await fetchEmpresas();
        if (!empresas || empresas.length === 0) {
          setRows([]);
          setTotal(0);
          setProgress(0);
          return;
        }
        const empresaActual = empresas[empresas.length - 1];
        console.log("EMPRESA ACTUAL PARA PROGRESO:", empresaActual);
        const [areas, cargos, subcargos, progreso, _usuariosEmpresa] =
          await Promise.all([
            fetchAreas(empresaActual.id),
            fetchCargos(),
            fetchSubcargos(),
            getSurveyProgress(empresaActual.id),
            (async () => {
              const { data, error } = await supabase
                .from("usuarios")
                .select("id")
                .eq("empresa_id", empresaActual.id);
              if (error) return [];
              return data || [];
            })(),
          ]);

        setTotal(empresaActual.cantidad_empleados);
        setProgress(progreso);

        // ...código original para la tabla...
        const areaIds = new Set((areas || []).map((a) => a.id));
        const cargoMap = new Map();
        (cargos || []).forEach((c) => {
          if (!areaIds.has(c.area_id)) return;
          const key = `${c.area_id}-${c.jerarquia_id}`;
          cargoMap.set(key, c);
        });
        const subMap = new Map();
        (subcargos || []).forEach((s) => {
          if (!subMap.has(s.cargo_id)) subMap.set(s.cargo_id, []);
          subMap.get(s.cargo_id).push(s);
        });
        const newRows = (areas || []).map((area) => {
          const roles = ["J1", "J2", "J3"].map((j) => {
            const key = `${area.id}-${j}`;
            const cargo = cargoMap.get(key);
            if (!cargo) return { answered: 0, total: 0, percent: 0 };
            const subs = subMap.get(cargo.id) || [];
            const total =
              subs.length > 0
                ? subs.reduce((s, x) => s + (x.personas || 0), 0)
                : cargo.personas || 0;
            // answered is unknown here (responses), default 0
            const answered = 0;
            const percent =
              total > 0 ? Math.round((answered / total) * 100) : 0;
            return { answered, total, percent };
          });
          const assignedSum = roles.reduce((s, r) => s + (r.total || 0), 0);
          const totalAssignedAll = (areas || []).reduce((s, a) => {
            const rs = ["J1", "J2", "J3"].map((j) => {
              const c = cargoMap.get(`${a.id}-${j}`);
              if (!c) return 0;
              const sub = subMap.get(c.id) || [];
              return sub.length > 0
                ? sub.reduce((ss, x) => ss + (x.personas || 0), 0)
                : c.personas || 0;
            });
            return s + rs.reduce((ss, v) => ss + v, 0);
          }, 0);
          const percent =
            totalAssignedAll > 0
              ? Math.round((assignedSum / totalAssignedAll) * 100)
              : 0;
          return {
            areaId: area.id,
            areaLabel: area.nombre,
            roles,
            percent,
          };
        });
        setRows(newRows);
      } catch {
        setRows([]);
        setTotal(0);
        setProgress(0);
      }
    }
    load();
  }, []);

  // meta ahora se calcula en SurveyProgress

  return (
    <section className="w-full h-full flex flex-col justify-center items-start px-[10%] pt-[10%] gap-5 relative">
      <StepBreadcrumb
        steps={[
          "Jerarquías y cargos",
          "Áreas",
          "Tabla de jerarquías",
          "Resultados",
        ]}
        currentStep={3}
        clickableSteps={[2]}
        onStepClick={(idx) => {
          if (idx === 2) navigate("/datos_prueba");
        }}
      />
      <div className="flex flex-col w-[1200px] items-start gap-[26px]">
        <TitleSection title="Gestión de análisis y respuestas" />
        <div className="flex flex-col items-start gap-[26px] w-full">
          <Description
            variant="forms"
            text="En este apartado podrás consultar el total de encuestas respondidas, reenviar correos a los participantes pendientes y acceder al análisis de resultados para revisar la información obtenida de manera rápida y sencilla."
          />
          <Description
            variant="forms"
            text="En caso de ser necesario puedes reenviar los correos para llegar la meta establecida."
          />
        </div>
      </div>

      <SurveyProgress total={total} progreso={progress} />

      {/* Botones de acción */}
      <div
        style={{
          display: "flex",
          width: "1125px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="mt-4 mx-auto mb-10"
      >
        <Button
          variant="email"
          text={loading ? "Enviando..." : "Reenviar correos"}
          onClick={() => {
            // show confirmation alert before sending
            setAlertType("confirmResend");
            setShowAlert(true);
          }}
          disabled={loading}
          style={{
            display: "flex",
            width: "534px",
            padding: "var(--padding-md, 12px) var(--padding-xxl, 24px)",
            justifyContent: "center",
            alignItems: "center",
            gap: "var(--spacing-sm, 8px)",
            flexShrink: 0,
            borderRadius: "var(--radius-lg, 24px)",
            background: "var(--Colors-Primary-color-n500, #E9683B)",
            color: "var(--Colors-Text-text-inverse, #FFF)",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        />

        <Button
          variant="analytics"
          text="Analizar resultados"
          onClick={async () => {
            // Llama al endpoint backend para analizar resultados
            try {
              const empresas = await fetchEmpresas();
              if (!empresas || empresas.length === 0) {
                setMessageType("error");
                setMessageTitle("Error");
                setMessage("No hay empresa para analizar.");
                setShowAlert(false);
                return;
              }
              const empresaActual = empresas[empresas.length - 1];
              console.log("empresa_id enviado al análisis:", empresaActual.id);
              const response = await fetch(
                `${
                  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
                }/api/analizar-resultados`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ empresa_id: empresaActual.id }),
                }
              );
              const data = await response.json();
              if (response.ok) {
                setMessageType("success");
                setMessageTitle("Análisis completado");
                setMessage("Resultados generados correctamente.");
                console.log("Resultados del análisis:", data.resultados);
              } else {
                setMessageType("error");
                setMessageTitle("Error");
                setMessage(data.error || "Error al analizar resultados");
              }
              setShowAlert(false);
              setAlertType(null);
            } catch {
              setMessageType("error");
              setMessageTitle("Error");
              setMessage("Error de red o del servidor al analizar resultados.");
              setShowAlert(false);
              setAlertType(null);
            }
          }}
          style={{
            display: "flex",
            width: "534px",
            padding: "var(--padding-md, 12px) var(--padding-xxl, 24px)",
            justifyContent: "center",
            alignItems: "center",
            gap: "var(--spacing-sm, 8px)",
            flexShrink: 0,
            borderRadius: "var(--radius-lg, 24px)",
            background: "var(--Colors-Primary-color-n500, #E9683B)",
            color: "var(--Colors-Text-text-inverse, #FFF)",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        />
      </div>

      {/* Header strip for the table: left, 3 center, right */}
      {/* Table container: header + rows (dynamic) */}
      <div
        style={{
          display: "flex",
          maxWidth: TOTAL_TABLE_WIDTH,
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0,
        }}
        className="mt-6 mb-20 mx-auto"
      >
        <div className="inline-flex items-center w-full" role="presentation">
          <HeaderTable label="Área" variant="left" />
          <HeaderTable label="J1" variant="center" />
          <HeaderTable label="J2" variant="center" />
          <HeaderTable label="J3" variant="center" />
          <HeaderTable label="Completado" variant="right" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 0,
            width: "100%",
          }}
        >
          {rows.length ? (
            rows.map((row) => (
              <TableRowExample
                key={row.areaId}
                areaLabel={row.areaLabel}
                percent={row.percent}
                roles={row.roles}
              />
            ))
          ) : (
            // fallback: show a few placeholders
            <>
              <TableRowExample areaLabel="Área 1" percent={0} />
              <TableRowExample areaLabel="Área 2" percent={0} />
            </>
          )}
        </div>

        {/* Footer row */}
        <div
          className="inline-flex items-center w-full"
          style={{ marginTop: 0 }}
        >
          <FooterTable variant="left">
            <span style={{ fontFamily: "Plus Jakarta Sans", fontSize: 14 }}>
              Total por jerarquía
            </span>
          </FooterTable>

          {(() => {
            if (!rows.length) {
              return (
                <>
                  <FooterTable variant="center">
                    <JerarquiaAverage percent={0} />
                  </FooterTable>
                  <FooterTable variant="center">
                    <JerarquiaAverage percent={0} />
                  </FooterTable>
                  <FooterTable variant="center">
                    <JerarquiaAverage percent={0} />
                  </FooterTable>
                </>
              );
            }
            const j1 = Math.round(
              rows.reduce((s, r) => s + (r.roles[0]?.percent || 0), 0) /
                rows.length
            );
            const j2 = Math.round(
              rows.reduce((s, r) => s + (r.roles[1]?.percent || 0), 0) /
                rows.length
            );
            const j3 = Math.round(
              rows.reduce((s, r) => s + (r.roles[2]?.percent || 0), 0) /
                rows.length
            );
            return (
              <>
                <FooterTable variant="center">
                  <JerarquiaAverage percent={j1} />
                </FooterTable>
                <FooterTable variant="center">
                  <JerarquiaAverage percent={j2} />
                </FooterTable>
                <FooterTable variant="center">
                  <JerarquiaAverage percent={j3} />
                </FooterTable>
              </>
            );
          })()}

          <FooterTable variant="right" />
        </div>
      </div>

      {/* Toast flotante bottom-right para mensajes */}
      {message && (
        <>
          {/* slide-in from right animation for the toast */}
          <style>{`
            @keyframes slideInFromRight {
              from { transform: translateX(120%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>

          <div
            className="fixed bottom-8 right-8 z-50"
            style={{
              display: "flex",
              width: "386px",
              height: "113px",
              padding: "24px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "8px",
              flexShrink: 0,
              borderRadius: "8px",
              border: "1px solid #CCC",
              background: "#FFF",
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.12)",
              animation: "slideInFromRight 350ms ease-out forwards",
            }}
          >
            {messageType === "success" ? (
              <div>
                <h4
                  className="mb-1 text-left"
                  style={{
                    color: "var(--Colors-Text-text-primary, #333)",
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "var(--Versin-web-Contenido-Body-sm, 14px)",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  {messageTitle || "Correos reenviados"}
                </h4>
                <p
                  className="text-left"
                  style={{
                    color: "var(--Colors-Text-text-primary, #333)",
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "var(--Versin-web-Contenido-Body-sm, 14px)",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  {message}
                </p>
                {success && (
                  <p style={{ color: "green", marginTop: "0.5rem" }}>
                    ✅ Correos enviados correctamente.
                  </p>
                )}
              </div>
            ) : (
              <>
                <p
                  style={{
                    color: "red",
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: "var(--Versin-web-Contenido-Body-sm, 14px)",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {error || "No se ha podido enviar los correos."}
                </p>
              </>
            )}
          </div>
        </>
      )}

      {showAlert && (
        <Alert
          type={alertType || "confirmResend"}
          onClose={() => setShowAlert(false)}
          onCancel={() => setShowAlert(false)}
          onConfirm={async () => {
            // handle confirmations by type
            if (alertType === "confirmResend") {
              // user confirmed: call the existing send function
              try {
                await handleSendEmails();
              } catch (e) {
                // handleSendEmails already sets message/error state; nothing extra needed
                console.error("Error during confirmed resend:", e);
              }
            }
            if (alertType === "confirmAnalysis") {
              setMessageType("success");
              setMessageTitle("Análisis iniciado");
              setMessage("Generando reporte de resultados..");
            }
            setShowAlert(false);
            setAlertType(null);
          }}
        />
      )}

      {/* Header strip for the table: left, 3 center, right */}
      <img className="line-bckg-img" src="/BgLine-decoration2.png" alt="" />
      <img className="line-bckg-img2" src="/BgLine-decoration3.png" alt="" />
      <img className="squares-bckg-img" src="/squaresBckg.png" alt="" />
    </section>
  );
}
