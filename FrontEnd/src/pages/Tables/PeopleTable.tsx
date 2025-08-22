import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import WorkerTable from "../../components/tables/People Table/WorkerTable.tsx";
import CreateWorker from "../../components/form/Worker/CreateWorkerForm.tsx";
import AccordeonComponentCards from "../../components/common/AccordeonComponentCards.tsx";
import AddWorker from "../../components/form/Worker/AddWorkerForm.tsx";

export default function WorkerManagement() {
    return (
            <>
                <PageBreadcrumb pageTitle="Gestão de Utilizadores"/>
                <div className="space-y-6">
                    <CreateWorker/>
                </div>
                <div className="space-y-6">
                    <AddWorker/>
                </div>
                <div className="space-y-6">
                    <ComponentCard title="Colaboradores">
                        <WorkerTable/>
                    </ComponentCard>
                </div>
            </>
    );
}
