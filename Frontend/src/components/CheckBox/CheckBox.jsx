export function CheckBox({ 
    label, 
    name, 
    checked = false, 
    onChange,
    size = 'medium',
    variant = 'default',
    isDisabled = false,
    isRequired = false,
    hasError = false,
    description,
    className = '',
    ...props 
}) {
    const checkboxId = `checkbox-${name}`;

    // Función para construir clases del contenedor
    const getContainerClasses = () => {
        let classes = 'flex items-start gap-3';
        
        if (isDisabled) {
            classes += ' opacity-50 cursor-not-allowed';
        }
        
        if (className) {
            classes += ` ${className}`;
        }
        
        return classes;
    };

    // Función para obtener estilos dinámicos del input
    const getInputStyles = () => {
        const baseStyles = {};
        
        if (isDisabled) {
            // Estado disabled: neutral-400
            baseStyles.borderColor = 'var(--color-neutral-400)';
            if (checked) {
                baseStyles.backgroundColor = 'var(--color-neutral-400)';
            }
        } else if (checked) {
            // Estado activo/seleccionado: neutral-800
            if (hasError) {
                baseStyles.backgroundColor = 'var(--color-semantic-error)';
                baseStyles.borderColor = 'var(--color-semantic-error)';
            } else {
                baseStyles.backgroundColor = 'var(--color-neutral-800)';
                baseStyles.borderColor = 'var(--color-neutral-800)';
            }
        } else {
            // Estado normal: neutral-600
            if (hasError) {
                baseStyles.borderColor = 'var(--color-semantic-error)';
            } else {
                baseStyles.borderColor = 'var(--color-neutral-600)';
            }
        }
        
        return baseStyles;
    };

    // Función para construir clases del input
    const getInputClasses = () => {
        let classes = 'rounded border-2 transition-all duration-200 outline-none';
        
        // Sizes
        if (size === 'small') {
            classes += ' w-4 h-4';
        } else if (size === 'medium') {
            classes += ' w-5 h-5';
        } else if (size === 'large') {
            classes += ' w-6 h-6';
        }
        
        if (isDisabled) {
            classes += ' cursor-not-allowed opacity-50';
        }
        
        return classes;
    };

    // Función para construir clases del label
    const getLabelClasses = () => {
        let classes = 'cursor-pointer transition-colors duration-200';
        
        // Sizes
        if (size === 'small') {
            classes += ' text-sm';
        } else if (size === 'medium') {
            classes += ' text-base';
        } else if (size === 'large') {
            classes += ' text-lg';
        }
        
        // States - usando variables CSS del index.css
        if (isDisabled) {
            classes += ' [color:var(--color-text-disabled)] cursor-not-allowed';
        } else if (hasError) {
            classes += ' [color:var(--color-semantic-error)]';
        } else {
            classes += ' [color:var(--color-text-primary)]';
        }
        
        return classes;
    };

    // Función para construir clases de la descripción
    const getDescriptionClasses = () => {
        let classes = 'mt-1';
        
        // Sizes
        if (size === 'small') {
            classes += ' text-xs';
        } else if (size === 'medium') {
            classes += ' text-sm';
        } else if (size === 'large') {
            classes += ' text-base';
        }
        
        // States - usando variables CSS del index.css
        if (isDisabled) {
            classes += ' [color:var(--color-text-disabled)]';
        } else if (hasError) {
            classes += ' [color:var(--color-semantic-error)]';
        } else {
            classes += ' [color:var(--color-text-secondary)]';
        }
        
        return classes;
    };

    // Determinar si el checkbox es controlado o no controlado
    const isControlled = onChange !== undefined;
    
    // Handler por defecto para evitar el warning de React
    const handleChange = (event) => {
        if (onChange && !isDisabled) {
            onChange(event);
        }
    };

    return (
        <div className={getContainerClasses()}>
            <input
                type="checkbox"
                id={checkboxId}
                name={name}
                {...(isControlled 
                    ? { checked: checked, onChange: handleChange }
                    : { defaultChecked: checked }
                )}
                disabled={isDisabled}
                required={isRequired}
                readOnly={!isControlled}
                className={getInputClasses()}
                style={getInputStyles()}
                {...props}
            />
            <div className="flex flex-col">
                <label htmlFor={checkboxId} className={getLabelClasses()}>
                    {label}
                    {isRequired && (
                        <span className="[color:var(--color-semantic-error)] ml-1">*</span>
                    )}
                </label>
                {description && (
                    <p className={getDescriptionClasses()}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
