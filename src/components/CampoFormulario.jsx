// Campo de formulario reutilizable: etiqueta + control + mensaje de error.
// "as" permite usar input, textarea o select con el mismo componente.
export default function CampoFormulario({ id, label, error, as: Control = "input", children, ...resto }) {
  return (
    <div className="campo-formulario">
      <label htmlFor={id}>{label}</label>
      <Control
        id={id}
        name={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `error-${id}` : undefined}
        {...resto}
      >
        {children}
      </Control>
      {error && (
        <small className="mensaje-error" id={`error-${id}`} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}