import { createContext, useContext, useState, useEffect } from "react";
import {Salon} from "../types/Salons.ts";
import {fetchWithAuth, getJwtData} from "../utils/Auth.ts";


const defaultSalons: Salon[] = [
    {
        id: 1,
        name: " Joana Dona e trabalhadora",
        phone: "+351685995985",
        email: "filipe@live.com",
        address: "aaakaakajknjaakakaa",
        salonRoles: [
            {
                roles: ["Owner", "Worker"],
            },
        ],
    },
    {
        id: 2,
        name: "Dona do salão",
        phone: "+351685995985",
        email: "filipe@live.com",
        address: "aaakaakajknjaakakaa",
        salonRoles: [
            {
                roles: ["Owner"],
            },
        ],
    },
    {
        id: 3,
        name: "Trabalhadora Do salão",
        phone: "+351685995985",
        email: "filipe@live.com",
        address: "aaakaakajknjaakakaa",
        salonRoles: [
            {
                roles: ["Worker"],
            },
        ],
    },
];

type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
  salons: Salon[];
  setSalons: (salons: Salon[]) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);


    useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

        const fetchSalons = async () => {
            try {
                const userId = getJwtData("id"); // or whatever field your token stores as user ID
                if (!userId) throw new Error("User ID not found in JWT");

                const response = await fetchWithAuth(`/salon/owner/${userId}`);
                const result = await response.json();

                if (result.success) {
                    setSalons(result.salons);
                } else {
                    console.warn("🚫 Failed to load salons:", result);
                    setSalons(defaultSalons);
                }
            } catch (err) {
                console.error("❌ Error fetching salons:", err);
                setSalons(defaultSalons);
            }
        };
    handleResize();
    fetchSalons();

    window.addEventListener("resize", handleResize);


    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const toggleSubmenu = (item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
          salons,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
        setSalons
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
