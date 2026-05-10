import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/badge";
import { Pagination } from "../ui/Pagination";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getDeudores } from '../../api/cuenta-corriente';

interface Deudor {
    paciente: {
        id: string;
        nombre: string;
        apellido: string;
        obra_social?: string;
    };
    deudaTotal: number;
    fechaDesde: string;
}

const DebtorsReport = () => {
    const [deudores, setDeudores] = useState<Deudor[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchDeudores = async () => {
            try {
                const data = await getDeudores();
                setDeudores(data);
            } catch (error) {
                console.error("Error fetching debtors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeudores();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        try {
            // Fix timezone issue by splitting string
            const [year, month, day] = dateString.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return format(date, "d 'de' MMM. yyyy", { locale: es });
        } catch (e) {
            return dateString;
        }
    };

    const { paginatedDeudores, totalPages } = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            paginatedDeudores: deudores.slice(startIndex, endIndex),
            totalPages: Math.ceil(deudores.length / itemsPerPage)
        };
    }, [deudores, currentPage, itemsPerPage]);

    return (
        <div className="bg-[#f0f2f5] min-h-screen p-4 sm:p-8 rounded-3xl font-sans space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Reporte de Deudores</h1>
                  <p className="text-gray-500 mt-1">Control de pacientes con saldo pendiente</p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>Estas viendo:</span>
                <Badge variant="secondary" className="rounded-full px-4 font-normal bg-white border border-gray-200">
                    Deudores históricos
                </Badge>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Cargando deudores...</div>
                    ) : deudores.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No hay deudores registrados.</div>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-100">
                                {paginatedDeudores.map((deudor, index) => (
                                    <div key={index} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-gray-900 uppercase">
                                                    {deudor.paciente.apellido} {deudor.paciente.nombre}
                                                </h3>
                                                <span className="text-gray-500 uppercase text-sm">
                                                    {deudor.paciente.obra_social || 'PARTICULAR'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Deuda desde: {formatDate(deudor.fechaDesde)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-medium text-gray-900">
                                                {formatCurrency(deudor.deudaTotal)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={deudores.length}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DebtorsReport;
