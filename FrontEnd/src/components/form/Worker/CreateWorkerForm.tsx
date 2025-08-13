import { useState} from "react";
import { EnvelopeIcon} from "../../../icons";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import PhoneInput from "../group-input/PhoneInput.tsx";
import Button from "../../ui/button/Button.tsx";
import Alert from "../../ui/alert/Alert.tsx";
import {fetchWithAuth} from "../../../utils/Auth.ts";
import Checkbox from "../input/Checkbox.tsx";
import AccordeonComponentCards from "../../common/AccordeonComponentCards.tsx";

export default function CreateWorker() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const[email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSystemEmail, setIsSystemEmail] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const handleSubmit = async () => {
        const payload = {
            firstName,
            lastName,
            password,
            phoneNumber: phone,
            isSystemEmail: false
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
                setSuccessMessage("Salão criado com sucesso!");
                setErrorMessage("");
            }else{
                setErrorMessage('Error ao criar funcionário.')
                setSuccessMessage('')
            }

        } catch (error) {
            console.error("Submission error:", error);
            setErrorMessage("Erro ao comunicar com o servidor.");
            setSuccessMessage("");
        }
    };

    return (
                    <AccordeonComponentCards title="Criar Colaborador/a" defaultOpen={false}>
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

                        <div className="flex items-center gap-3">
                            <Checkbox
                                    checked={isSystemEmail}
                                    onChange={(checked) => setIsSystemEmail(checked)}
                            />
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Gerar um email de sistema?
          </span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="inputName">Nome</Label>
                                <Input
                                        type="text"
                                        id="inputName"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="inputUrl">Apelido</Label>
                                <Input
                                        type="text"
                                        id="inputUrl"
                                        value={lastName}
                                        required
                                        onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="inputUrl">Password</Label>
                                <Input
                                        type="password"
                                        id="inputUrl"
                                        value={password}
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        {!isSystemEmail && (
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
                        )}
                        <div>
                            <Label>Phone</Label>
                            <PhoneInput
                                    selectPosition="start"
                                    type='cell'
                                    value={phone}
                                    required
                                    placeholder="+351 91265845987"
                                    onChange={(value) => setPhone(value)}
                            />
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
