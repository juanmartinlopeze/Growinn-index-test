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

  // Función para enviar correos
  const handleSendEmails = async () => {
    console.log('\n🔵 === ENVÍO DE CORREOS (EmailManagement) ===');
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('📊 Obteniendo empresas...');
      const empresas = await fetchEmpresas();
      console.log('✅ Empresas obtenidas:', empresas);
      
      if (!empresas || empresas.length === 0) {
        console.error('❌ No hay empresas');
        throw new Error("No hay empresa para enviar correos");
      }
      
      const empresaActual = empresas[empresas.length - 1];
      console.log('🏢 Empresa seleccionada:', empresaActual.id);

      // ✅ Cambiar a VITE_API_URL
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const mailUrl = `${backendUrl}/enviar-correos`;
      
      console.log('🌐 Backend URL:', backendUrl);
      console.log('📧 URL del servicio de mail:', mailUrl);

      const requestBody = { empresa_id: empresaActual.id };
      console.log('📦 Body:', JSON.stringify(requestBody, null, 2));

      console.log('🚀 Enviando petición POST...');
      const response = await fetch(mailUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Respuesta:');
      console.log('   - Status:', response.status);
      console.log('   - Status Text:', response.statusText);

      const data = await response.json();
      console.log('📄 Data:', JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('✅ Correos enviados');
        const pending = Math.max(0, (total || 0) - (progress || 0));
        setSuccess(true);
        setError(null);
        setMessageType("success");
        setMessageTitle("Correos reenviados");
        setMessage(
          `Se han reenviado los correos a ${pending} participantes pendientes.`
        );
      } else {
        console.error('❌ Error:', data.error);
        throw new Error(data.error || "Error al enviar correos");
      }

      console.log('🔵 === FIN ENVÍO ===\n');
    } catch (err) {
      console.error('💥 Error:', err);
      console.error('Tipo:', err.name);
      console.error('Mensaje:', err.message);
      
      setError(err.message);
      setSuccess(false);
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

  // Función para iniciar el análisis
  const handleAnalyzeResults = async () => {
    try {
      console.log('\n🔵 === ANÁLISIS DE RESULTADOS INICIO ===');
      
      const empresas = await fetchEmpresas();
      if (!empresas || empresas.length === 0) {
        console.error('❌ No hay empresas');
        setMessageType("error");
        setMessageTitle("Error");
        setMessage("No hay empresa para analizar.");
        setShowAlert(false);
        setAlertType(null);
        return;
      }
      
      const empresaActual = empresas[empresas.length - 1];
      console.log('🏢 Empresa:', empresaActual.id);
      
      // ✅ VALIDAR QUE HAYA RESPUESTAS ANTES DE ANALIZAR
      console.log('📊 Verificando progreso de encuestas...');
      const progreso = await getSurveyProgress(empresaActual.id);
      console.log('📈 Encuestas completadas:', progreso);
      console.log('👥 Total empleados:', empresaActual.cantidad_empleados);
      
      if (progreso === 0) {
        console.warn('⚠️  No hay encuestas completadas');
        setMessageType("error");
        setMessageTitle("Sin datos para analizar");
        setMessage(
          `No hay encuestas completadas. Los usuarios de la empresa deben completar la encuesta antes de poder analizar los resultados.`
        );
        setShowAlert(false);
        setAlertType(null);
        return;
      }
      
      console.log(`✅ Hay ${progreso} encuestas completadas, procediendo con el análisis...`);
      
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const analyzeUrl = `${backendUrl}/api/analizar-resultados`;
      console.log('🌐 URL:', analyzeUrl);
      
      const response = await fetch(analyzeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa_id: empresaActual.id }),
      });
      
      const data = await response.json();
      
      console.log('📡 Response status:', response.status);
      console.log('📄 Response data:', JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('✅ Análisis exitoso');
        
        if (data.evaluacion_id) {
          console.log('💾 Evaluación guardada con ID:', data.evaluacion_id);
        }
        console.log('📈 Total respuestas analizadas:', data.total_respuestas);
        console.log('👥 Total usuarios:', data.total_usuarios);
        console.log('👥 Usuarios que respondieron:', data.usuarios_respondieron);
        
        setMessageType("success");
        setMessageTitle("Análisis completado");
        setMessage(
          `Análisis completado exitosamente. Se analizaron ${data.total_respuestas} respuestas de ${data.usuarios_respondieron} usuarios. ${
            data.evaluacion_id 
              ? 'Evaluación guardada con ID: ' + data.evaluacion_id 
              : ''
          }`
        );
      } else {
        console.error('❌ Error:', data.error);
        
        // Mostrar información de debug si está disponible
        if (data.debug) {
          console.warn('🔍 Debug info:');
          console.warn('   Empresa:', data.debug.empresa_id);
          console.warn('   Usuarios de la empresa:', data.debug.usuarios_empresa);
          console.warn('   Usuarios con respuestas:', data.debug.usuarios_con_respuestas);
        }
        
        setMessageType("error");
        setMessageTitle("Error en el análisis");
        setMessage(
          data.error || "No se pudo completar el análisis de resultados."
        );
      }
      
      setShowAlert(false);
      setAlertType(null);
      
    } catch (error) {
      console.error('💥 Error:', error);
      console.error('Stack:', error.stack);
      setMessageType("error");
      setMessageTitle("Error de conexión");
      setMessage("No se pudo conectar con el servidor para realizar el análisis.");
      setShowAlert(false);
      setAlertType(null);
    }
  };

  const navigate = useNavigate();

  // Estados para progreso y alertas
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [messageTitle, setMessageTitle] = useState("");
  const [toastClosing, setToastClosing] = useState(false);
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

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (!message) return;
    setToastClosing(false);
    const visibleDuration = 5000;
    const fadeDuration = 350;
    const t1 = setTimeout(() => setToastClosing(true), visibleDuration);
    const t2 = setTimeout(() => {
      setMessage("");
      setMessageTitle("");
      setMessageType("info");
      setSuccess(false);
      setError(null);
      setToastClosing(false);
    }, visibleDuration + fadeDuration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [message]);

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
          onClick={() => {
            setAlertType("confirmAnalysis");
            setShowAlert(true);
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

      {/* Tabla */}
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
            <>
              <TableRowExample areaLabel="Área 1" percent={0} />
              <TableRowExample areaLabel="Área 2" percent={0} />
            </>
          )}
        </div>

        {/* Footer */}
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

      {/* Toast flotante */}
      {message && (
        <div
          className={`fixed bottom-8 right-8 z-50 toast-slide-in ${
            toastClosing ? "toast-fade-out" : ""
          }`}
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
                {messageTitle || "Éxito"}
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
            </div>
          ) : (
            <div>
              <h4
                className="mb-1 text-left"
                style={{
                  color: "red",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "var(--Versin-web-Contenido-Body-sm, 14px)",
                  fontWeight: 700,
                }}
              >
                {messageTitle || "Error"}
              </h4>
              <p
                style={{
                  color: "var(--Colors-Text-text-primary, #333)",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "var(--Versin-web-Contenido-Body-sm, 14px)",
                  fontWeight: 400,
                }}
              >
                {message}
              </p>
            </div>
          )}
        </div>
      )}

      {showAlert && (
        <Alert
          type={alertType || "confirmResend"}
          onClose={() => setShowAlert(false)}
          onCancel={() => setShowAlert(false)}
          onConfirm={async () => {
            if (alertType === "confirmResend") {
              try {
                await handleSendEmails();
              } catch (e) {
                console.error("Error during confirmed resend:", e);
              }
            }
            if (alertType === "confirmAnalysis") {
              await handleAnalyzeResults();
            }
            setShowAlert(false);
            setAlertType(null);
          }}
        />
      )}

      <img className="line-bckg-img" src="/BgLine-decoration2.png" alt="" />
      <img className="line-bckg-img2" src="/BgLine-decoration3.png" alt="" />
      <img className="squares-bckg-img" src="/squaresBckg.png" alt="" />
    </section>
  );
}