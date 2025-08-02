import { useState } from "react";
import { EnvelopeIcon} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import PageBreadcrumb from "../common/PageBreadCrumb.tsx";
import ComponentCard from "../common/ComponentCard.tsx";
import PhoneInput from "../form/group-input/PhoneInput.tsx";
import Button from "../ui/button/Button.tsx";
import Alert from "../ui/alert/Alert.tsx";
import {fetchWithAuth} from "../../utils/Auth.ts";

export default function InsertSalonForm() {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async () => {
    const payload = {
      name,
      phone,
      website,
      email,
      address
    };


    try {
      console.log(payload);
      const response = await fetchWithAuth("/salon/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log("Salon created:", result);
      setSuccessMessage("Salão criado com sucesso!");
      setErrorMessage("");
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Erro ao criar o salão. Tente novamente.");
      setSuccessMessage("");
    }
  };

  const countries = [
    { code: "PT", label: "+351" },
    { code: "Lux", label: "+352" },
  ];


  return (
          <div>
    <PageBreadcrumb pageTitle="Salon" />
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-[630px] text-center">
        <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Criar novo Salão
        </h3>
      </div>
      <ComponentCard title="Salão">
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
            <div>
              <Label htmlFor="inputName">Nome</Label>
              <Input
                      type="text"
                      id="inputName"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <Label htmlFor="inputUrl">Website</Label>
              <Input
                      type="url"
                      id="inputUrl"
                      value={website}
                      required
                      onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
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
          <div className="space-y-6">
            <div>
              <Label htmlFor="inputAdress">Morada</Label>
              <Input
                      type="text"
                      id="inputAdress"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
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
      </ComponentCard>

    </div>
          </div>
  );
}
