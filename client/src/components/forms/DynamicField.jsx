const DynamicField = ({ field, register, watch }) => {

  // Conditional Visibility

  if (field.condition) {
    const value = watch(field.condition.field);

    if (value !== field.condition.value) return null;
  }

  switch (field.type) {

    case "text":
    case "email":
    case "phone":
    case "number":
    case "date":
      return (
        <div className="fieldGroup">
          <label>{field.label}</label>

          <input
            type={field.type === "phone" ? "tel" : field.type}
            placeholder={field.placeholder}
            {...register(field.name, {
              required: field.required,
            })}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="fieldGroup">
          <label>{field.label}</label>

          <textarea
            rows="5"
            placeholder={field.placeholder}
            {...register(field.name)}
          />
        </div>
      );

    case "select":
      return (
        <div className="fieldGroup">
          <label>{field.label}</label>

          <select {...register(field.name)}>
            <option value="">Choose</option>

            {field.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div className="fieldGroup">
          <label>{field.label}</label>

          {field.options.map((option) => (
            <label key={option} className="radioLabel">
              <input
                type="radio"
                value={option}
                {...register(field.name)}
              />

              {option}
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="fieldGroup">
          <label>{field.label}</label>

          {field.options.map((option) => (
            <label key={option} className="checkboxLabel">
              <input
                type="checkbox"
                value={option}
                {...register(field.name)}
              />

              {option}
            </label>
          ))}
        </div>
      );

    case "file":
      return (
        <div className="fieldGroup">
          <label>{field.label}</label>

          <input type="file" {...register(field.name)} />
        </div>
      );

    default:
      return null;
  }
};

export default DynamicField;