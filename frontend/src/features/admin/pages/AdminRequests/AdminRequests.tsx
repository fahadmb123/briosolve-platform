import { useSearchParams } from 'react-router-dom';
import AdminVerification from '../../../verification/pages/AdminVerification/AdminVerification';
import Reactivations from '../../../account-reactivation/pages/Reactivations/Reactivations';
import AdminRequestsSubnav from '../../components/AdminRequestsSubnav';

export default function AdminRequests() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') === 'reactivations' ? 'reactivations' : 'verifications';

    const handleTabChange = (tab: 'verifications' | 'reactivations') => {
        setSearchParams({ tab });
    };

    return (
        <div className="app-content">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
                <div>
                    <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>Requests Management</h1>
                    <p className="text-secondary text-sm mb-0">
                        {activeTab === 'verifications'
                            ? 'Evaluate trade diplomas, municipal licenses, and government IDs prior to granting marketplace Verified badges.'
                            : 'Evaluate and adjudicate formal appeals submitted by suspended customers and providers seeking marketplace reinstatement.'}
                    </p>
                </div>
            </div>

            <AdminRequestsSubnav activeTab={activeTab} onTabChange={handleTabChange} />

            {activeTab === 'verifications' ? <AdminVerification /> : <Reactivations />}
        </div>
    );
}

