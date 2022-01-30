import { VisibilityOff, Visibility } from "@mui/icons-material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
// import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import React, { FunctionComponent, useContext, useState } from "react";

interface FormProps {
    children: any;
    submit: any;
    initialValues: any;
    buttonText: string;
    buttonSize: "small" | "medium" | "large";
}

interface InputFieldProps {
    type?: string;
    variant: 'standard' | 'outlined' | 'filled';
    label?: string;
    name: string;
    size: 'small' | 'medium';
    fullWidth?: boolean;
    required?: boolean;
    disabled?: boolean;
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    isMultiline?: boolean;
    isSelect?: boolean;
    selectOptions?: SelectOption[];
    selectionChange?: any;
}

interface RadioProps {
    name: string;
    options: any[];
    selectionChange?: any;
}

export const FormContext = React.createContext({
    form: {} as any,
    handleFormChange: {} as any,
});

export interface SelectOption {
    label: string;
    value: string;
}

export const InputField: FunctionComponent<InputFieldProps> = (props: InputFieldProps) => {
    const formContext = useContext(FormContext);
    const { form, handleFormChange } = formContext;
    const { type, variant, label, name, size, fullWidth, color, isMultiline, isSelect, selectOptions = [], selectionChange = () => {} } = props;

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        type !== 'password' ? <TextField color={color} select={isSelect} rows={isMultiline ? 4 : 1} multiline={isMultiline} fullWidth={fullWidth} size={size} name={name} value={form[name]} type={type} label={label} variant={variant} onChange={handleFormChange}>
            {isSelect && selectOptions && selectOptions.map((option: SelectOption, index) => (
                <MenuItem onClick={() => selectionChange(option)} key={index} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField> : <TextField color={color} size={size} name={name} value={form[name]} fullWidth={fullWidth} type={form['showPassword'] ? 'text' : type} label={label} variant={variant} onChange={handleFormChange} InputProps={{
            endAdornment: <InputAdornment position="end"><IconButton
                aria-label="toggle password visibility"
                onClick={handleFormChange}
                onMouseDown={handleMouseDownPassword}
                edge="end"
            >
                {form['showPassword'] ? <VisibilityOff /> : <Visibility />}
            </IconButton></InputAdornment>,
        }} />
    );
};

export const FRadioButton: FunctionComponent<RadioProps> = (props: RadioProps) => {
    const formContext = useContext(FormContext);
    const { form, handleFormChange } = formContext;
    const { name, options = [], selectionChange = () => {} } = props;

    return (
        <FormControl component="fieldset">
            {/* <FormLabel component="legend">{label}</FormLabel> */}
            <RadioGroup
                aria-label="gender"
                name={name}
                value={form[name]}
                onChange={handleFormChange}
            >
                {options.map((option, i) => <FormControlLabel key={i} onClick={() => selectionChange(option)} value={option} control={<Radio />} label={option} />)}
            </RadioGroup>
        </FormControl>
    );
}

const Form: FunctionComponent<FormProps> = (props: FormProps) => {
    const { children, submit = () => { }, initialValues, buttonText, buttonSize } = props;

    const [form, setForm] = useState(initialValues);

    const handleFormChange = <T,>(event: T) => {
        const type = 'type' as keyof T;
        const target = 'target' as keyof T;
        

        if (event[type] as any === 'change') {
            const { name, value } = event[target] as any;
            setForm({
                ...form,
                [name]: value
            });
        } else {
            const { name, value } = event[target] as any;
            if (name && value) {
                setForm({
                    ...form,
                    [name]: value
                });
            } else {
                setForm({ ...form, showPassword: !form.showPassword });
            }
            
        }
    };

    return (
        <form autoComplete="off">
            <FormContext.Provider value={{
                form,
                handleFormChange
            }}>
                {children}
            </FormContext.Provider>

            <Button variant="contained" style={{marginBottom: '2%'}} size={buttonSize} color="secondary" onClick={() => submit(form)}>{buttonText}</Button>
        </form>
    );
}

export default Form;