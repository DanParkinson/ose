
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormSubmitButtonDanger from "../base/buttons/FormSubmitButtonDanger";
import WideFormContainer from "../base/containers/WideFormContainer";
import FormFieldText from "../base/form_field/FormFieldText";
import { axiosResponse } from "../../../api/axiosDefaults";
import { HStack, Text } from "@chakra-ui/react";
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const UpdateEmailForm = () => {
    const {user} = useAuth();
    const [newEmail, setNewEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleFieldChange = (fieldName, value) => {
        if (fieldName === "new_email") {
            setNewEmail(value);
            setErrors((prev) => ({ ...prev, new_email: undefined }));
        }
    };

    const updateEmail = async ( newEmail ) => {
        try {
            await axiosResponse.post("/api/account/update-email/", {
                new_email: newEmail,
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

        setLoading(true);
        setErrors({});
        setVerificationSent(false);

        const response = await updateEmail(
            newEmail
        );

        if (response.success) {
            setVerificationSent(true)
        } else {
            setErrors(response.errors);
        }

        setLoading(false);
    };

    const handleResend = async () => {
        if (!newEmail || resendLoading) return;

        setResendLoading(true);
        setResendSuccess(false);
        setErrors({});

        const response = await updateEmail(newEmail);

        if (response.success) {
            setResendSuccess(true);
            setErrors({});
        } else {
            setErrors(response.errors || {});
        }

        setResendLoading(false);
    };

    const handleCancel = async () => {
        try {
            await axiosResponse.post(
                "/api/account/update-email/cancel/"
            );

            setVerificationSent(false);
            setResendSuccess(false);
            setNewEmail("");
            setErrors({});
        } catch (error) {
            const data = error.response?.data;

            setErrors(
                data || {
                    non_field_errors: ["Cancel update failed."],
                }
            );
        }
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
                disabled={verificationSent}
                error={errors.new_email?.[0]}
                onChange={handleFieldChange}
            />

            <FormError>{errors.non_field_errors?.[0]}</FormError>

            {!verificationSent && (
                <FormSubmitButton
                    onClick={handleSubmit}
                    disabled={!newEmail || loading}
                >
                    <HStack gap={2} justify="center">
                        {loading && <ButtonSpinner />}
                        <span>{loading ? "Sending email..." : "Send verification email"}</span>
                    </HStack>
                </FormSubmitButton>
            )}

            {verificationSent && (
            <>
                <Text color="text.primarylight">
                A verification link has been sent to your new email address. Please follow the instructions in email to verify and update your email.
                </Text>

                <FormSubmitButton
                onClick={handleResend}
                disabled={resendLoading}
                >
                <HStack gap={2} justify="center">
                    {resendLoading && <ButtonSpinner />}
                    <span>
                    {resendLoading
                        ? "Resending..."
                        : "Resend Verification Link"}
                    </span>
                </HStack>
                </FormSubmitButton>

                {resendSuccess && (
                <Text color="text.primarylight">
                    A new verification link has been sent.
                </Text>
                )}

                <FormSubmitButtonDanger
                    onClick={handleCancel}
                >
                    Cancel Update
                </FormSubmitButtonDanger>
            </>
            )}

        </WideFormContainer>
    )
};

export default UpdateEmailForm;
