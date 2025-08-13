import { useState} from "react";
import { EnvelopeIcon} from "../../../icons";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Button from "../../ui/button/Button.tsx";
import Alert from "../../ui/alert/Alert.tsx";
import {fetchWithAuth} from "../../../utils/Auth.ts";
import AccordeonComponentCards from "../../common/AccordeonComponentCards.tsx";

export default function AddWorker() {
    const[email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const handleSubmit = async () => {
        const payload = {
            email,
        };
        const { salonId } = useParams()


        try {
            const response = await fetchWithAuth(`/api/salon/user/role/${salonId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.Success) {
                console.log("Salon created:", result);
                setSuccessMessage("Utilizador Encontrado");
                setErrorMessage("");
            }else{
                setErrorMessage('Error ao Adicionar funcionário.')
                setSuccessMessage('')
            }

        } catch (error) {
            console.error("Submission error:", error);
            setErrorMessage("Erro ao comunicar com o servidor.");
            setSuccessMessage("");
        }
    };

    return (
            <AccordeonComponentCards title="Adicionar Colaborador" defaultOpen={false}>
                <>
                    {successMessage ? (
                            <Alert
                                    variant="success"
                                    title="Sucesso"
                                    message={successMessage}
                                    showLink={false}
                            />
                    ) : null}

                    {errorMessage ? (
                            <Alert
                                    variant="error"
                                    title="Ups..."
                                    message={errorMessage}
                                    showLink={false}
                            />
                    ) : null}
                </>
                <div className="space-y-6">
                    <div className="space-y-6">
                        <div>
                            <Label>Email</Label>
                            <div className="relative">
                                <Input
                                        placeholder="info@gmail.com"
                                        type="email"
                                        value={email}
                                        required
                                        className="pl-[62px]"
                                        onChange={(e) => setEmail(e.target.value)}
                                />
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                    <EnvelopeIcon/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end w-full">
                    <Button size="sm"
                            type='button'
                            variant="primary"
                            className="w-full sm:w-auto"
                            onClick={handleSubmit}
                    >
                        Submeter
                    </Button>
                </div>
            </AccordeonComponentCards>);
}
