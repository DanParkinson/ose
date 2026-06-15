// React
import { useEffect, useState } from "react";

// React Router
import { useNavigate, useParams } from "react-router-dom";

// Chakra UI
import { HStack, Text } from "@chakra-ui/react";

// API
import { axiosResponse } from "../../../api/axiosDefaults";

// Hooks
import useAuth from "../../../hooks/useAuth";

// Feedback
import ButtonSpinner from "../../feedback/ButtonSpinner";

// Form Components
import WideFormContainer from "../base/containers/WideFormContainer";

const UpdateEmailConfirmForm = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const { fetchUser } = useAuth();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const confirmEmailChange = async () => {
            try {
                await axiosResponse.post(
                    "/api/account/update-email/confirm/",
                    {
                        uid,
                        token,
                    }
                );

                await fetchUser();

                navigate("/account");
            } catch (error) {
                const data = error.response?.data;

                setErrors(
                    data || {
                        non_field_errors: [
                            "This email change link is invalid or has expired.",
                        ],
                    }
                );
            }

        };

        confirmEmailChange();
    }, [uid, token, fetchUser, navigate]);

    if (
        errors?.detail ||
        errors?.non_field_errors?.[0]
    ) {
        return (
            <WideFormContainer>
                <Text color="text.primarylight">
                    {errors?.detail || errors?.non_field_errors?.[0]}
                </Text>
            </WideFormContainer>
        );
    }

    return (
        <WideFormContainer>
            <HStack justify="center" gap={2}>
                <ButtonSpinner />
                <Text color="text.primarylight">
                    Verifying your new email address...
                </Text>
            </HStack>
        </WideFormContainer>
    );
};

export default UpdateEmailConfirmForm;
