
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import WideFormContainer from "../base/containers/WideFormContainer";
import FormFieldText from "../base/form_field/FormFieldText";
import { axiosResponse } from "../../../api/axiosDefaults";
import { HStack } from "@chakra-ui/react";
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const UpdateEmailForm = () => {
    const {user} = useAuth();
    const [newEmail, setNewEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFieldChange = (fieldName, value) => {
        if (fieldName === "new_email") {
            setNewEmail(value);
            setErrors((prev) => ({ ...prev, email: undefined }));
        }
    };

    const updateEmail = async ( newEmail ) => {
        try {
            await axiosResponse.post("/api/account/update-email/", {
                email: newEmail,
            });

            return {
                success: true,
                errors: null,
            };

        } catch (error) {
            const data = error.response?.data;

            return {
                success: false,
                errors: data || {
                    non_field_errors: ["Update email failed",]
                }
            }
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        if (!newEmail) {return}
        if (newEmail === user?.email) {return}

        setLoading(true);
        setErrors({});
        setVerificationSent(false);

        const response = await updateEmail(
            newEmail
        );

        if (response.success) {
            setNewEmail("");
            setVerificationSent(true)
        } else {
            setErrors(response.errors);
        }

        setLoading(false);
    };


    return (
        <WideFormContainer>
            <FormFieldText
                field={{
                    name: "current_email",
                    label: "Current Email",
                    type: "email",
                    placeholder: user?.email || "User email undefined, Please refresh the page",
                }}
                disabled={true}
            />
            <FormFieldText
                field={{
                    name: "new_email",
                    label: "New Email",
                    type: "email",
                    placeholder: "Enter new email"
                }}
                value={newEmail}
                error={errors.email?.[0]}
                onChange={handleFieldChange}
            />

            <FormError>{errors.non_field_errors?.[0]}</FormError>

            <FormSubmitButton
                onClick={handleSubmit}
                disabled={!newEmail || loading}
            >
                <HStack gap={2} justify="center">
                    {loading && <ButtonSpinner />}
                    <span>{loading ? "Sending email..." : "Send verification email"}</span>
                </HStack>
            </FormSubmitButton>

            {verificationSent && (
                <>
                    <button>Resend Verification Link</button>
                    <button>Cancel Update</button>
                    <p>
                    A verification link has been sent to your new email address.
                    Please follow the instructions in email to verify and update your email.
                    </p>
                </>
            )}

        </WideFormContainer>
    )
};

export default UpdateEmailForm;
