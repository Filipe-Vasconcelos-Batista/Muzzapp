import { useState } from "react";
import { Link } from "react-router";
import {ChevronLeftIcon, EnvelopeIcon, EyeCloseIcon, EyeIcon} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import PageMeta from "../common/PageMeta.tsx";
import PageBreadcrumb from "../common/PageBreadCrumb.tsx";
import TextAreaInput from "../form/form-elements/TextAreaInput.tsx";
import ComponentCard from "../common/ComponentCard.tsx";

import InputGroup from "../form/form-elements/InputGroup.tsx";
import Select from "../form/Select.tsx";
import PhoneInput from "../form/group-input/PhoneInput.tsx";

export default function InsertSalonForm() {
  const countries = [
    { code: "PT", label: "+351" },
    { code: "Lux", label: "+352" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };
  return (
          <div>
    <PageMeta
            title="Muzzapp"
            description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
    />
    <PageBreadcrumb pageTitle="Salon" />
    <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-[630px] text-center">
        <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Insert Salon
        </h3>
      </div>
      <ComponentCard title="Salão">
        <div className="space-y-6">
          <div>
            <Label htmlFor="inputName">Nome</Label>
            <Input type="text" id="inputName"/>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Label htmlFor="inputEmail">Email</Label>
            <Input type="email" id="inputEmail"/>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Input
                        placeholder="info@gmail.com"
                        type="text"
                        className="pl-[62px]"
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
            <Input type="text" id="inputAdress"/>
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
                  selectPosition="start"
                  countries={countries}
                  placeholder="+351 91265845987"
                  onChange={handlePhoneNumberChange}
          />
        </div>
      </ComponentCard>

    </div>
          </div>
  );
}
