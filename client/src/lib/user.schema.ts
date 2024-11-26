import * as yup from "yup";


export const signUpSchema = yup.object().shape({
    name: yup.string()
        .min(3, "Name must be at least 3 characters long.")
        .max(20, "Name cannot exceed 20 characters.")
        .required("Name is required."),
    email: yup.string()
        .email("Please enter a valid email address.")
        .required("Email address is required."),
    password: yup.string()
        .min(8, "Password must be at least 8 characters long.")
        .max(20, "Password cannot exceed 20 characters.")
        .required("Password is required.")
});

export const signInSchema = yup.object().shape({
    email: yup.string()
        .email("Please enter a valid email address.")
        .required("Email address is required."),
    password: yup.string()
        .min(8, "Password must be at least 8 characters long.")
        .max(20, "Password cannot exceed 20 characters.")
        .required("Password is required.")
});

export type SignUp = yup.InferType<typeof signUpSchema>