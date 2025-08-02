import React, { useState } from "react";

interface CountryCode {
    code: string;
    label: string;
    regex: RegExp
}
const countries = [
    { code: "PT", label: "+351", regex: /^\+351\d{9}$/ },
    { code: "LU", label: "+352", regex: /^\+352\d{8}$/ },
    { code: "FR", label: "+33", regex: /^\+33\d{9}$/ },
    { code: "DE", label: "+49", regex: /^\+49\d{10,11}$/ },
    { code: "US", label: "+1", regex: /^\+1\d{10}$/ },
    { code: "BR", label: "+55", regex: /^\+55\d{10,11}$/ },
    { code: "IN", label: "+91", regex: /^\+91\d{10}$/ },
];

const PhoneInput: ({placeholder, onChange, selectPosition, value, required}: {
    countries: CountryCode[],
    type?:string
    placeholder?: string;
    onChange:  (phoneNumber: string) => void,
    selectPosition?:  "start" | "end",
    value: string;
    required?: boolean
}) => JSX.Element = (
        {
            placeholder = "+1 (555) 000-0000",
            onChange,
            selectPosition = "start",
            value,
            required = false,
        }) => {
    const [selectedCountry, setSelectedCountry] = useState<string>("PT");
    const [phoneNumber, setPhoneNumber] = useState<string>("+351");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [error, setError] = useState(false);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountry = e.target.value;
        setSelectedCountry(newCountry);
        const newPrefix = countries.find(c => c.code === newCountry)?.label || "";
        setPhoneNumber(newPrefix);
        if (onChange) {
            onChange(newPrefix);
        }
    };
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoneNumber = e.target.value;
        setPhoneNumber(newPhoneNumber);

        const country = countries.find(c => c.code === selectedCountry);
        const isEmpty = required && newPhoneNumber.trim() === "";


        if (isEmpty) {
            setErrorMessage("Phone number is required.");
            setSuccessMessage("");
            setError(true);
        } else if (country?.regex && !country.regex.test(newPhoneNumber)) {
            setErrorMessage("Invalid phone number format.");
            setSuccessMessage("");
            setError(true);
        } else {
            setErrorMessage("");
            setSuccessMessage(" ");
            setError(false);
        }

        if (onChange) {
            onChange(newPhoneNumber);
        }
    };

    const inputBaseClasses = `h-11 w-full rounded-lg bg-transparent py-3 px-4 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 transition-colors duration-300 ${
            selectPosition === "start" ? "pl-[84px]" : "pr-[84px]"
    }`;

    let inputBorderClasses = "border border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800";

    if (error) {
        inputBorderClasses = "border border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500 dark:focus:border-error-800";
    } else if (successMessage) {
        inputBorderClasses = "border border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:border-success-500 dark:focus:border-success-800";
    }

    const inputTextClasses = "text-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30";

    const fullInputClasses = `${inputBaseClasses} ${inputBorderClasses} ${inputTextClasses}`;



    return (
            <div className="relative flex flex-col">
                <div className="relative flex">
                    {selectPosition === "start" && (
                            <div className="absolute">
                                <select
                                        value={selectedCountry}
                                        onChange={handleCountryChange}
                                        className="appearance-none bg-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
                                >
                                    {countries.map((country) => (
                                            <option
                                                    key={country.code}
                                                    value={country.code}
                                                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                                            >
                                                {country.code}
                                            </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none bg-none right-3 dark:text-gray-400">
                                    <svg
                                            className="stroke-current"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                    )}

                    <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder={placeholder}
                            className={fullInputClasses}
                    />

                    {selectPosition === "end" && (
                            <div className="absolute right-0">
                                <select
                                        value={selectedCountry}
                                        onChange={handleCountryChange}
                                        className="appearance-none bg-none rounded-r-lg border-0 border-l border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
                                >
                                    {countries.map((country) => (
                                            <option
                                                    key={country.code}
                                                    value={country.code}
                                                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                                            >
                                                {country.code}
                                            </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400">
                                    <svg
                                            className="stroke-current"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                    )}
                </div>

                {/* Error Message */}
                {errorMessage && (
                        <p className="mt-1.5 text-xs text-error-500">
                            {errorMessage}
                        </p>
                )}
                {successMessage && (
                        <p className="mt-1.5 text-xs text-success-500">
                            {successMessage}
                        </p>
                )}
            </div>
    );
};

export default PhoneInput;
