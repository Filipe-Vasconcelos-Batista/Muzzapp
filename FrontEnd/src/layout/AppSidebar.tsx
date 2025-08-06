import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { Link, useLocation } from "react-router";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon, PlusIcon, ShootingStarIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, salons } = useSidebar();
  const location = useLocation();

  const salonNavItems = salons.map((salon) => {
    const roles = salon.salonRoles.flatMap((r) => r.roles);
    const isOwner = roles.includes("Owner");
    const isWorker = roles.includes("Worker");

    const subItems = [];

    // Worker-only pages
    if (isWorker) {
      subItems.push(
              { name: "Calendario", path: `/salon/${salon.id}/minha agenda`, pro: false },
              { name: "Time Off", path: `/salon/${salon.id}/timeOff`, pro: false },
              { name: "notificações pessoais", path: `/salon/${salon.id}/programar horarios`, pro: false },
      );
    }

    // Owner-only pages
    if (isOwner) {
      subItems.push(
              { name: "Gestão trabalhador", path: `/salon/${salon.id}/ManagePeople`, pro: false },
              { name: "Add Serviços", path: `/salon/${salon.id}/add-serviçoes`, pro: false },
              { name: "Alterar Horarios", path: `/salon/${salon.id}/programar horarios`, pro: false },
              { name: "dashboard", path: `/salon/${salon.id}/horarios`, pro: false },
              { name: "Notificações do slão", path: `/salon/${salon.id}/programar horarios`, pro: false },
              { name: "Fazer Marcações Manuais", path: `/salon/${salon.id}/settings`, pro: false },
              { name: "Perfil do salão", path: `/salon/${salon.id}/settings`, pro: false },
              { name: "Settings", path: `/salon/${salon.id}/settings`, pro: false },
              { name: "Gerir Agendas", path: `/salon/${salon.id}/settings`, pro: false }
      );
    }

    return {
      name: salon.name,
      icon: <ShootingStarIcon />,
      subItems,
    };
  });

  const navItems: NavItem[] = useMemo(() => [
    {
      name: "Create Salon",
      icon: <PlusIcon/> ,
      path:"/salon"
    },

      ...salonNavItems
    ,
    {
      icon: <GridIcon />,
      name: "Dashboard",
      subItems: [{ name: "Ecommerce", path: "/dash", pro: false }],
    },
    {
      icon: <CalenderIcon />,
      name: "Calendar",
      path: "/calendar",
    },
    {
      icon: <UserCircleIcon />,
      name: "User Profile",
      path: "/profile",
    },
    {
      name: "Forms",
      icon: <ListIcon />,
      subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
    },
    {
      name: "Tables",
      icon: <TableIcon />,
      subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
    },
    {
      name: "Pages",
      icon: <PageIcon />,
      subItems: [
        { name: "Blank Page", path: "/blank", pro: false },
        { name: "404 Error", path: "/error-404", pro: false },
      ],
    }
  ],[salons]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
          <aside
                  className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
                          isExpanded || isMobileOpen
                                  ? "w-[290px]"
                                  : isHovered
                                          ? "w-[290px]"
                                          : "w-[90px]"
                  }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
                  onMouseEnter={() => !isExpanded && setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
          >

            <div
                    className={`py-8 flex ${
                            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                    }`}
            >
              <Link to="/">
                {isExpanded || isHovered || isMobileOpen ? (
                        <>
                          <img
                                  src="/images/logo/muzzapp.svg"
                                  alt="muzzapp"
                                  width={190}
                                  height={40}
                          />
                        </>
                ) : (
                        <img
                                src="/images/logo/muzzapp.svg"
                                alt="Logo"
                                width={15}
                                height={15}
                        />
                )}
              </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
              <nav className="mb-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <h2
                            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                            ? "lg:justify-center"
                                            : "justify-start"
                            }`}
                    >
                      {isExpanded || isHovered || isMobileOpen ? (
                              "Menu"
                      ) : (
                              <HorizontaLDots className="size-6"/>
                      )}
                    </h2>
                    {renderMenuItems(navItems, "main")}
                  </div>
                  <div className="">
                    <h2
                            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                            ? "lg:justify-center"
                                            : "justify-start"
                            }`}
                    >
                      {isExpanded || isHovered || isMobileOpen ? (
                              "Others"
                      ) : (
                              <HorizontaLDots/>
                      )}
                    </h2>
                    {renderMenuItems(othersItems, "others")}
                  </div>
                </div>
              </nav>
              {isExpanded || isHovered || isMobileOpen ? <SidebarWidget/> : null}
            </div>
            <div aria-hidden="true"
                 className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
              <div style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}
                   className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"></div>
            </div>
          </aside>
  );
};

export default AppSidebar;
