import {JSX, useState} from "react";
import {ChevronDownIcon} from "../../icons";

const AccordionComponentCard: ({title, children, className, desc}: {
    title: string;
    children: React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string;
    defaultOpen?: boolean;
}) => JSX.Element = (
        {
            title,
            children,
            className = "",
            desc = "",
            defaultOpen= true
        }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
            <div
                    className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
            >
                {/* Header */}
                <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                    <div>
                        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                            {title}
                        </h3>
                        {desc && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {desc}
                                </p>
                        )}
                    </div>
                    <ChevronDownIcon
                            className={`w-5 h-5 transition-transform duration-200 ${
                                    isOpen ? "rotate-180 text-brand-500" : "text-gray-400"
                            }`}
                    />
                </button>

                {/* Body */}
                <div
                        className={`overflow-hidden transition-all duration-300 border-t border-gray-100 dark:border-gray-800 ${
                                isOpen ? "max-h-[1000px] p-4 sm:p-6" : "max-h-0 p-0"
                        }`}
                >
                    {isOpen && <div className="space-y-6">{children}</div>}
                </div>
            </div>
    );
};

export default AccordionComponentCard;
