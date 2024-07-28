import React, {useCallback, useEffect, useState} from 'react';
import styles from './ComponentLazy3.module.css';

const ComponentLazy: React.FC = () => {
  const [formSchema, setFromSchema] = useState<any>(null);
  const [formData, setFromData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [asyncError, setAsyncError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getFormElement = useCallback((formItemName: string) => {
    const fieldSchema = formSchema[formItemName];
    const fieldData = formData[formItemName];
    let fieldLabel = formItemName.replace(/([a-z])([A-Z])/g, '$1 $2');
    fieldLabel = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1);

    switch (fieldSchema.formType) {
      case 'text':
        return (
          <div className={styles.formItem} key={formItemName}>
            <label>{fieldLabel}</label>
            <input type="text" defaultValue={fieldData} name={formItemName} />
          </div>
        )
      case 'number':
        return (
          <div className={styles.formItem} key={formItemName}>
            <label>{fieldLabel}</label>
            <input type="number" defaultValue={fieldData} name={formItemName} />
          </div>
        )
      case 'checkbox':
        return (
          <div className={styles.checkbox} key={formItemName}>
            <label>
              <input type="checkbox" defaultChecked={fieldData} name={formItemName}/>
              {fieldLabel}
            </label>
          </div>
        )
      case 'select':
        return (
          <div className={styles.formItem} key={formItemName}>
            <label>{fieldLabel}</label>
            <select defaultValue={fieldData} name={formItemName}>
              {fieldSchema.options.map((option: any) => (
                <option value={option.val} key={option.val}>{option.text}</option>
              ))}
            </select>
          </div>
        )
      default:
        console.error('Unknown type');
    }
  }, [formSchema, formData]);

  const handleFormSubmit = useCallback((event:  React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission
    const form = event.target as HTMLFormElement;
    const dataForSubmitting: { [key: string]: string | boolean } = {};

    for (let element of Array.from(form.elements)) {
      if ((element as HTMLInputElement).name) { // Ensure the element has a name attribute
        const inputElement = element as HTMLInputElement;
        if (inputElement.type === 'checkbox') {
          dataForSubmitting[inputElement.name] = inputElement.checked;
        } else {
          dataForSubmitting[inputElement.name] = inputElement.value;
        }
      }
    }

    fetch(`http://localhost:4040/api/users/${formData._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataForSubmitting),
    })
      .then((response) => {
        if (response.ok) {
          alert('Form is updated');
        } else {
          alert('Something went wrong');
        }
      })
      .catch((error) => alert(error.message))
      .finally(() => setIsSubmitting(false));
  }, [formData]);

  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch('http://localhost:4040/api/users');
      const data = await response.json();
      setFromData(data[0]);
      return response;
    }

    const fetchSchema = async () => {
      const response = await fetch('http://localhost:4040/api/users/schema');
      const data = await response.json();
      setFromSchema(data);
      return response;
    }

    const fetchAllData = async () => {
      try {
        const [response1, response2] = await Promise.all([fetchForm(), fetchSchema()]);
        if (!response1.ok || !response2.ok) {
          setAsyncError(true);
        }
      } catch (error) {
        setAsyncError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (asyncError) {
      throw new Error('API problem');
    }
  }, [asyncError]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleFormSubmit}>
      {formSchema && formData && Object.keys(formSchema).map((formItemName, index) => {
        return getFormElement(formItemName);
      })}
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}

export default ComponentLazy;
