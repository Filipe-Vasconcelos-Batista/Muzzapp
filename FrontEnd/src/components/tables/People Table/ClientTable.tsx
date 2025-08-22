import React, {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import {fetchWithAuth} from "../../../utils/Auth.ts";
import {useParams} from "react-router-dom";
import {Link} from "react-router";

interface BackendUser{
    id: number;
    UserId:{
        firstName: string;
        lastName: string;
    };
    title: string |null;
    roles: string[];
    isActive:boolean;
}
interface Order {
    id: number;
    user: {
        image: string;
        name: string;
        role: string;
        borderColor: string;
    };
    Role: string;
    Work: {
        client: string;
        work:   string;
    };
    Faturação: string;
    status: string;
}

export default function WorkerTable() {
    const { salonId } = useParams<{ salonId: string }>();
    const [tableData, setTableData] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const demoClients = ["Joaquina", "Maria", "Carla", "Andreia", "Sandra", "Helena"];
    const demoWorks = [
        "Unha 3D Espetacular",
        "Pintura Floral",
        "Cílios Volume Russo",
        "Massagem Relaxante",
        "Pedicure Premium",
        "Design de Sobrancelha"
    ];
    const demoFaturacao = ["1.2K", "3.9K", "5.1K", "820", "2.5K", "4.7K"];
    const demoImages = [
        "/images/user/user-14.jpg",
        "/images/user/user-15.jpg",
        "/images/user/user-16.jpg",
        "/images/user/user-17.jpg",
        "/images/user/user-18.jpg",
        "/images/user/user-19.jpg"
    ];

    const demoBorderColors = ["#FF0000", "#007BFF", "#28A745", "#FFC107", "#6F42C1"];
    const randomFromArray = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    useEffect(()=>{
        const loadUsers= async ()=>{
            try{
                const res= await fetchWithAuth(`/salon/users/${salonId}`);
                if (!res.ok) throw new Error ('Failed to fretch salon users');
                const users: BackendUser[]= await res.json();

                const mappedData= users.map((u):Order=>({
                    id: u.id,
                    user:{
                        name: `${u.UserId.firstName} ${u.UserId.lastName}`,
                        role: u.title || ' ',
                        image:randomFromArray(demoImages),
                        borderColor: randomFromArray(demoBorderColors),
                    },
                    Role: u.roles.join (" , "),
                    Work:{
                        client: randomFromArray(demoClients),
                        work: randomFromArray(demoWorks),
                    },
                    Faturação: randomFromArray(demoFaturacao),
                    status: u.isActive ? "Active" : "Inactive"
                }))
                setTableData(mappedData);
            }catch(err){
                console.error(err);
            }finally{
                setLoading(false)
            }
        };
        loadUsers();
    }, [salonId]);
    if (loading){
        return <div>Loading...</div>
    }

    return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Utilizador
                                </TableCell>
                                <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Autorização
                                </TableCell>
                                <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Trabalhos
                                </TableCell>
                                <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Status
                                </TableCell>
                                <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Faturação
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {tableData.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full border-2 "
                                                     style={{ borderColor: order.user.borderColor }}>
                                                    <img
                                                            width={40}
                                                            height={40}
                                                            src={order.user.image}
                                                            alt={order.user.name}
                                                    />
                                                </div>
                                                <div>
                                                    <Link to={`/profile`}>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.user.name}
                        </span>
                                                    </Link>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.user.role}
                      </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {order.Role}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex -space-x-2">
                                                {order.Work.client}: {order.Work.work}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Badge
                                                    size="sm"
                                                    color={
                                                        order.status === "Active"
                                                                ? "success"
                                                                : order.status === "Pending"
                                                                        ? "warning"
                                                                        : "error"
                                                    }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {order.Faturação}
                                        </TableCell>
                                    </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
    );
}
